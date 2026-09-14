const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const funcsToAdd = `
  const handleLaporBerangkat = async (pkg: any) => {
    if (pkg.filled === 0) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Manifes jemaah belum terisi. Laporan dibatalkan.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    const isLate = pkg.name.toLowerCase().includes('ramadhan') || pkg.name.toLowerCase().includes('hemat');
    const status = isLate ? "Terlambat (> 1x24 Jam)" : "Sudah Lapor Keberangkatan";
    await updateDoc(doc(db, "packages", pkg.id), {
      statusKeberangkatan: status
    });
    setToastMessage({title: 'Laporan Diterima', desc: 'Data manifest keberangkatan dikunci dan dilaporkan ke Kemenhaj.', type: 'success'});
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleLaporPulang = async (pkg: any) => {
    if (!pkg.statusKeberangkatan || pkg.statusKeberangkatan === "Belum Lapor") {
      setToastMessage({title: 'Sistem Menolak', desc: 'Keberangkatan belum dilaporkan, Anda tidak bisa melapor kepulangan.', type: 'error'});
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
`;

content = content.replace(
  `  const handleUploadProof = async (id: string) => {`,
  funcsToAdd + '\n  const handleUploadProof = async (id: string) => {'
);

const laporBerangkatTarget = `<select 
                          className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          value={pkg.statusKeberangkatan || "Belum Lapor"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusKeberangkatan: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Lapor">Belum Lapor</option>
                          <option value="Sudah Berangkat">Sudah Lapor Keberangkatan</option>
                          <option value="Terlambat Lapor">Terlambat (> 1x24 Jam)</option>
                        </select>
                        {pkg.statusKeberangkatan === "Terlambat Lapor" && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900 mt-2"> 
                            Peringatan: Anda telah melanggar batas waktu laporan keberangkatan (KMHU No.2/2026).
                          </div>
                        )}`;

const laporBerangkatReplace = `
                        {pkg.statusKeberangkatan && pkg.statusKeberangkatan !== "Belum Lapor" ? (
                          <div className={\`w-full h-10 flex items-center justify-center rounded-lg border px-3 text-xs font-bold \${pkg.statusKeberangkatan.includes("Terlambat") ? 'bg-rose-950/30 border-rose-900 text-rose-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}\`}>
                            <CheckCircle2 className="w-4 h-4 mr-2"/>
                            {pkg.statusKeberangkatan}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleLaporBerangkat(pkg)}
                            className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center justify-center shadow-md shadow-emerald-900/20"
                          >
                            Kirim Laporan Aktual (Sistem)
                          </button>
                        )}
                        {pkg.statusKeberangkatan && pkg.statusKeberangkatan.includes("Terlambat") && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900 mt-2"> 
                            Peringatan Sistem: Anda melanggar batas SLA laporan. Hal ini diteruskan ke EWS Pusat.
                          </div>
                        )}
`;
content = content.replace(laporBerangkatTarget, laporBerangkatReplace);

const laporPulangTarget = `<select 
                          className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          value={pkg.statusKepulangan || "Belum Lapor"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusKepulangan: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Lapor">Belum Lapor</option>
                          <option value="Sudah Pulang">Sudah Lapor Kepulangan</option>
                          <option value="Terlambat Lapor">Terlambat (> 1x24 Jam)</option>
                        </select>
                        {pkg.statusKepulangan === "Terlambat Lapor" && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900"> 
                            Peringatan: Anda telah melanggar batas waktu laporan kepulangan (KMHU No.2/2026). Segera laporkan atau Anda akan menerima sanksi!
                          </div>
                        )}`;

const laporPulangReplace = `
                        {pkg.statusKepulangan && pkg.statusKepulangan !== "Belum Lapor" ? (
                           <div className={\`w-full h-10 flex items-center justify-center rounded-lg border px-3 text-xs font-bold \${pkg.statusKepulangan.includes("Terlambat") ? 'bg-rose-950/30 border-rose-900 text-rose-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}\`}>
                            <CheckCircle2 className="w-4 h-4 mr-2"/>
                            {pkg.statusKepulangan}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleLaporPulang(pkg)}
                            className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center justify-center shadow-md shadow-emerald-900/20"
                          >
                            Kirim Laporan Aktual (Sistem)
                          </button>
                        )}
                        {pkg.statusKepulangan && pkg.statusKepulangan.includes("Terlambat") && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900 mt-2"> 
                            Peringatan Sistem: Laporan melebihi batas waktu! Diteruskan ke EWS Kemenhaj.
                          </div>
                        )}
`;
content = content.replace(laporPulangTarget, laporPulangReplace);

fs.writeFileSync(p, content, 'utf8');
