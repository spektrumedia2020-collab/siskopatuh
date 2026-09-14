const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `{["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"].map(s => (
                        <div key={s} 
                          onClick={() => setSanctionType(s)}
                          className={\`p-4 rounded-xl border cursor-pointer transition-all \${sanctionType === s ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}\`}>
                          <div className="font-bold">{s}</div>
                          <div className="text-[10px] mt-1 opacity-70">
                            {s === 'Pembekuan Izin Sementara' || s === 'Pencabutan Izin Usaha' ? 'Sanksi ini akan memblokir penyelenggara dari akses SISKOPATUH.' : 'Sanksi administratif untuk peringatan dini.'}
                          </div>
                        </div>
                      ))}`;

const replacement = `{(() => {
                        const sanctionLevels = ["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"];
                        const currentSanctions = selectedPenyelenggaraForSanction?.sanctions || [];
                        const maxSanctionIndex = currentSanctions.reduce((max, s) => {
                          const index = sanctionLevels.indexOf(s.type);
                          return index > max ? index : max;
                        }, -1);
                        const maxAllowedIndex = maxSanctionIndex + 1;

                        return sanctionLevels.map((s, index) => {
                          const isAllowed = index <= maxAllowedIndex;
                          return (
                            <div key={s} 
                              onClick={() => isAllowed && setSanctionType(s)}
                              className={\`p-4 rounded-xl border transition-all \${!isAllowed ? 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-800' : sanctionType === s ? 'bg-rose-950/40 border-rose-500 text-rose-300 cursor-pointer' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer'}\`}>
                              <div className="font-bold flex justify-between items-center">
                                {s}
                                {!isAllowed && <span className="text-[10px] font-normal text-rose-500/70 border border-rose-500/20 px-2 py-0.5 rounded">Terkunci</span>}
                              </div>
                              <div className="text-[10px] mt-1 opacity-70">
                                {!isAllowed ? 'Sanksi sebelumnya harus diberikan terlebih dahulu.' : (s === 'Pembekuan Izin Sementara' || s === 'Pencabutan Izin Usaha' ? 'Sanksi ini akan memblokir penyelenggara dari akses SISKOPATUH.' : 'Sanksi administratif untuk peringatan dini.')}
                              </div>
                            </div>
                          );
                        });
                      })()}`;

if (content.indexOf('{["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"].map(s => (') !== -1) {
  // It might have exact match or slightly different formatting
  content = content.replace(target, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched exactly.");
} else {
  // Regex approach
  const regex = /\{\["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"\]\.map\(s => \([\s\S]*?<\/div>[\s]*\)\)\} /;
  if(regex.test(content)) {
     // do something
     console.log("Regex matches");
  } else {
     console.log("Regex no match");
  }
}

