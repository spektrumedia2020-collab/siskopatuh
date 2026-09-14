import fs from 'fs';
import { jsPDF } from "jspdf";

const doc = new jsPDF();

// Add title
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("BUKU PANDUAN PENGGUNA SISKOPATUH V.2", 105, 20, { align: "center" });

let yPos = 40;
const margin = 20;
const pageHeight = doc.internal.pageSize.height;

function addText(text, fontSize, style = "normal") {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", style);
    const splitText = doc.splitTextToSize(text, 170);
    
    for (let i = 0; i < splitText.length; i++) {
        if (yPos > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
        }
        doc.text(splitText[i], margin, yPos);
        yPos += fontSize * 0.4;
    }
    yPos += 5; // Add some spacing after block
}

// ==========================================
// BAB 1: PORTAL PUBLIK
// ==========================================
addText("BAB 1: HALAMAN PORTAL PUBLIK (LANDING PAGE)", 14, "bold");
addText("Bagian ini dapat diakses oleh masyarakat umum (calon jemaah) tanpa perlu login di halaman utama web.", 11);

yPos += 2;
addText("1. Halaman Beranda (Public Landing Page)", 12, "bold");
addText("Fungsi: Menampilkan informasi utama, statistik nasional, serta akses ke portal-portal lain.", 11);
addText("Cara Akses: Buka URL utama aplikasi (contoh: https://siskopatuh.kemenag.go.id).", 11, "bold");

yPos += 2;
addText("2. Halaman Cek Porsi", 12, "bold");
addText("Fungsi: Memungkinkan calon jemaah untuk memeriksa status pendaftaran dan estimasi keberangkatan mereka secara mandiri untuk menghindari penipuan.", 11);
addText("Cara Akses: Klik tombol 'CEK PORSI' pada navigasi atas di halaman Beranda.", 11, "bold");
addText("Cara Penggunaan:\n  1. Masukkan Nomor Porsi atau NIK pada kolom yang disediakan.\n  2. Klik tombol 'Cari Data'.\n  3. Sistem akan menampilkan rincian nama, travel, dan status dokumen.", 11);

yPos += 2;
addText("3. Halaman Direktori PIHK", 12, "bold");
addText("Fungsi: Menampilkan daftar seluruh penyelenggara travel (PPIU/PIHK) yang berizin resmi (Whitelist) dan yang bermasalah (Blacklist).", 11);
addText("Cara Akses: Klik tombol 'DIREKTORI PIHK' pada navigasi atas di halaman Beranda.", 11, "bold");
addText("Cara Penggunaan:\n  1. Gunakan kolom pencarian untuk mencari nama travel spesifik.\n  2. Lihat status travel (Hijau = Aman, Merah = Bermasalah).", 11);

// ==========================================
// BAB 2: FITUR JEMAAH
// ==========================================
doc.addPage();
yPos = margin;

addText("BAB 2: HALAMAN DASHBOARD JEMAAH", 14, "bold");
addText("Area privat khusus bagi Jemaah yang telah terdaftar untuk memantau langsung dana dan progres keberangkatan.", 11);

yPos += 2;
addText("1. Halaman Dasbor (Overview)", 12, "bold");
addText("Fungsi: Menampilkan ringkasan status pendaftaran, nama travel yang menaungi, dan progress bar keberangkatan.", 11);
addText("Cara Akses: Login dengan NIK/Nomor Porsi Jemaah. (Atau klik Demo Login Jemaah).", 11, "bold");

yPos += 2;
addText("2. Halaman Ceklis Dokumen & Vaksin", 12, "bold");
addText("Fungsi: Memantau kelengkapan dokumen persyaratan (Paspor, Pas Foto, Bukti Vaksin Meningitis).", 11);
addText("Cara Akses: Klik menu 'Ceklis Dokumen & Vaksin' di sidebar (menu samping) Dasbor Jemaah.", 11, "bold");
addText("Cara Penggunaan:\n  1. Lihat daftar dokumen yang diminta.\n  2. Status 'Centang Hijau' berarti dokumen sudah divalidasi oleh pihak travel.\n  3. Jemaah juga dapat melaporkan kendala pengumpulan dokumen melalui tombol SOS/Aduan.", 11);

