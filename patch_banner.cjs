const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const oldBanner = /<div className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-slate-950 border border-slate-800 text-slate-400 text-xs text-center">\s*<Network className="w-4 h-4 mr-2 animate-pulse text-emerald-500" \/> Menunggu feed dari Aplikasi Mobile...\s*<\/div>/;

const newBanner = `{mobileScans.length === 0 ? (
                    <div className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-slate-950 border border-slate-800 text-slate-400 text-xs text-center">
                      <Network className="w-4 h-4 mr-2 animate-pulse text-emerald-500" /> Menunggu feed dari Aplikasi Mobile...
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-emerald-950 border border-emerald-900 text-emerald-400 text-xs text-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Menerima {mobileScans.length} feed sinkronisasi...
                    </div>
                  )}`;

if (content.match(oldBanner)) {
  content = content.replace(oldBanner, newBanner);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched banner successfully");
} else {
  console.log("Could not find the banner regex.");
}
