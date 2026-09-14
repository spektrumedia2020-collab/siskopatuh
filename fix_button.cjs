const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetBtn = `<Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
                                Detail
                              </Button>`;

const newBtn = `<Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs bg-transparent border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white active:bg-slate-600 active:text-white"
                                onClick={() => setToastMessage({title: 'Detail Kepatuhan', desc: \`Menampilkan riwayat audit untuk \${item.name}\`, type: 'info'})}
                              >
                                Detail
                              </Button>`;

if (content.includes(targetBtn)) {
  content = content.replace(targetBtn, newBtn);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Button patched.");
} else {
  console.log("Target button not found.");
}