yPos += 2;
addText("3. Halaman Transparansi Dana", 12, "bold");
addText("Fungsi: Menampilkan total dana setoran yang dipegang oleh BPKH dan belum dicairkan ke travel.", 11);
addText("Cara Akses: Klik menu 'Transparansi Dana' di sidebar Dasbor Jemaah.", 11, "bold");
addText("Cara Penggunaan:\n  1. Jemaah dapat melihat grafik saldo.\n  2. Melihat riwayat pencairan (kapan uang digunakan untuk tiket, dll).", 11);

// ==========================================
// BAB 3: FITUR PENYELENGGARA (TRAVEL)
// ==========================================
doc.addPage();
yPos = margin;

addText("BAB 3: HALAMAN DASHBOARD PENYELENGGARA (TRAVEL)", 14, "bold");
addText("Area kerja bagi Biro Perjalanan (PPIU/PIHK) untuk mengelola data jemaah dan mencairkan dana (Escrow).", 11);

yPos += 2;
addText("1. Halaman Pantauan Dana & Jemaah", 12, "bold");
addText("Fungsi: Menampilkan total kuota, total dana yang terkumpul, dan melihat detail kalkulasi Escrow (Dana yang tertahan dan tercairkan).", 11);
addText("Cara Akses: Login sebagai Penyelenggara (Travel). Klik menu 'Pantauan Dana & Jemaah'.", 11, "bold");
addText("Cara Penggunaan:\n  1. Di bagian atas, klik ikon informasi (i) di sebelah Dana Tercairkan untuk melihat Rincian Kalkulasi (Detail Kalkulasi Dana Escrow).\n  2. Di bawah, Admin Travel dapat melihat daftar Jemaah yang terdaftar.", 11);

yPos += 2;
addText("2. Halaman Pencairan Termin Escrow", 12, "bold");
addText("Fungsi: Tempat Travel mengajukan pencairan dana secara bertahap kepada Kemenag/BPKH dengan mengunggah bukti kerja (tiket, visa, hotel).", 11);
addText("Cara Akses: Klik menu 'Pencairan Termin Escrow' di sidebar.", 11, "bold");
addText("Cara Penggunaan:\n  1. Temukan termin yang ingin dicairkan (misal: Termin Visa).\n  2. Klik tombol 'Klaim Pencairan'.\n  3. Unggah file bukti (PDF E-Visa).\n  4. Klik 'Kirim Pengajuan'.", 11);

yPos += 2;
addText("3. Halaman Manajemen Paket & Harga", 12, "bold");
addText("Fungsi: Mengelola paket-paket perjalanan yang ditawarkan travel beserta harga dan rute penerbangannya.", 11);
addText("Cara Akses: Klik menu 'Manajemen Paket & Harga' di sidebar.", 11, "bold");
addText("Cara Penggunaan: Admin travel dapat menambah (Add New), mengubah (Edit), atau menghapus (Delete) paket.", 11);


// ==========================================
// BAB 4: FITUR ADMIN COMMAND CENTER (KEMENAG)
// ==========================================
doc.addPage();
yPos = margin;

addText("BAB 4: HALAMAN ADMIN COMMAND CENTER (SUPER ADMIN)", 14, "bold");
addText("Ruang kendali utama (Pusat) bagi Pemerintah untuk mengawasi seluruh aktivitas travel dan aliran dana nasional.", 11);

yPos += 2;
addText("1. Halaman Pantauan Kuota & Antrean", 12, "bold");
addText("Fungsi: Memantau sisa kuota Haji Nasional dan Haji Khusus secara real-time.", 11);
addText("Cara Akses: Login sebagai Super Admin. Ini adalah halaman utama (default) saat pertama kali login.", 11, "bold");
addText("Cara Penggunaan: Admin dapat mengubah angka total kuota nasional jika ada penambahan dari Pemerintah Arab Saudi pada kolom yang disediakan.", 11);

yPos += 2;
addText("2. Halaman Verifikasi Penyelenggara", 12, "bold");
addText("Fungsi: Memverifikasi dokumen pengajuan izin baru dari calon travel, dan menyetujui pencairan dana Escrow yang diajukan oleh travel aktif.", 11);
addText("Cara Akses: Klik menu 'Verifikasi Penyelenggara' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan:\n  1. Cari pengajuan yang berstatus 'Menunggu'.\n  2. Klik 'Verifikasi'.\n  3. Periksa dokumen asli yang diunggah travel.\n  4. Klik 'Setujui' (uang otomatis cair) atau 'Tolak'.", 11);

