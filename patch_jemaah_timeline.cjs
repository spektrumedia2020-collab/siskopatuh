const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">`;
const replaceStr = `                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Keberangkatan */}
                      <div className={\`p-4 rounded-xl border \${myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700/50'}\`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemantauan Keberangkatan</p>
                          {myPackage.statusKeberangkatan === 'Sudah Berangkat' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <PlaneTakeoff className="w-4 h-4 text-slate-500" />}
                        </div>
                        <p className={\`text-lg font-bold \${myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'text-emerald-400' : 'text-slate-400'}\`}>
                          {myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'Sudah Diberangkatkan' : 'Menunggu Jadwal Berangkat'}
                        </p>
                      </div>

                      {/* Kepulangan */}
                      <div className={\`p-4 rounded-xl border \${myPackage.statusKepulangan === 'Sudah Pulang' ? 'bg-emerald-900/20 border-emerald-500/30' : myPackage.statusKepulangan === 'Terlambat Lapor' ? 'bg-rose-900/20 border-rose-500/30' : 'bg-slate-900/50 border-slate-700/50'}\`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemantauan Kepulangan</p>
                          {myPackage.statusKepulangan === 'Sudah Pulang' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <MapPin className="w-4 h-4 text-slate-500" />}
                        </div>
                        <p className={\`text-lg font-bold \${myPackage.statusKepulangan === 'Sudah Pulang' ? 'text-emerald-400' : myPackage.statusKepulangan === 'Terlambat Lapor' ? 'text-rose-400' : 'text-slate-400'}\`}>
                          {myPackage.statusKepulangan === 'Sudah Pulang' ? 'Tiba di Tanah Air' : myPackage.statusKepulangan === 'Terlambat Lapor' ? 'Belum Ada Konfirmasi Kepulangan' : 'Menunggu Kepulangan'}
                        </p>
                        {myPackage.statusKepulangan === 'Terlambat Lapor' && (
                           <p className="text-xs text-rose-400 mt-1">Sistem sedang menegur pihak travel.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync(p, content, 'utf8');
