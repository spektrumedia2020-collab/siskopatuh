import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";

const defaultSections = [
  {
    title: "BAB 1: PORTAL PUBLIK & CALON JEMAAH",
    iconName: "Users",
    description: "Halaman yang dapat diakses oleh masyarakat umum dan dasbor privat untuk jemaah terdaftar.",
    pages: [
      {
        name: "Halaman Beranda (Public Landing Page)",
        fungsi: "Menampilkan informasi utama, statistik nasional, serta akses ke portal-portal lain.",
        akses: "Buka URL utama aplikasi (Route: / ).",
        langkah: ["Gulir ke bawah untuk melihat fitur-fitur SISKOPATUH V.2.", "Gunakan menu navigasi di atas untuk berpindah halaman."]
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
        name: "Halaman Direktori PIHK",
        fungsi: "Menampilkan daftar seluruh penyelenggara travel (PPIU/PIHK) yang berizin resmi (Whitelist) dan yang bermasalah (Blacklist).",
        akses: "Klik tombol 'DIREKTORI PIHK' pada navigasi atas di halaman Beranda (Route: /direktori).",
        langkah: [
          "Gunakan kolom pencarian untuk mencari nama travel spesifik.",
          "Lihat status travel (Hijau = Aman, Merah = Bermasalah)."
        ]
      },
      {
        name: "Dasbor Jemaah & Ceklis Dokumen",
        fungsi: "Menampilkan ringkasan status pendaftaran, progress bar keberangkatan, ceklis kelengkapan dokumen persyaratan (Paspor, Vaksin), dan transparansi pengelolaan dana oleh BPKH.",
        akses: "Login dengan akun Jemaah (Route: /jemaah).",
        langkah: [
          "Lihat grafik saldo pada halaman utama dasbor.",
          "Gunakan menu di sidebar (Keuangan, Dokumen, Timeline) untuk menavigasi detail.",
          "Status 'Centang Hijau' berarti dokumen sudah divalidasi oleh pihak travel."
        ]
      }
    ]
  },
  {
    title: "BAB 2: DASHBOARD PENYELENGGARA (TRAVEL)",
    iconName: "Building",
    description: "Area kerja bagi Biro Perjalanan (PPIU/PIHK) untuk mengelola data jemaah, operasional paket, dan pencairan dana (Escrow).",
    pages: [
      {
        name: "Pantauan Dana & Jemaah (Dasbor Utama)",
        fungsi: "Menampilkan total kuota yang dimiliki, total dana yang terkumpul di rekening escrow BPKH, dan rincian kalkulasi dana yang tertahan maupun yang sudah dicairkan.",
        akses: "Login sebagai Penyelenggara. Halaman utama (Route: /penyelenggara).",
        langkah: [
          "Lihat metrik utama di bagian atas Dasbor.",
          "Klik ikon info (i) di sebelah Dana Tercairkan untuk melihat Rincian Kalkulasi Dana Escrow.",
          "Kelola data jemaah pada tabel 'Pendaftaran Jemaah Baru' (bisa Import Excel)."
        ]
      },
      {
        name: "Halaman Pencairan Termin Escrow",
        fungsi: "Tempat Travel mengajukan permohonan pencairan dana secara bertahap (Milestone) kepada Kemenag/BPKH dengan mengunggah bukti kerja aktual (contoh: PNR Tiket, E-Visa, Booking Hotel).",
        akses: "Akses melalui Dasbor utama (Route: /penyelenggara/escrow atau terintegrasi di Dasbor).",
        langkah: [
          "Temukan termin yang ingin dicairkan pada daftar Milestone (misal: Termin 2 - Visa 20%).",
          "Klik tombol 'Klaim Pencairan'.",
          "Unggah file bukti PDF (seperti E-Visa atau Manifes).",
          "Klik 'Kirim ke Kemenhaj' dan tunggu proses verifikasi."
        ]
      },
      {
        name: "Halaman Manajemen Paket & Harga",
        fungsi: "Mengelola paket-paket perjalanan yang ditawarkan travel beserta harga, fasilitas, dan rute penerbangannya.",
        akses: "Menu 'Manajemen Paket' di sidebar penyelenggara (Route: /penyelenggara/paket).",
        langkah: [
          "Klik 'Add New' untuk membuat paket baru.",
          "Isi detail harga dan fasilitas.",
          "Simpan untuk menampilkan paket ke sistem."
        ]
      }
    ]
  },
  {
    title: "BAB 3: ADMIN COMMAND CENTER (KEMENAG / BPKH)",
    iconName: "ShieldCheck",
    description: "Ruang kendali utama (Pusat) bagi Pemerintah untuk memantau aktivitas travel nasional, memverifikasi escrow, dan mengelola pengguna.",
    pages: [
      {
        name: "Pantauan Kuota & Antrean",
        fungsi: "Memantau sisa kuota Haji Nasional (Reguler) dan Haji Khusus secara real-time.",
        akses: "Login sebagai Admin. Halaman default (Route: /admin atau /admin/kuota).",
        langkah: [
          "Lihat grafik kapasitas dan kuota nasional.",
          "Sesuaikan angka kuota jika ada perubahan kebijakan (penambahan dari Arab Saudi)."
        ]
      },
      {
        name: "Verifikasi Penyelenggara (Approval Escrow)",
        fungsi: "Memverifikasi dokumen pengajuan izin travel baru, serta mengecek bukti dokumen (tiket/visa) untuk menyetujui pencairan dana Escrow yang diajukan oleh travel aktif.",
        akses: "Menu 'Verifikasi Penyelenggara' di sidebar Admin (Route: /admin/registrasi).",
        langkah: [
          "Cari pengajuan pencairan escrow yang berstatus 'Menunggu'.",
          "Klik 'Verifikasi' untuk melihat detail dokumen bukti yang diunggah travel.",
          "Klik 'Setujui (Tandai Lunas)' jika bukti valid, uang akan otomatis cair ke travel."
        ]
      },
      {
        name: "Kepatuhan Penyelenggara & Early Warning System",
        fungsi: "Memantau indeks kepatuhan travel (SLA) dan memberikan peringatan dini (zona merah) jika travel terancam gagal berangkat.",
        akses: "Menu 'Kepatuhan Penyelenggara' atau 'Early Warning System' (Route: /admin/kepatuhan, /admin/ews).",
        langkah: [
          "Lihat status akreditasi (A sampai E) masing-masing travel.",
          "Cek notifikasi SOS atau peringatan batas waktu pengurusan dokumen."
        ]
      },
      {
        name: "Radar Kesiapan Operasional",
        fungsi: "Memantau progres persiapan dokumen dan fasilitas per maskapai dan kloter secara mendetail via grafik Radar.",
        akses: "Menu 'Radar Kesiapan Operasional' (Route: /admin/operasional).",
        langkah: [
          "Lihat visualisasi kesiapan maskapai.",
          "Pantau persentase penyelesaian tiket, visa, dan hotel kloter."
        ]
      },
      {
        name: "Rekap Aduan Jemaah",
        fungsi: "Mengelola laporan, keluhan, dan komplain langsung dari Jemaah (SOS di lapangan atau kendala layanan).",
        akses: "Menu 'Rekap Aduan Jemaah' (Route: /admin/aduan).",
        langkah: [
          "Baca laporan masuk dari Jemaah.",
          "Tanggapi dan ambil tindakan tegas (Blacklist) jika travel terbukti melakukan pelanggaran berat."
        ]
      },
      {
        name: "Pindai Operator Lapangan",
        fungsi: "Fitur pemindai kode (Barcode/QR) petugas lapangan/Satgas untuk absensi validasi lokasi.",
        akses: "Menu 'Pindai Operator Lapangan' (Route: /admin/scanner).",
        langkah: [
          "Aktifkan kamera perangkat dan arahkan ke QR Code ID Card petugas."
        ]
      },
      {
        name: "Ledger Mutasi Jemaah",
        fungsi: "Mencatat perpindahan historis (mutasi) porsi Jemaah antar travel menggunakan prinsip rekam jejak digital.",
        akses: "Menu 'Ledger Mutasi Jemaah' (Route: /admin/ledger).",
        langkah: [
          "Cari data jemaah untuk melihat riwayat mutasinya secara lengkap dan tak dapat diubah."
        ]
      },
      {
        name: "Pengaturan Desain Portal",
        fungsi: "Mengubah tema warna aplikasi (Primary Color), logo institusi, dan mengunggah (update) file Buku Panduan PDF.",
        akses: "Menu 'Pengaturan Desain Portal' (Route: /admin/desain).",
        langkah: [
          "Untuk ubah warna, gunakan fitur Color Picker lalu simpan.",
          "Untuk update Panduan PDF: Masukkan file pada kotak 'Update Panduan PDF' dan klik 'Simpan'."
        ]
      },
      {
        name: "Manajemen Admin",
        fungsi: "Mengelola (Menambah, Mengedit, Menghapus) hak akses akun-akun staf Kemenag/Pusat.",
        akses: "Menu 'Manajemen Admin' (Route: /admin/manajemen-admin).",
        langkah: [
          "Klik 'Tambah Admin Baru', isi email dan tetapkan Role spesifiknya."
        ]
      },
      {
        name: "Manajemen Panduan (CMS)",
        fungsi: "Sistem Manajemen Konten (CMS) interaktif untuk mengelola dan menambah fitur pada halaman 'Baca Panduan' secara langsung.",
        akses: "Menu 'Manajemen Panduan' (Route: /admin/panduan).",
        langkah: [
          "Buka halaman Manajemen Panduan.",
          "Klik tombol 'Tambah Bab Baru' atau 'Tambah Fitur' pada bab yang ada.",
          "Isi detailnya, lalu klik tombol hijau 'Update Halaman Panduan' di pojok kanan atas."
        ]
      }
    ]
  }
];

const configPath = process.cwd() + "/firebase-applet-config.json";
let config;
try {
  config = JSON.parse(readFileSync(configPath, "utf-8"));
} catch (e) {
  console.error("Config not found");
  process.exit(1);
}

const app = initializeApp(config);
// IMPORTANT: Use the correct database ID!
const db = initializeFirestore(app, {}, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");

async function run() {
  try {
    await setDoc(doc(db, "app_settings", "panduan_content"), {
      sections: defaultSections,
      updatedAt: new Date().toISOString()
    }, { merge: false });
    console.log("Successfully overwrote panduan_content with fresh data to the correct DB");
  } catch(e) {
    console.error("Error", e);
  }
  process.exit(0);
}
run();
