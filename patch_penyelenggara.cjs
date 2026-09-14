const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// Update Kepulangan options and displays in Penyelenggara
content = content.replace(
  `                          <option value="Terlambat Lapor">Terlambat (&gt; 1x24 Jam)</option>`,
  `                          <option value="Terlambat Lapor">Terlambat (&gt; 1x24 Jam)</option>
                          <option value="Tunda Kepulangan">Tunda Kepulangan (EWS)</option>`
);

content = content.replace(
  `{pkg.statusKepulangan === "Terlambat Lapor" && (`,
  `{(pkg.statusKepulangan?.includes("Terlambat") || pkg.statusKepulangan?.includes("Tunda")) && (`
);

fs.writeFileSync(p, content, 'utf8');
console.log("Patched Penyelenggara Dashboard");
