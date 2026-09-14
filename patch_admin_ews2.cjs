const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `                 <div className="divide-y divide-slate-800/50">
                    {/* Mock Item 1 */}`;
// Note: wait, it's easier to just find the start of the `<CardDescription className="text-xs">Sistem deteksi dini terkait kepatuhan penyelenggaraan dan operasional.</CardDescription>` and replace up to the next `</Card>`.
// I will use regex to replace everything inside the `<CardContent>` of Kolom SLA Warning.

const contentRegex = /<CardDescription className="text-xs">Sistem deteksi dini terkait kepatuhan penyelenggaraan dan operasional\.<\/CardDescription>\s*<\/CardHeader>\s*<CardContent className="p-0 overflow-y-auto flex-grow bg-slate-900\/50">[\s\S]*?<\/CardContent>/m;

const replaceContent = `<CardDescription className="text-xs">Sistem deteksi dini KMHU No.2/2026 dan operasional.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 overflow-y-auto flex-grow bg-slate-900/50">
                 <div className="divide-y divide-slate-800/50">
                    {slaWarnings.length > 0 ? slaWarnings.map((warning, i) => (
                       <div key={'sla-'+i} className="p-5 hover:bg-slate-800/40 transition-colors bg-rose-950/10">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <h4 className="font-bold text-amber-400 text-sm">{warning.pihkName || 'Travel Tidak Diketahui'}</h4>
                             <p className="text-[10px] text-slate-500 font-mono mt-1">Paket: {warning.name}</p>
                           </div>
                           <span className="px-2 py-1 bg-amber-900/50 text-amber-400 font-bold text-[9px] uppercase tracking-widest rounded-sm border border-amber-900/50">
                             Pelanggaran SLA
                           </span>
                         </div>
                         <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 mb-4">
                           <p className="text-xs text-slate-300 font-medium leading-relaxed">
                              Tidak melapor <span className="font-bold text-white">{warning.statusKeberangkatan === 'Terlambat Lapor' ? 'Keberangkatan' : 'Kepulangan'}</span> Jemaah lebih dari 1x24 jam sejak jadwal.
                           </p>
                         </div>
                         <div className="flex justify-end gap-2">
                           <Button size="sm" variant="outline" className="border-rose-900/50 text-rose-400 hover:bg-rose-900 hover:text-white h-7 text-[10px] font-bold" onClick={() => { setActiveTab('kepatuhan'); }}>Tindak Lanjuti di Kepatuhan</Button>
                         </div>
                       </div>
                    )) : (
                      <div className="p-12 text-center text-slate-500">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-30 text-emerald-500" />
                        Tidak ada pelaporan yang melewati batas waktu 1x24 Jam.
                      </div>
                    )}
                 </div>
               </CardContent>`;

content = content.replace(contentRegex, replaceContent);
fs.writeFileSync(p, content, 'utf8');
