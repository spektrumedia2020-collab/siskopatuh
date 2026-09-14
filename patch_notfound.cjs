const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let content = fs.readFileSync(p, 'utf8');
content = content.replace('</Routes>', '  <Route path="*" element={<div className="p-10 text-white">404 - Halaman Tidak Ditemukan (atau URL salah)</div>} />\n        </Routes>');
fs.writeFileSync(p, content, 'utf8');
