// =====================================================================
// INFO VERSI — file ini yang tampil di popup tanda seru (!) di aplikasi.
// Setiap revisi: tambahkan entri BARU di paling atas (jangan hapus yang lama).
// Popup (!) hanya menampilkan entri paling atas.
// Lalu naikkan VERSION di config.js dan nama CACHE di sw.js.
// =====================================================================
window.NAWA_CHANGELOG = [
  {
    v: '1.9', t: '28 November 2026',
    add: [
      'Aplikasi bisa dibuka gratis tanpa akun: Beranda dan Jadwal terbuka untuk umum',
      'Pustaka, Komunitas, dan Support khusus yang punya akun; login atau registrasi muncul sebagai popup saat membukanya',
      'Nama di semua halaman diganti menjadi Nawa'
    ],
    fix: [
      'Nama menu dipersingkat: Pustaka dan Support'
    ]
  },
  {
    v: '1.8', t: '28 November 2026',
    add: [
      'Menu Kelompok diganti User: admin melihat semua user terdaftar, user melihat siapa yang sedang aktif (hanya bisa dilihat)',
      'Admin bisa memposting video YouTube lewat tautan di + Postingan, user tinggal menonton'
    ],
    fix: []
  },
  {
    v: '1.7', t: '27 November 2026',
    add: [],
    fix: [
      'Tulisan di halaman login dan pendaftaran dibuat lebih singkat dan mudah dipahami'
    ]
  },
  {
    v: '1.6', t: '27 November 2026',
    add: [
      'Popup Instal otomatis saat aplikasi dibuka lewat link di browser, dan hilang setelah terpasang',
      'Petunjuk cara install menyesuaikan perangkat (Android atau iPhone)'
    ],
    fix: []
  },
  {
    v: '1.5', t: '27 November 2026',
    add: [],
    fix: [
      'Info versi kini hanya menampilkan pembaruan terbaru, tanpa riwayat lama dan tanpa tanggal'
    ]
  },
  {
    v: '1.4', t: '27 November 2026',
    add: [
      'Header hijau sage dengan sudut bawah membulat (posisi ikon tidak berubah)',
      'Tab berbentuk pil segmented di Pustaka, Komunitas, dan Dukung',
      'Banner agenda dengan ilustrasi matahari dan perbukitan',
      'Kartu profil dengan sampul gradasi dan ikon menu berlatar bulat',
      'Ikon aplikasi dan layar pembuka baru bernuansa pastel'
    ],
    fix: [
      'Foto postingan kini membulat dengan jarak tepi yang rapi',
      'Warna header mode gelap disetel ulang agar tidak menyilaukan'
    ]
  },
  {
    v: '1.3', t: '27 November 2026',
    add: [
      'Tampilan baru bernuansa pastel (sage, ivory, sand) di mode terang dan gelap',
      'Menu bawah bergaya dock melayang dengan penanda geser yang halus',
      'Kabar berjalan kini berbentuk kapsul membulat',
      'Banner agenda terdekat lebih mewah, dengan tombol Lihat Jadwal',
      'Kartu "Sholawat Hari Ini" di Beranda'
    ],
    fix: [
      'Seluruh sudut kartu, tombol, dan popup kini membulat'
    ]
  },
  {
    v: '1.2', t: '27 November 2026',
    add: [
      'Tombol "Periksa Pembaruan" di Profil'
    ],
    fix: [
      'Aplikasi yang sudah terpasang kini memperbarui diri otomatis, tanpa perlu hapus dan install ulang',
      'Pembaruan dicek setiap aplikasi dibuka kembali'
    ]
  },
  {
    v: '1.1', t: '27 November 2026',
    add: [
      'Postingan di Beranda: admin bisa memposting teks dan gambar (maks. 1 MB)',
      'Anggota bisa menyukai dan mengomentari postingan',
      'Kelola Kabar Berjalan dipindah ke Profil (khusus admin)'
    ],
    fix: [
      'Tombol Install otomatis tersembunyi saat aplikasi sudah terpasang',
      'Tombol kembali Android/iOS kini kembali ke halaman sebelumnya, bukan keluar aplikasi'
    ]
  },
  {
    v: '1.0', t: '27 November 2026',
    add: [
      'Registrasi & login dengan No. WhatsApp + PIN', 'Lupa PIN', 'Keanggotaan (foto, nama, alamat)',
      'Beranda: agenda terdekat, Kabar berjalan, Akses Cepat', 'Jadwal & Lokasi majelis', 'Pustaka sholawat, ebook, audio, arsip',
      'Komunitas: kelompok, usulan, galeri', 'Dukungan: program sosial, donasi, laporan', 'Mode terang / gelap', 'Cara install aplikasi', 'Sesi admin'
    ],
    fix: ['Layar login tidak lagi muncul sekilas saat membuka aplikasi yang sudah masuk', 'Teks tidak bisa terblok tanpa sengaja']
  }
];
