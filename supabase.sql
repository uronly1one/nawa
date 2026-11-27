-- =====================================================================
-- NAWA · Tambak Bersholawat  —  Database v1.0
-- Jalankan SEKALI di Supabase → SQL Editor → New query → Run
-- =====================================================================

create schema if not exists private;

-- ---------- Profil anggota ----------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nama       text not null,
  wa         text not null unique,
  alamat     text not null,
  foto_url   text,
  created_at timestamptz default now()
);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- PIN disimpan di schema private (tidak bisa diakses lewat API publik)
create table private.member_pins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pin     text not null
);
create table private.pin_attempts (wa text, at timestamptz default now());

-- ---------- Helper admin ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = auth.uid())
$$;

-- ---------- Trigger: registrasi otomatis membuat profil ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.raw_user_meta_data ? 'nama' then
    insert into public.profiles (id, nama, wa, alamat)
    values (new.id,
            trim(new.raw_user_meta_data->>'nama'),
            new.raw_user_meta_data->>'wa',
            trim(new.raw_user_meta_data->>'alamat'));
    insert into private.member_pins (user_id, pin)
    values (new.id, new.raw_user_meta_data->>'pin');
    -- hapus PIN dari metadata supaya tidak tersimpan ganda
    update auth.users set raw_user_meta_data = raw_user_meta_data - 'pin' where id = new.id;
  end if;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Lupa PIN (maks. 5 percobaan / 15 menit per nomor WA) ----------
create or replace function public.lupa_pin(p_nama text, p_wa text, p_alamat text default null)
returns text language plpgsql security definer set search_path = '' as $$
declare r text;
begin
  if (select count(*) from private.pin_attempts
        where wa = p_wa and at > now() - interval '15 minutes') >= 5 then
    raise exception 'terlalu_banyak';
  end if;
  insert into private.pin_attempts (wa) values (p_wa);

  select m.pin into r
  from public.profiles p
  join private.member_pins m on m.user_id = p.id
  where p.wa = p_wa
    and lower(trim(p.nama)) = lower(trim(p_nama))
    and (coalesce(trim(p_alamat), '') = '' or lower(trim(p.alamat)) = lower(trim(p_alamat)));
  return r;
end $$;

revoke all on function public.lupa_pin(text, text, text) from public;
grant execute on function public.lupa_pin(text, text, text) to anon, authenticated;

-- ---------- Tabel konten ----------
create table public.pengumuman (
  id uuid primary key default gen_random_uuid(),
  isi text not null,
  created_at timestamptz default now()
);
create table public.agenda (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  jenis text not null default 'rutin',      -- rutin / tahunan / khusus
  hari text,                                 -- contoh: Malam Jumat
  tanggal date,
  waktu text,
  lokasi text,
  keterangan text,
  created_at timestamptz default now()
);
create table public.pustaka (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text not null default 'teks',    -- teks / ebook / audio / arsip
  isi text,
  url text,
  created_at timestamptz default now()
);
create table public.kelompok (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  info text,
  kontak text,
  created_at timestamptz default now()
);
create table public.galeri (
  id uuid primary key default gen_random_uuid(),
  judul text,
  foto_url text not null,
  created_at timestamptz default now()
);
create table public.program (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  keterangan text,
  status text,
  created_at timestamptz default now()
);
create table public.donasi (
  id uuid primary key default gen_random_uuid(),
  nama_kanal text not null,
  nomor text,
  atas_nama text,
  keterangan text,
  created_at timestamptz default now()
);
create table public.laporan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  isi text,
  tanggal date,
  created_at timestamptz default now()
);
create table public.usulan (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  isi text,
  user_id uuid references auth.users(id) on delete set null,
  nama text,
  created_at timestamptz default now()
);

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.admins   enable row level security;
alter table public.usulan   enable row level security;

create policy "profil sendiri/admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "ubah profil sendiri" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant  update (alamat, foto_url) on public.profiles to authenticated;   -- nama & WA tidak bisa diubah

create policy "cek admin sendiri" on public.admins for select to authenticated
  using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['pengumuman','agenda','pustaka','kelompok','galeri','program','donasi','laporan']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "anggota baca" on public.%I for select to authenticated using (true)', t);
    execute format('create policy "admin kelola" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

create policy "baca usulan"   on public.usulan for select to authenticated using (true);
create policy "kirim usulan"  on public.usulan for insert to authenticated with check (user_id = auth.uid());
create policy "hapus usulan"  on public.usulan for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "admin ubah usulan" on public.usulan for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('media',   'media',   true)
on conflict (id) do nothing;

create policy "baca file publik" on storage.objects for select
  using (bucket_id in ('avatars', 'media'));
create policy "unggah foto sendiri" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "ganti foto sendiri" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "admin kelola media" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- AKUN ADMIN (master)
-- 1. Supabase → Authentication → Users → Add user → Create new user
--    isi email + password admin, centang "Auto Confirm User"
-- 2. Jalankan baris ini (ganti emailnya):
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'admin@emailkamu.com';
-- =====================================================================
