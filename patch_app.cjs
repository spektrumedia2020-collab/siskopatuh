const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let content = fs.readFileSync(p, 'utf8');

const importTarget = `import { Panduan } from "./pages/Panduan";`;
const importReplacement = `import { Panduan } from "./pages/Panduan";\nimport { PetugasScanner } from "./pages/PetugasScanner";`;
if (content.indexOf('PetugasScanner') === -1) {
  content = content.replace(importTarget, importReplacement);
}

const routeTarget = `<Route path="*" element={<div className="p-10 text-white">404 - Halaman Tidak Ditemukan (atau URL salah)</div>} />`;
const routeReplacement = `<Route path="/petugas-scanner" element={<PetugasScanner />} />\n          <Route path="*" element={<div className="p-10 text-white">404 - Halaman Tidak Ditemukan (atau URL salah)</div>} />`;
if (content.indexOf('/petugas-scanner') === -1) {
  content = content.replace(routeTarget, routeReplacement);
}

fs.writeFileSync(p, content, 'utf8');
console.log("Patched App.tsx");
