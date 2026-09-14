const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const oldKeberangkatanStr = `<select 
                          className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          value={pkg.statusKeberangkatan || "Belum Lapor"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusKeberangkatan: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Lapor">Belum Lapor</option>
                          <option value="Sudah Berangkat">Sudah Lapor Keberangkatan</option>
                        </select>`;

const newKeberangkatanStr = `<select 
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

content = content.replace(oldKeberangkatanStr, newKeberangkatanStr);
fs.writeFileSync(p, content, 'utf8');
