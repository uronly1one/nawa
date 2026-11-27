-- =====================================================================
-- NAWA · UPDATE v1.1  (postingan Beranda: gambar, like, komentar)
-- Jalankan SEKALI di SQL Editor project "nawa". JANGAN jalankan supabase.sql lagi.
-- =====================================================================

create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  isi         text,
  gambar_url  text,
  created_at  timestamptz default now(),
  constraint posts_isi_atau_gambar check (coalesce(trim(isi), '') <> '' or gambar_url is not null)
);

create table public.post_likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

create table public.post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade default auth.uid(),
  nama       text not null,
  isi        text not null check (length(trim(isi)) between 1 and 500),
  created_at timestamptz default now()
);

-- Nama pengomentar diambil otomatis dari profil (tidak bisa dipalsukan); admin tampil "Admin"
create or replace function public.set_comment_name() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  select p.nama into new.nama from public.profiles p where p.id = new.user_id;
  new.nama := coalesce(new.nama, 'Admin');
  return new;
end $$;

create trigger comment_name before insert on public.post_comments
  for each row execute function public.set_comment_name();

alter table public.posts         enable row level security;
alter table public.post_likes    enable row level security;
alter table public.post_comments enable row level security;

create policy "baca postingan" on public.posts for select to authenticated using (true);
create policy "admin kelola postingan" on public.posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "baca like" on public.post_likes for select to authenticated using (true);
create policy "beri like" on public.post_likes for insert to authenticated with check (user_id = auth.uid());
create policy "cabut like" on public.post_likes for delete to authenticated using (user_id = auth.uid());

create policy "baca komentar" on public.post_comments for select to authenticated using (true);
create policy "kirim komentar" on public.post_comments for insert to authenticated with check (user_id = auth.uid());
create policy "hapus komentar" on public.post_comments for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Penyimpanan gambar postingan (batas keras 1 MB di sisi server juga)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts', 'posts', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "baca gambar postingan" on storage.objects for select using (bucket_id = 'posts');
create policy "admin kelola gambar postingan" on storage.objects for all to authenticated
  using (bucket_id = 'posts' and public.is_admin())
  with check (bucket_id = 'posts' and public.is_admin());
