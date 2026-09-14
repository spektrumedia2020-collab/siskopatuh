const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/Login.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetLogic = `        if (snapshot.empty) {
          setError("Data PIHK/PPIU tidak ditemukan di database. Pastikan NIB/ID Anda terdaftar.");
          setIsPenyelenggaraLoading(false);
          return;
        }
        const userDoc = snapshot.docs[0];
        localStorage.setItem("penyelenggara_auth_uid", userDoc.id);
        navigate("/penyelenggara");`;

const replacementLogic = `        if (snapshot.empty) {
          setError("Data PIHK/PPIU tidak ditemukan di database. Pastikan NIB/ID Anda terdaftar.");
          setIsPenyelenggaraLoading(false);
          return;
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        
        if (userData.status === 'Dibekukan') {
           setError("Akses Ditolak: Izin Usaha Anda sedang DIBEKUKAN oleh Kementerian Agama. Silakan hubungi pusat.");
           setIsPenyelenggaraLoading(false);
           return;
        }
        if (userData.status === 'Cabut Izin') {
           setError("Akses Ditolak: Izin Usaha Anda telah DICABUT oleh Kementerian Agama.");
           setIsPenyelenggaraLoading(false);
           return;
        }
        
        localStorage.setItem("penyelenggara_auth_uid", userDoc.id);
        navigate("/penyelenggara");`;

content = content.replace(targetLogic, replacementLogic);
fs.writeFileSync(p, content, 'utf8');
