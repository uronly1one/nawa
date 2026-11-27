# Nawa · Tambak Bersholawat (v1.0)

Aplikasi PWA nirlaba untuk jama'ah sholawat. Fondasi: **Supabase** (database, login, file) + **GitHub Pages** (hosting gratis).

## Isi paket
| File | Fungsi |
|---|---|
| `index.html`, `style.css`, `app.js` | Aplikasi |
| `config.js` | **Isi URL & kunci Supabase di sini** |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Agar bisa di-install seperti aplikasi |
| `supabase.sql` | Seluruh tabel, keamanan (RLS), storage, akun admin |

## Langkah pemasangan (±15 menit)

### 1. Supabase
1. Buat project baru di supabase.com.
2. **SQL Editor → New query**, tempel isi `supabase.sql`, klik **Run** (cukup sekali).
3. **Authentication → Providers → Email**: matikan **"Confirm email"** (wajib, karena login memakai No. WA + PIN, bukan email sungguhan).
4. **Authentication → Users → Add user**: buat akun admin (email + password, centang *Auto Confirm User*).
5. Di SQL Editor jalankan (ganti emailnya):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@emailkamu.com';
   ```
6. **Project Settings → API**: salin *Project URL* dan *anon public key* ke `config.js`.

### 2. GitHub Pages
1. Buat repository baru, unggah semua file di folder ini (di root).
2. **Settings → Pages → Branch: main / root → Save**.
3. Buka alamat `https://USERNAME.github.io/NAMA-REPO/` di HP, lalu install lewat tombol ⬇ di pojok kiri bawah halaman login.

## Cara kerja singkat
- Anggota: daftar → login No. WA + PIN → wajib unggah foto profil.
- Admin: tombol perisai (pojok kanan bawah halaman login) → login email + password.
- Admin melihat tombol **+**, ubah, dan hapus di setiap halaman, serta **Kelola Kabar Berjalan** di Beranda.
- Untuk rilis berikutnya: tambah entri di `CHANGELOG` (`app.js`), naikkan `VERSION` (`config.js`) dan `CACHE` (`sw.js`).

## Catatan keamanan: fitur Lupa PIN
Sesuai permintaan, Lupa PIN menampilkan PIN lama. Artinya PIN disimpan agar bisa dibaca ulang (di schema `private`, tidak terbuka lewat API), dan siapa pun yang tahu nama + No. WA seseorang bisa melihat PIN-nya (dibatasi 5 percobaan / 15 menit per nomor). Untuk aplikasi nirlaba berisi konten jama'ah ini wajar, tetapi jangan simpan data sensitif di dalamnya. Opsi lebih aman di versi berikutnya: admin mereset PIN lewat WhatsApp.
