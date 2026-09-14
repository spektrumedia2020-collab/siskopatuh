import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `  const handleAddJemaahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJemaah.nik || !newJemaah.nama) return;
    
    // Sistem Mencegah Duplikasi Berdasarkan NIK
    // Kita cek apakah NIK sudah pernah didaftarkan (simulasi)
    const isDuplicate = jemaahs.some((j) => j.nik === newJemaah.nik || newJemaah.nik === "3201234567890001");
    
    if (isDuplicate) {
      setToastMessage({
        title: "Pendaftaran Ditolak: Data Dobel", 
        desc: \`NIK \${newJemaah.nik} sudah terdaftar di sistem pusat Kemenag. Data tidak boleh diduplikasi.\`, 
        type: "error"
      });
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }`;

const insert = `  const handleAddJemaahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJemaah.nik || !newJemaah.nama) return;
    
    const isAlreadyInManifest = jemaahs.some((j) => j.nik === newJemaah.nik);
    const isCentralRegistered = newJemaah.nik === "3201234567890001";
    
    if (isAlreadyInManifest) {
      // Skenario 1: Konfirmasi Jemaah yang sudah ada di tabel
      setToastMessage({
        title: "Data Terkonfirmasi", 
        desc: \`Jemaah atas nama \${newJemaah.nama} (NIK: \${newJemaah.nik}) sudah berada di dalam manifes Anda. Tidak perlu didaftarkan ulang.\`, 
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
      setShowAddJemaahModal(false);
      setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });
      return;
    }

    if (isCentralRegistered) {
      // Skenario 2: Jemaah mendaftar via aplikasi B2C pusat, ditarik ke Travel
      const paketDipilih = newJemaah.paket || (packages.length > 0 ? packages[0].name : "Umroh Reguler 9 Hari");
      const jemaahBaru = {
        id: Date.now().toString(),
        name: newJemaah.nama + " (Tersinkronisasi dari Pusat)",
        nik: newJemaah.nik,
        porsi: "327000001234",
        packageName: paketDipilih,
        penyelenggara: pihkName || "Travel Anda",
        bayar: "PROSES",
        visa: "PROSES"
      };
      setJemaahs([jemaahBaru, ...jemaahs]);
      
      setToastMessage({
        title: "Sinkronisasi Berhasil", 
        desc: \`Data NIK \${newJemaah.nik} ditemukan di Pusat dan berhasil ditarik ke Manifes Travel Anda.\`, 
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
      setShowAddJemaahModal(false);
      setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });
      return;
    }`;

if (content.includes(search)) {
    content = content.replace(search, insert);
    writeFileSync(file, content);
    console.log("Updated duplication logic successfully!");
} else {
    console.log("Could not find the target search string.");
}
