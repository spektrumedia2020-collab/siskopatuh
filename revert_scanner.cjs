const fs = require('fs');
const path = require('path');

// 1. App.tsx
const appPath = path.resolve('src/App.tsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');
  appContent = appContent.replace('import { PetugasScanner } from "./pages/PetugasScanner";\n', '');
  appContent = appContent.replace('<Route path="/petugas-scanner" element={<PetugasScanner />} />\n          ', '');
  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log("Reverted App.tsx");
}

// 2. Dashboard.tsx
const dashPath = path.resolve('src/pages/admin/Dashboard.tsx');
if (fs.existsSync(dashPath)) {
  let dashContent = fs.readFileSync(dashPath, 'utf8');
  const target = `<a href="/petugas-scanner" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-colors shadow-lg shadow-emerald-900/20">
                    <SmartphoneNfc className="w-4 h-4 mr-2" /> Buka App Mobile (Scanner)
                  </a>`;
  const replacement = `<div className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-slate-950 border border-slate-800 text-slate-400 text-xs text-center">
                    <Network className="w-4 h-4 mr-2 animate-pulse text-emerald-500" /> Menunggu feed dari Aplikasi Mobile...
                  </div>`;
  dashContent = dashContent.replace(target, replacement);
  fs.writeFileSync(dashPath, dashContent, 'utf8');
  console.log("Reverted Dashboard button");
}
