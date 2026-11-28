-- =====================================================================
-- NAWA · UPDATE v1.9  (mode tamu: baca kabar, agenda, postingan tanpa akun)
-- Jalankan SEKALI di SQL Editor project "nawa". Aman bila terjalan dua kali.
-- Pustaka, Komunitas, dan Support TETAP hanya untuk yang punya akun.
-- =====================================================================

drop policy if exists "tamu baca pengumuman" on public.pengumuman;
create policy "tamu baca pengumuman" on public.pengumuman for select to anon using (true);

drop policy if exists "tamu baca agenda" on public.agenda;
create policy "tamu baca agenda" on public.agenda for select to anon using (true);

drop policy if exists "tamu baca postingan" on public.posts;
create policy "tamu baca postingan" on public.posts for select to anon using (true);

-- Jumlah like & komentar untuk tamu dan anggota, tanpa membuka isi komentar
create or replace function public.post_stats(p_ids uuid[])
returns table(post_id uuid, likes bigint, coms bigint, liked boolean)
language sql stable security definer set search_path = '' as $$
  select p.id,
    (select count(*) from public.post_likes l where l.post_id = p.id),
    (select count(*) from public.post_comments c where c.post_id = p.id),
    exists (select 1 from public.post_likes l where l.post_id = p.id and l.user_id = auth.uid())
  from public.posts p
  where p.id = any(p_ids)
$$;

revoke all on function public.post_stats(uuid[]) from public;
grant execute on function public.post_stats(uuid[]) to anon, authenticated;

notify pgrst, 'reload schema';
