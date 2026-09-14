const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
  `Porsi: {userData.porsiNumber || '-'}</p>`,
  `Porsi: {userData.porsiNumber || userData.nomorPorsi || userData.porsi || '-'}</p>`
);

content = content.replace(
  `<p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">{userData?.porsiNumber || "-"}</p>`,
  `<p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">{userData?.porsiNumber || userData?.nomorPorsi || userData?.porsi || "-"}</p>`
);

fs.writeFileSync(p, content, 'utf8');
console.log("Done");
