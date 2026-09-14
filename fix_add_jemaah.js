import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `    setToastMessage({
      title: "Registrasi Terpusat Berhasil",
      desc: \`Jemaah: \${newJemaah.nama} (NIK: \${newJemaah.nik}) berhasil didaftarkan dengan Porsi: \${nomorPorsiGenerate}.\`,
      type: "success"
    });
    setTimeout(() => setToastMessage(null), 5000);

    setShowAddJemaahModal(false);
    setNewJemaah({ nik: '', nama: '', porsi: '' });
  };`;

const insert = `    // Tambahkan data ke tabel simulasi (local state) agar langsung terlihat
    const paketDipilih = packages.length > 0 ? packages[0].name : "Umroh Reguler 9 Hari";
    const jemaahBaru = {
      id: Date.now().toString(),
      name: newJemaah.nama,
      nik: newJemaah.nik,
      porsi: nomorPorsiGenerate,
      packageName: paketDipilih,
      penyelenggara: pihkName || "Travel Anda",
      bayar: "LUNAS",
      visa: "PROSES"
    };
    
    setJemaahs([jemaahBaru, ...jemaahs]);

    setToastMessage({
      title: "Registrasi Terpusat Berhasil",
      desc: \`Jemaah: \${newJemaah.nama} (NIK: \${newJemaah.nik}) berhasil didaftarkan ke paket \${paketDipilih} dengan Porsi: \${nomorPorsiGenerate}.\`,
      type: "success"
    });
    setTimeout(() => setToastMessage(null), 5000);

    setShowAddJemaahModal(false);
    setNewJemaah({ nik: '', nama: '', porsi: '' });
  };`;

if (content.includes(search)) {
    content = content.replace(search, insert);
    writeFileSync(file, content);
    console.log("Add Jemaah updated to insert into table locally");
} else {
    console.log("Could not find the target code to replace!");
}
