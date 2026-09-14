const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `const file = e.target.files?.[0];
                        if (file) {`;
const insertStr = `const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024) { // 1MB limit
                            alert("Ukuran foto terlalu besar. Maksimal 1 MB.");
                            return;
                          }`;

content = content.replace(targetStr, insertStr);
fs.writeFileSync(p, content, 'utf8');
