const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetStr = `                          {/* Slot Unggah Bukti Tiket PP */}
                          <div className="mt-2">
                             {pkg.buktiTiketPP ? (
                                <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900 rounded p-2">
                                   <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold">
                                      <FileText className="w-3 h-3" /> Bukti Tiket PP Terlampir
                                   </div>
                                   <button 
                                      onClick={() => updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: null }).catch(console.error)}
                                      className="text-slate-400 hover:text-rose-400 transition-colors"
                                   >
                                      <X className="w-3 h-3" />
                                   </button>
                                </div>
                             ) : (
                                <button 
                                   onClick={() => {
                                      // Simulasi upload file berhasil
                                      updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: "https://storage.example.com/tiket-pp.pdf" }).catch(console.error);
                                      setToastMessage({
                                         title: 'Unggah Berhasil',
                                         desc: 'Bukti Tiket Kepulangan & Keberangkatan (PP) telah dilampirkan.',
                                         type: 'success'
                                      });
                                   }}
                                   className="w-full h-8 rounded border border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/80 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 text-[10px] transition-all flex items-center justify-center gap-2"
                                >
                                   <Upload className="w-3 h-3" /> Lampirkan Bukti Tiket PP
                                </button>
                             )}
                          </div>`;

const replacementStr = `                          {/* Slot Unggah Bukti Tiket PP */}
                          <div className="mt-2">
                             {pkg.buktiTiketPP ? (
                                <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900 rounded p-2">
                                   <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold max-w-[80%]" title={pkg.buktiTiketPP}>
                                      <FileText className="w-3 h-3 shrink-0" /> <span className="truncate">{pkg.buktiTiketPP}</span>
                                   </div>
                                   <button 
                                      onClick={() => updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: null }).catch(console.error)}
                                      className="text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                                      title="Hapus lampiran"
                                   >
                                      <X className="w-3 h-3" />
                                   </button>
                                </div>
                             ) : (
                                <div>
                                   <input 
                                      type="file" 
                                      id={\`upload-tiket-\${pkg.id}\`}
                                      className="hidden"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                            updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: file.name }).catch(console.error);
                                            setToastMessage({
                                               title: 'Unggah Berhasil',
                                               desc: \`File \${file.name} telah dilampirkan.\`,
                                               type: 'success'
                                            });
                                         }
                                      }}
                                   />
                                   <label 
                                      htmlFor={\`upload-tiket-\${pkg.id}\`}
                                      className="w-full h-8 rounded border border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/80 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                   >
                                      <Upload className="w-3 h-3" /> Pilih File Tiket PP
                                   </label>
                                </div>
                             )}
                          </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched successfully.");
} else {
  console.log("Target string not found.");
}
