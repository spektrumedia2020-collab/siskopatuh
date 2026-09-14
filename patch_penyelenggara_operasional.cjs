const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const asuransiTarget = `<div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Asuransi Perjalanan</label>`;

const newReportsStr = `<div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><PlaneTakeoff className="w-3 h-3"/> Lapor Keberangkatan (Max 1x24 Jam)</label>
                        <select 
                          className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          value={pkg.statusKeberangkatan || "Belum Lapor"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusKeberangkatan: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Lapor">Belum Lapor</option>
                          <option value="Sudah Berangkat">Sudah Lapor Keberangkatan</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"/> Lapor Kepulangan (Max 1x24 Jam)</label>
                        <select 
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
                        )}
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Asuransi Perjalanan</label>`;

content = content.replace(asuransiTarget, newReportsStr);
fs.writeFileSync(p, content, 'utf8');
