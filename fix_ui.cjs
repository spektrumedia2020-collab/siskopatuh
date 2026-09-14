const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// Replace Keberangkatan UI
content = content.replace(
  /<label className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><PlaneTakeoff className="w-3 h-3"\/> Lapor Keberangkatan \(Max 1x24 Jam\)<\/label>[\s\S]*?<\/div>\s*<div className="space-y-3">\s*<label className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"\/> Lapor Kepulangan \(Max 1x24 Jam\)<\/label>/g,
  `<label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><PlaneTakeoff className="w-3 h-3"/> Lapor Keberangkatan (Max 1x24 Jam)</label>
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
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"/> Lapor Kepulangan (Max 1x24 Jam)</label>`
);

// Replace Kepulangan UI
content = content.replace(
  /<label className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"\/> Lapor Kepulangan \(Max 1x24 Jam\)<\/label>[\s\S]*?<\/div>\s*<div className="space-y-3">\s*<label className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"\/> Asuransi Perjalanan<\/label>/g,
  `<label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"/> Lapor Kepulangan (Max 1x24 Jam)</label>
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
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Asuransi Perjalanan</label>`
);

fs.writeFileSync(p, content, 'utf8');
console.log("Replaced successfully");
