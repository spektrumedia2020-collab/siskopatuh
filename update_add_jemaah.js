import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const oldFunc = `  const handleAddJemaahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJemaah.nik || !newJemaah.nama) return;
    
    const nomorPorsiGenerate = "327" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
    alert(\`Registrasi Terpusat Berhasil!\\n\\nJemaah: \${newJemaah.nama}\\nNIK: \${newJemaah.nik}\\nNomor Porsi Kemenhaj: \${nomorPorsiGenerate}\\n\\nData identitas telah terekam di sistem pusat secara terintegrasi.\`);

    setShowAddJemaahModal(false);
    setNewJemaah({ nik: '', nama: '', porsi: '' });
  };`;

const newFunc = `  const handleAddJemaahSubmit = (e: React.FormEvent) => {
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
    }
    
    const nomorPorsiGenerate = "327" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
    
    setToastMessage({
      title: "Registrasi Terpusat Berhasil",
      desc: \`Jemaah: \${newJemaah.nama} (NIK: \${newJemaah.nik}) berhasil didaftarkan dengan Porsi: \${nomorPorsiGenerate}.\`,
      type: "success"
    });
    setTimeout(() => setToastMessage(null), 5000);

    setShowAddJemaahModal(false);
    setNewJemaah({ nik: '', nama: '', porsi: '' });
  };`;

if (content.includes(oldFunc)) {
    content = content.replace(oldFunc, newFunc);
    writeFileSync(file, content);
    console.log("Add Jemaah updated with Duplicate NIK check");
} else {
    console.log("Could not find the function");
}
