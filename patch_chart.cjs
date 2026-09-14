const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/pokok: 25000000/g, 'pokok: computedBalance');
fs.writeFileSync(p, content, 'utf8');
console.log("Patched chart regex");
