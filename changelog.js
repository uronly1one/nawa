// =====================================================================
// INFO VERSI — file ini yang tampil di popup tanda seru (!) di aplikasi.
// Setiap revisi: tambahkan entri BARU di paling atas (jangan hapus yang lama).
// Lalu naikkan VERSION di config.js dan nama CACHE di sw.js.
// =====================================================================
window.NAWA_CHANGELOG = [
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
