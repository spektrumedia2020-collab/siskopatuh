const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const brokenPart = `                          value={pkg.statusVisa || "Belum Diajukan"}
                                                                onChange={(e) => {
                                         const file = e.target.files?.[0];`;

const fixedPart = `                          value={pkg.statusVisa || "Belum Diajukan"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusVisa: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Diajukan">Belum Diajukan</option>
                          <option value="Proses Kedutaan">Proses Kedutaan</option>
                          <option value="Sebagian Terbit">Sebagian Terbit</option>
                          <option value="Terbit Seluruhnya">Terbit Seluruhnya</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Plane className="w-3 h-3"/> Ketersediaan Tiket (PP)</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-300 outline-none font-mono text-xs"
                            value={\`BRKT: \${pkg.pnr} | PLG: \${pkg.pnrKepulangan || 'TBA'}\`}
                            disabled
                          />
                          <select 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                            value={pkg.statusTiket || "Belum Issued"}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { statusTiket: e.target.value }).catch(console.error);
                            }}
                          >
                            <option value="Belum Issued">Belum Issued</option>
                            <option value="Sebagian Issued">Sebagian Issued</option>
                            <option value="Issued Penuh (PP Asli)">Issued Penuh (PP Asli)</option>
                          </select>
                          
                          {/* Slot Unggah Bukti Tiket PP */}
                          <div className="mt-2">
                             {pkg.buktiTiketPP ? (
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
                             ) : (
                                <div>
                                   <input 
                                      type="file" 
                                      id={\`upload-tiket-\${pkg.id}\`}
                                      className="hidden"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                         const file = e.target.files?.[0];`;

c = c.replace(brokenPart, fixedPart);
fs.writeFileSync(p, c, 'utf8');
