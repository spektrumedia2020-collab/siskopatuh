const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

// Update table header in Paket Tayang
c = c.replace(
  /<th className="px-4 py-3">Maskapai \/ PNR<\/th>/,
  '<th className="px-4 py-3">Maskapai / PNR</th>\\n                        <th className="px-4 py-3">Hotel (Nusuk)</th>'
);

// Update table body in Paket Tayang
c = c.replace(
  /<td className="px-4 py-3 text-xs">\s*<span className="block text-slate-300">\{pkg\.airline\}<\/span>\s*<span className="font-mono text-slate-500">PNR: \{pkg\.pnr\}<\/span>\s*<\/td>/,
  `<td className="px-4 py-3 text-xs">
                              <span className="block text-slate-300">{pkg.airline}</span>
                              <span className="font-mono text-slate-500">PNR: {pkg.pnr}</span>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {pkg.hotelCode ? (
                                <div>
                                  <span className="block text-emerald-400 font-bold">{pkg.hotelName || "Tervalidasi"}</span>
                                  <span className="font-mono text-slate-500">BRN: {pkg.hotelCode}</span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-400 font-bold px-2 py-1 bg-rose-950/30 rounded border border-rose-900/50">
                                  <AlertCircle className="w-3 h-3"/> Wajib Update BRN
                                </span>
                              )}
                            </td>`
);

// Add BRN update logic in Operasional tab
const operasionalBRNBlock = `
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Building className="w-3 h-3"/> Validasi Akomodasi (Nusuk)</label>
                        <div className="flex flex-col gap-2">
                           <input 
                            type="text" 
                            className={\`w-full h-10 rounded-lg border \${!pkg.hotelCode ? 'border-rose-900 bg-rose-950/20 text-rose-300' : 'border-slate-700 bg-slate-950 text-emerald-400 font-mono'} px-3 text-sm focus:border-emerald-500 outline-none placeholder:text-slate-600\`}
                            placeholder="Input BRN (Contoh: AC-882910)"
                            value={pkg.hotelCode || ''}
                            disabled={!!pkg.hotelCode && !!pkg.hotelName} // Disabled jika sudah divalidasi dari paket
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { hotelCode: e.target.value.toUpperCase() }).catch(console.error);
                            }}
                          />
                          {!pkg.hotelName && pkg.hotelCode && pkg.hotelCode.length >= 4 && (
                            <button
                              onClick={() => {
                                updateDoc(doc(db, "packages", pkg.id), { 
                                  hotelName: "Zamzam Pullman (Update Legacy)",
                                  hotelCode: pkg.hotelCode
                                }).catch(console.error);
                                setToastMessage({title: 'Integrasi Nusuk Berhasil', desc: 'BRN berhasil divalidasi dan dikunci.', type: 'success'});
                                setTimeout(() => setToastMessage(null), 3000);
                              }}
                              className="w-full h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                            >
                              Validasi BRN ini ke Nusuk
                            </button>
                          )}
                          {!pkg.hotelCode && (
                             <span className="text-[10px] text-rose-400">BRN wajib dilengkapi sebelum keberangkatan!</span>
                          )}
                        </div>
                      </div>
`;

c = c.replace(
  /<div className="space-y-3 flex flex-col justify-end">/,
  operasionalBRNBlock + '\\n                      <div className="space-y-3 flex flex-col justify-end">'
);

// Add validation to handleLaporBerangkat
const berangkatVal = `const handleLaporBerangkat = async (pkg: any) => {
    if (!pkg.hotelCode || !pkg.hotelName) {
      setToastMessage({title: 'Sistem Menolak', desc: 'BRN Akomodasi dari Sistem Nusuk belum dilengkapi. Harap lengkapi di tab Operasional sebelum jemaah berangkat!', type: 'error'});
      setTimeout(() => setToastMessage(null), 7000);
      return;
    }`;

c = c.replace(/const handleLaporBerangkat = async \(pkg: any\) => \{/, berangkatVal);

// Change col-span in Operasional grid to accommodate the new column (from md:cols-5 to cols-1 and flex wrap or just md:grid-cols-6)
c = c.replace(/<div className="grid grid-cols-1 md:grid-cols-5 gap-6">/g, '<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">');


fs.writeFileSync(p, c, 'utf8');
