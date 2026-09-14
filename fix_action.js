import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Add handleSendWarning and handleResolveSOS functions inside AdminDashboard before return
const functionHooks = `  const handleResolveSOS = async (id: string) => {
    try {
      await updateDoc(doc(db, "sos_alerts", id), { status: "resolved" });
      setToastMessage({title: "SOS Ditangani", desc: "Sinyal telah diselesaikan secara sistem.", type: "success"});
    } catch (e) {
      console.error(e);
      setToastMessage({title: "Error", desc: "Gagal memproses ke database.", type: "error"});
    }
  };

  const handleSendWarning = async (travelName: string, actionName: string) => {
    try {
      await addDoc(collection(db, "ews_warnings"), {
        ppiu: travelName,
        judul: actionName,
        status: "active",
        timestamp: new Date().toISOString()
      });
      setToastMessage({title: "Tindakan Dikirim", desc: \`\${actionName} telah masuk ke sistem \${travelName}\`, type: "success"});
    } catch (e) {
      console.error(e);
      setToastMessage({title: "Error", desc: "Gagal mengirim tindakan EWS.", type: "error"});
    }
  };

  return (
    <div className="flex flex-col w-full text-slate-200">`;

if (content.includes('return (\n    <div className="flex flex-col w-full text-slate-200">')) {
    content = content.replace('return (\n    <div className="flex flex-col w-full text-slate-200">', functionHooks);
}

// 2. Fix the SOS onClick
content = content.replace(
    /onClick=\{\(\) => \{\s*setToastMessage\(\{title: "SOS Ditangani", desc: "Sinyal telah dicatat dan dalam proses penanganan\.", type: "success"\}\);\s*\}\}/g,
    `onClick={() => handleResolveSOS(alert.id)}`
);

// 3. Fix Mock Item 1
content = content.replace(
    /<Button size="sm" variant="outline" className="w-full border-amber-900\/40 text-amber-500 hover:bg-amber-950\/40 hover:text-amber-400 h-8 text-\[10px\] font-bold">Kirim Surat Peringatan III<\/Button>/g,
    `<Button size="sm" onClick={() => handleSendWarning("PT. Khazanah Tamma Internasional", "Surat Peringatan III: Pengembalian Dana BPKH")} variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Kirim Surat Peringatan III</Button>`
);

// 4. Fix Mock Item 2
content = content.replace(
    /<Button size="sm" variant="outline" className="w-full border-amber-900\/40 text-amber-500 hover:bg-amber-950\/40 hover:text-amber-400 h-8 text-\[10px\] font-bold">Kirim Peringatan I<\/Button>/g,
    `<Button size="sm" onClick={() => handleSendWarning("PT. Masy'aril Haram Tour", "Peringatan I: Kelengkapan Dokumen Siskohat")} variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Kirim Peringatan I</Button>`
);

// 5. Fix Mock Item 3
content = content.replace(
    /<Button size="sm" variant="outline" className="w-full border-amber-900\/40 text-amber-500 hover:bg-amber-950\/40 hover:text-amber-400 h-8 text-\[10px\] font-bold">Panggil Manajemen<\/Button>/g,
    `<Button size="sm" onClick={() => handleSendWarning("PT. Hanania", "Panggilan Manajemen: Penelantaran 120 Jemaah")} variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Panggil Manajemen</Button>`
);

// 6. Fix Mock Item 4
content = content.replace(
    /<Button size="sm" variant="outline" className="w-full border-amber-900\/40 text-amber-500 hover:bg-amber-950\/40 hover:text-amber-400 h-8 text-\[10px\] font-bold">Panggil Paksa<\/Button>/g,
    `<Button size="sm" onClick={() => handleSendWarning("PT. Hidayah Amanah Jemaah", "Panggilan Paksa: Mangkir Mediasi Bareskrim")} variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Panggil Paksa</Button>`
);

writeFileSync(file, content);
console.log("Actions mapped!");
