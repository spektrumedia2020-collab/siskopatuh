const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `<Button size="sm" onClick={() => setSelectedPenyelenggaraForSanction(u)} variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">`;

const replacement = `<Button size="sm" onClick={() => {
                            setSelectedPenyelenggaraForSanction(u);
                            const levels = ["Teguran Tertulis", "Denda Administratif", "Pembekuan Izin Sementara", "Pencabutan Izin Usaha"];
                            const curSanc = u.sanctions || [];
                            const maxIdx = curSanc.reduce((max, s) => {
                              const idx = levels.indexOf(s.type);
                              return idx > max ? idx : max;
                            }, -1);
                            const nextIdx = maxIdx + 1 < levels.length ? maxIdx + 1 : maxIdx;
                            setSanctionType(levels[nextIdx > -1 ? nextIdx : 0]);
                          }} variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">`;

if (content.indexOf(target) !== -1) {
  content = content.replace(target, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched onClick exactly.");
} else {
  console.log("Not found.");
}

