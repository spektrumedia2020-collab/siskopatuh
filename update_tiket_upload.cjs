const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /const handleLaporPulang = async \(pkg: any\) => {[\s\S]*?(?=const handleUploadProof)/,
  `const handleLaporPulang = async (pkg: any) => {
    if (!pkg.statusKeberangkatan || pkg.statusKeberangkatan === "Belum Lapor") {
      setToastMessage({title: 'Sistem Menolak', desc: 'Keberangkatan belum dilaporkan, Anda tidak bisa melapor kepulangan.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    if (!pkg.buktiTiketPP) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Dokumen tiket pesawat PP belum diunggah. Wajib melampirkan tiket.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    if (!pkg.masaBerlakuTiket) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Durasi masa berlaku tiket belum diinput.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(pkg.masaBerlakuTiket);
    if (expiry < today) {
       setToastMessage({title: 'Validasi Gagal', desc: 'Masa berlaku tiket sudah habis (Expired). Status kepulangan diblokir.', type: 'error'});
       setTimeout(() => setToastMessage(null), 5000);
       return;
    }

    const isLate = pkg.name.toLowerCase().includes('ramadhan') || pkg.name.toLowerCase().includes('hemat');
    const status = isLate ? "Terlambat (> 1x24 Jam)" : "Sudah Lapor Kepulangan";
    await updateDoc(doc(db, "packages", pkg.id), {
      statusKepulangan: status
    });
    setToastMessage({title: 'Laporan Diterima', desc: 'Data kedatangan jemaah berhasil dilaporkan ke Kemenhaj.', type: 'success'});
    setTimeout(() => setToastMessage(null), 5000);
  };

  `
);

const uploadLogic = `                                      onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                            const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
                                            const ext = file.name.split('.').pop()?.toLowerCase();
                                            if (!ext || !allowedExtensions.includes(ext)) {
                                               setToastMessage({title: 'Format Ditolak', desc: 'Sistem hanya menerima file berformat PDF, JPG, JPEG, atau PNG.', type: 'error'});
                                               setTimeout(() => setToastMessage(null), 5000);
                                               return;
                                            }
                                            updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: file.name }).catch(console.error);
                                            setToastMessage({
                                               title: 'Unggah Berhasil',
                                               desc: \`File \${file.name} telah dilampirkan.\`,
                                               type: 'success'
                                            });
                                         }
                                      }}`;

c = c.replace(/onChange={\(e\) => {[\s\S]*?if \(file\) {[\s\S]*?updateDoc\(doc\(db, "packages", pkg\.id\), { buktiTiketPP: file\.name }\)\.catch\(console\.error\);[\s\S]*?setToastMessage\({[\s\S]*?title: 'Unggah Berhasil',[\s\S]*?desc: `File \${file\.name} telah dilampirkan\.`,[\s\S]*?type: 'success'[\s\S]*?}\);[\s\S]*?}[\s\S]*?}}/, uploadLogic);

const masaBerlakuInput = `                             {pkg.buktiTiketPP ? (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900 rounded p-2">
                                     <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold max-w-[80%]" title={pkg.buktiTiketPP}>
                                        <FileText className="w-3 h-3 shrink-0" /> <span className="truncate">{pkg.buktiTiketPP}</span>
                                     </div>
                                     <button 
                                        onClick={(e) => {
                                           e.preventDefault();
                                           updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: "", masaBerlakuTiket: "" }).catch(console.error);
                                        }}
                                        className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-1 bg-slate-900 rounded-full"
                                        title="Hapus lampiran"
                                     >
                                        <X className="w-4 h-4" />
                                     </button>
                                  </div>
                                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                                    <label className="text-[10px] text-slate-400 block mb-1">Batas Masa Berlaku Tiket</label>
                                    <input 
                                      type="date"
                                      className="w-full h-7 rounded border border-slate-700 bg-slate-900 px-2 text-[10px] text-slate-300 focus:border-emerald-500 outline-none"
                                      value={pkg.masaBerlakuTiket || ''}
                                      onChange={(e) => updateDoc(doc(db, "packages", pkg.id), { masaBerlakuTiket: e.target.value }).catch(console.error)}
                                    />
                                  </div>
                                </div>
                             ) : (`;

c = c.replace(/{pkg\.buktiTiketPP \? \([\s\S]*?<div className="flex items-center justify-between bg-emerald-950\/30 border border-emerald-900 rounded p-2">[\s\S]*?<\/div>[\s\S]*?\) : \(/, masaBerlakuInput);

fs.writeFileSync(p, c, 'utf8');
