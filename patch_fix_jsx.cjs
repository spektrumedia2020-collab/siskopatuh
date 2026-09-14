const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/Terlambat \(> 1x24 Jam\)/g, "Terlambat (&gt; 1x24 Jam)");
fs.writeFileSync(p, content, 'utf8');
