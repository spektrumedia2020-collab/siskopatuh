const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/PetugasScanner.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/\\\`/g, '\`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(p, content, 'utf8');
console.log("Fixed syntax in PetugasScanner");
