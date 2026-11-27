# Nawa · Tambak Bersholawat

PWA nirlaba untuk jama'ah sholawat. Fondasi: **Supabase** + **GitHub Pages**.

## Isi paket
| File | Fungsi |
|---|---|
| `index.html`, `style.css`, `app.js` | Aplikasi |
| `config.js` | URL & kunci Supabase, serta nomor `VERSION` |
| `changelog.js` | **Isi popup Info Versi (!)**. Ini yang diganti setiap revisi |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Agar bisa di-install |
| `supabase.sql` | Database awal v1.0 (cukup dijalankan sekali, sudah dilakukan) |
| `update-v1.1.sql` | Tambahan database v1.1 (postingan, like, komentar) |

## Memasang revisi v1.1
1. Di Supabase → SQL Editor, hapus isi lama, tempel isi `update-v1.1.sql`, Run **sekali**.
2. Di GitHub repo, unggah/timpa semua file dari zip (Add file → Upload files → Commit).
3. Buka aplikasi dua kali agar versi baru termuat. Cek lewat ikon (!) harus tertulis Ver. 1.1.

## Setiap revisi berikutnya (update info versi)
1. Buka `changelog.js`, tambahkan entri baru di **paling atas** (`v`, `t`, `add`, `fix`).
2. Naikkan `VERSION` di `config.js` dan nama `CACHE` di `sw.js` (mis. `nawa-v1.2`).
3. Unggah file yang berubah ke GitHub.

## Catatan
- Lupa PIN menampilkan PIN lama (sesuai permintaan). PIN disimpan di schema `private`, dibatasi 5 percobaan / 15 menit per nomor WA.
- Gambar postingan dikecilkan otomatis di HP admin hingga maks. 1 MB, dan database juga menolak file di atas 1 MB.
