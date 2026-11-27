-- =====================================================================
-- NAWA · UPDATE v1.8  (postingan video YouTube)
-- Jalankan SEKALI di SQL Editor project "nawa". Aman bila terjalan dua kali.
-- =====================================================================

alter table public.posts
  add column if not exists youtube_id text
  check (youtube_id is null or youtube_id ~ '^[A-Za-z0-9_-]{11}$');

-- Postingan boleh berisi tulisan, gambar, ATAU video
alter table public.posts drop constraint if exists posts_isi_atau_gambar;
alter table public.posts add constraint posts_isi_atau_gambar
  check (coalesce(trim(isi), '') <> '' or gambar_url is not null or youtube_id is not null);

notify pgrst, 'reload schema';
