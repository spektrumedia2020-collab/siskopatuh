const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `<tbody className="text-sm">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-slate-300">PT. Khazanah Tamma Internasional</td>
                      <td className="p-4 font-bold text-rose-400">45 / 100</td>
                      <td className="p-4"><span className="px-2 py-1 bg-rose-950 text-rose-400 border border-rose-900 rounded text-[10px] font-bold">Akreditasi D</span></td>
                      <td className="p-4"><Button size="sm" onClick={() => handleSendWarning("PT. Khazanah Tamma Internasional", "Teguran Administratif: Skor Kepatuhan Rendah (Akreditasi D)")} variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Berikan Teguran</Button></td>
                    </tr>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-slate-300">PT. Mabrur Travel Umroh</td>
                      <td className="p-4 font-bold text-emerald-400">92 / 100</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold">Akreditasi A</span></td>
                      <td className="p-4"><span className="text-xs text-slate-500 italic">Aman</span></td>
                    </tr>
                  </tbody>`;

const replacementStr = `<tbody className="text-sm">
                    {penyelenggaraUsers.map(u => (
                      <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-slate-300">
                          {u.name}
                          <div className="text-[10px] font-normal text-slate-500 mt-1">{u.nib || '-'}</div>
                        </td>
                        <td className="p-4">
                           <span className={\`px-2 py-1 rounded text-[10px] font-bold \${u.status === 'Dibekukan' || u.status === 'Cabut Izin' ? 'bg-rose-950 text-rose-400 border border-rose-900' : 'bg-slate-800 text-slate-300 border border-slate-700'}\`}>
                             {u.status || 'Tervalidasi'}
                           </span>
                        </td>
                        <td className="p-4 font-bold text-amber-400 text-xs">
                          {u.current_sanction || '-'}
                        </td>
                        <td className="p-4">
                          <Button size="sm" onClick={() => setSelectedPenyelenggaraForSanction(u)} variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">
                            Beri Sanksi
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {penyelenggaraUsers.length === 0 && (
                      <tr><td colSpan={4} className="p-4 text-center text-slate-500">Tidak ada data</td></tr>
                    )}
                  </tbody>`;

content = content.replace(targetStr, replacementStr);

const modalTargetStr = `{/* Modal Kepatuhan Detail */}`;
const modalAdditionStr = `
      {/* Modal Sanksi Kepatuhan (4 Alur) */}
      {selectedPenyelenggaraForSanction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-800">
                <h3 className="text-xl font-bold text-rose-400 mb-1">Berikan Sanksi Pelanggaran</h3>
                <p className="text-sm text-slate-400">Pilih alur sanksi yang akan dijatuhkan kepada <span className="font-bold text-white">{selectedPenyelenggaraForSanction.name}</span></p>
             </div>
             <div className="p-6 space-y-4">
                <div className="space-y-3">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">Pilih Jenis Sanksi</label>
                   <div className="grid grid-cols-1 gap-3">
                      {["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"].map(s => (
                        <div key={s} 
                          onClick={() => setSanctionType(s)}
                          className={\`p-4 rounded-xl border cursor-pointer transition-all \${sanctionType === s ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}\`}>
                          <div className="font-bold">{s}</div>
                          <div className="text-[10px] mt-1 opacity-70">
                            {s === 'Pembekuan Izin Sementara' || s === 'Pencabutan Izin Usaha' ? 'Sanksi ini akan memblokir penyelenggara dari akses SISKOPATUH.' : 'Sanksi administratif untuk peringatan dini.'}
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="p-6 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
               <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setSelectedPenyelenggaraForSanction(null)}>Batal</Button>
               <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold" onClick={handleApplySanction} disabled={isApplyingSanction}>
                 {isApplyingSanction ? 'Menyimpan...' : 'Terapkan Sanksi'}
               </Button>
             </div>
          </div>
        </div>
      )}
`;

content = content.replace(modalTargetStr, modalAdditionStr + '\n      ' + modalTargetStr);

fs.writeFileSync(p, content, 'utf8');