yPos += 2;
addText("3. Halaman Kepatuhan Penyelenggara", 12, "bold");
addText("Fungsi: Memantau indeks kepatuhan travel berdasarkan data SLA (Service Level Agreement).", 11);
addText("Cara Akses: Klik menu 'Kepatuhan Penyelenggara' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Admin dapat melihat travel mana saja yang mendapat nilai A (Sangat Patuh) hingga E (Sangat Bermasalah).", 11);

yPos += 2;
addText("4. Halaman Radar Kesiapan Operasional", 12, "bold");
addText("Fungsi: Memantau progres persiapan dokumen dan fasilitas setiap maskapai/kloter secara mendetail.", 11);
addText("Cara Akses: Klik menu 'Radar Kesiapan Operasional' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Admin dapat melihat grafik Radar dan daftar persentase kesiapan tiket, hotel, dan visa per kloter.", 11);

yPos += 2;
addText("5. Halaman Early Warning System", 12, "bold");
addText("Fungsi: Memberikan peringatan dini otomatis (warna merah/kuning) jika ada travel yang terancam gagal berangkat karena dokumen belum lengkap mendekati hari H.", 11);
addText("Cara Akses: Klik menu 'Early Warning System' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Admin wajib memprioritaskan travel yang berada di zona merah untuk dipanggil atau diinvestigasi.", 11);

doc.addPage();
yPos = margin;

yPos += 2;
addText("6. Halaman Rekap Aduan Jemaah", 12, "bold");
addText("Fungsi: Mengelola laporan, keluhan, dan komplain langsung dari Jemaah di lapangan maupun di tanah air.", 11);
addText("Cara Akses: Klik menu 'Rekap Aduan Jemaah' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Admin dapat menanggapi aduan dan menindak tegas travel yang bersangkutan.", 11);

yPos += 2;
addText("7. Halaman Pindai Operator Lapangan", 12, "bold");
addText("Fungsi: Fitur untuk memindai kode (Barcode/QR) petugas lapangan (Satgas) di bandara atau di Arab Saudi untuk validasi absen.", 11);
addText("Cara Akses: Klik menu 'Pindai Operator Lapangan' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Aktifkan kamera perangkat, arahkan ke QR Code ID Card petugas lapangan.", 11);

yPos += 2;
addText("8. Halaman Ledger Mutasi Jemaah", 12, "bold");
addText("Fungsi: Mencatat seluruh perpindahan status Jemaah antar travel (misalnya Jemaah pindah dari Travel A ke Travel B) lengkap dengan bukti pembayarannya.", 11);
addText("Cara Akses: Klik menu 'Ledger Mutasi Jemaah' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Admin dapat melihat rekam jejak digital (ledger blockchain) dari setiap pergerakan porsi/jemaah.", 11);

yPos += 2;
addText("9. Halaman Pengaturan Desain Portal", 12, "bold");
addText("Fungsi: Mengubah tema warna (Primary Color), logo institusi, gambar sampul (Hero Image), dan mengupdate Buku Panduan (Upload PDF).", 11);
addText("Cara Akses: Klik menu 'Pengaturan Desain Portal' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan:\n  1. Untuk ubah warna, gunakan Color Picker.\n  2. Untuk ubah Panduan, pada kotak 'Update Panduan PDF', klik 'Choose File' pilih file PDF, dan klik 'Simpan'.", 11);

yPos += 2;
addText("10. Halaman Manajemen Admin", 12, "bold");
addText("Fungsi: Menambah, mengedit, atau menghapus hak akses staf/pegawai internal (Role-Based Access Control).", 11);
addText("Cara Akses: Klik menu 'Manajemen Admin' di sidebar Admin.", 11, "bold");
addText("Cara Penggunaan: Klik 'Tambah Admin Baru', isi email dan pilih peran jabatannya.", 11);

// Save document to buffer and base64
const pdfData = doc.output('arraybuffer');
const base64Data = Buffer.from(pdfData).toString('base64');
const dataUrl = `data:application/pdf;base64,${base64Data}`;

fs.writeFileSync('src/lib/defaultPdf.ts', `export const defaultPdfBase64 = "${dataUrl}";`);
console.log("PDF updated successfully");
