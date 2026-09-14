const fs = require('fs');
const path = require('path');
const p = path.resolve('src/lib/defaultPanduanData.ts');

const newContent = `export const defaultSections = [
  {
    title: "BAB 1: PORTAL PUBLIK & DASHBOARD JEMAAH",
    iconName: "Users",
    description: "Bagian ini menjelaskan cara pendaftaran, pengecekan nomor porsi, dan pemantauan progress keberangkatan (dana, dokumen, SLA) secara transparan oleh calon jemaah.",
    pages: [
      {
        name: "Halaman Beranda (Public Landing)",
        fungsi: "Menampilkan informasi publik SISKOPATUH, regulasi pendaftaran (Escrow BPKH), serta akses ke berbagai portal (Cek Porsi, Panduan, Login).",
        akses: "Buka URL utama aplikasi (Route: / ).",
        langkah: [
          "Gulir ke bawah untuk melihat fitur-fitur SISKOPATUH V.2.",
          "Gunakan menu navigasi di atas untuk berpindah halaman."
        ]
      },
      {
        name: "Halaman Cek Porsi",
        fungsi: "Memungkinkan calon jemaah untuk memeriksa status pendaftaran dan estimasi keberangkatan mereka secara mandiri untuk menghindari penipuan.",
        akses: "Klik tombol 'CEK PORSI' pada navigasi atas di halaman Beranda (Route: /cek-porsi).",
        langkah: [
          "Masukkan Nomor Porsi atau NIK pada kolom pencarian.",
          "Klik tombol 'Cari Data'.",
          "Sistem akan menampilkan rincian nama, travel, dan status dokumen keberangkatan."
        ]
      },
      {
        name: "Halaman Direktori Penyelenggara",
        fungsi: "Menampilkan daftar seluruh penyelenggara travel (PPIU/PIHK) yang berizin resmi (Whitelist) dan yang bermasalah (Blacklist).",
        akses: "Klik tombol 'DIREKTORI PENYELENGGARA' pada navigasi atas di halaman Beranda (Route: /direktori).",
        langkah: [
          "Gunakan kolom pencarian untuk mencari nama travel spesifik.",
          "Lihat status travel (Hijau = Aman, Merah = Bermasalah, Hitam = Dicabut)."
        ]
      },
      {
        name: "Dasbor Jemaah (Keuangan, Dokumen, Timeline)",
        fungsi: "Menampilkan ringkasan status pendaftaran Jemaah. Pada Tab Keuangan, jemaah dapat melihat Kalkulasi Saldo Dinamis (Running Balance) Virtual Account beserta Visualisasi Progress Pelunasan sesuai jenis layanan (Haji/Umrah).",
        akses: "Login dengan akun Jemaah (Route: /jemaah).",
        langkah: [
          "Gunakan menu tab di sidebar (Keuangan, Dokumen, Timeline) untuk menavigasi detail.",
          "Cek Tab Keuangan untuk memantau akumulasi setoran (Virtual Account H2H) dan progress pelunasan (LUNAS hijau).",
          "Cek Tab Dokumen untuk memastikan status kelengkapan Paspor/Vaksin.",
          "Cek Tab Timeline untuk melacak posisi pemrosesan visa, tiket, jadwal keberangkatan dan kepulangan (terintegrasi otomatis dengan manifes travel)."
        ]
      }
    ]
  },
  {
    title: "BAB 2: DASHBOARD PENYELENGGARA (TRAVEL)",
    iconName: "Building",
    description: "Area kerja bagi Biro Perjalanan (PPIU/PIHK) untuk mengelola data jemaah, operasional paket, pencairan dana (Escrow), serta melaporkan jadwal penerbangan.",
    pages: [
      {
        name: "Pantauan Dana & Jemaah (Dasbor Utama)",
        fungsi: "Menampilkan total kuota, total dana di rekening escrow BPKH, dan rincian kalkulasi dana tertahan (Lock) maupun cair (Unlock).",
        akses: "Login sebagai Penyelenggara. Halaman utama (Route: /penyelenggara).",
        langkah: [
          "Lihat metrik pendanaan utama di bagian atas Dasbor.",
          "Klik ikon info (i) di sebelah Dana Tercairkan untuk melihat Rincian Kalkulasi Dana Escrow.",
          "Kelola data pendaftaran Jemaah Baru dan mutasikan jemaah ke dalam paket keberangkatan."
        ]
      },
      {
        name: "Halaman Pencairan Termin Escrow",
        fungsi: "Mengajukan permohonan pencairan dana secara bertahap (Milestone-based) kepada Pemerintah/BPKH dengan mengunggah bukti kerja aktual (PNR Tiket, E-Visa, Kontrak Hotel).",
        akses: "Menu di Dasbor Penyelenggara.",
        langkah: [
          "Pilih termin yang ingin dicairkan (misal: Termin 2 - Tiket/Visa 30%).",
          "Unggah dokumen bukti otentik.",
          "Klik 'Ajukan Pencairan' untuk diverifikasi oleh Admin Kemenag."
        ]
      },
      {
        name: "Manajemen Paket & Jadwal",
        fungsi: "Mengelola spesifikasi paket, menginput PNR tiket, akomodasi hotel Makkah/Madinah, dan nomor polis asuransi.",
        akses: "Tab 'Paket & Jadwal' di Dasbor.",
        langkah: [
          "Klik 'Buat Paket Baru'.",
          "Isi rencana keberangkatan dan detail tiket.",
          "Laporkan pembaruan kesiapan Visa, Tiket, dan Hotel agar terpantau di sisi Jemaah dan Admin."
        ]
      },
      {
        name: "Data Manifes Jemaah (Keberangkatan & Kepulangan)",
        fungsi: "Fitur pendaftaran manifes akhir (E-Manifest), pelaporan keberangkatan/kepulangan untuk menghindari sanksi SLA, dan penerbitan ID Card RFID Jemaah.",
        akses: "Tab 'Data Manifes Jemaah'.",
        langkah: [
          "Masukkan jemaah ke dalam paket (Plotting).",
          "Sinkronisasi E-Manifest & QR Boarding (Manifes akan Terkunci).",
          "Lapor Keberangkatan (1x24 jam sebelum terbang).",
          "Lapor Kepulangan. Keterlambatan lapor akan mengaktifkan Early Warning System (Tunda Kepulangan) otomatis."
        ]
      }
    ]
  },
  {
    title: "BAB 3: ADMIN COMMAND CENTER (KEMENAG / BPKH)",
    iconName: "ShieldCheck",
    description: "Ruang kendali Pusat bagi Pemerintah untuk memantau aktivitas travel nasional, menegakkan aturan SLA/Kepatuhan secara sekuensial, dan memverifikasi pencairan Escrow.",
    pages: [
      {
        name: "Pantauan Kuota & Antrean",
        fungsi: "Memantau sisa kuota Haji Nasional (Reguler & Khusus) serta volume Umrah secara real-time.",
        akses: "Login sebagai Admin. Halaman Tab Dasbor (Route: /admin).",
        langkah: [
          "Lihat grafik kapasitas dan serapan kuota nasional.",
          "Kelola pengaturan batas kuota jika ada perubahan kebijakan diplomasi."
        ]
      },
      {
        name: "Verifikasi Penyelenggara (Approval Escrow)",
        fungsi: "Memverifikasi dokumen pengajuan pencairan dana Escrow yang diajukan oleh travel aktif (Validasi PNR, Visa, Hotel).",
        akses: "Tab Dasbor Verifikasi.",
        langkah: [
          "Buka daftar pengajuan Escrow Termin.",
          "Validasi dokumen otentik yang dilampirkan Travel.",
          "Jika valid, setujui (Approve) untuk membuka blokir rekening (Unlock Dana BPKH)."
        ]
      },
      {
        name: "Early Warning System (EWS) & Deteksi Tunda Kepulangan",
        fungsi: "Sistem pendeteksi otomatis indikasi pelanggaran Service Level Agreement (SLA). Fitur ini membaca manifes dan menampilkan daftar jemaah secara real-time yang tertunda kepulangannya dari Arab Saudi.",
        akses: "Tab 'EWS / Kepatuhan' di Dasbor Admin.",
        langkah: [
          "Cek tabel 'SOS Jemaah Aktif' untuk laporan darurat di lapangan.",
          "Cek 'SLA Warning' untuk travel yang terlambat melapor keberangkatan/kepulangan > 24 Jam.",
          "Pantau tabel 'Daftar Jemaah Tunda Kepulangan (EWS)' untuk melihat identitas dan travel spesifik yang terdampak."
        ]
      },
      {
        name: "Penindakan Sanksi Administratif (4 Alur Sekuensial)",
        fungsi: "Fitur pemberian sanksi kepada PPIU/PIHK secara bertahap mulai dari Teguran Tertulis, Denda Administratif, Pembekuan, hingga Pencabutan Izin Usaha.",
        akses: "Tab 'Kepatuhan & Penindakan' di Dasbor Admin.",
        langkah: [
          "Cari travel di tabel Indeks Kepatuhan.",
          "Klik tombol 'Beri Sanksi'.",
          "Pilih level sanksi. Sistem otomatis MENGUNCI (Lock) level sanksi yang lebih berat jika travel tersebut belum melewati tahapan sanksi sebelumnya (Alur Sekuensial Terstruktur).",
          "Klik 'Terapkan Sanksi'. Status travel akan ter-update dan sanksi tercatat di History."
        ]
      },
      {
        name: "Rekap Aduan Jemaah",
        fungsi: "Mengelola laporan, keluhan, dan komplain langsung dari Jemaah.",
        akses: "Tab 'Rekap Aduan Jemaah'.",
        langkah: [
          "Baca laporan masuk (Kategori Fasilitas, Keterlambatan, Penipuan).",
          "Teruskan laporan ke PPIU terkait atau berikan sanksi teguran."
        ]
      },
      {
        name: "Manajemen Konten (Buku Panduan)",
        fungsi: "Mengelola isi dan susunan konten Buku Panduan yang tampil di halaman Publik secara dinamis melalui Database (CMS), tanpa hardcode.",
        akses: "Tab 'Kelola Buku Panduan' (Manajemen Panduan).",
        langkah: [
          "Klik edit pada Bab atau Halaman tertentu.",
          "Tambah halaman baru, ubah deskripsi dan langkah-langkah.",
          "Klik Simpan untuk menerbitkan langsung ke halaman 'Baca Panduan' publik."
        ]
      }
    ]
  }
];`;

fs.writeFileSync(p, newContent, 'utf8');
console.log('Patched defaultPanduanData');
