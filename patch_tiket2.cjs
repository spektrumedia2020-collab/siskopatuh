const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetStr = `                                   <button 
                                      onClick={() => updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: null }).catch(console.error)}
                                      className="text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                                      title="Hapus lampiran"
                                   >
                                      <X className="w-3 h-3" />
                                   </button>`;

const replacementStr = `                                   <button 
                                      onClick={(e) => {
                                         e.preventDefault();
                                         updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: "" }).catch(console.error);
                                      }}
                                      className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-1 bg-slate-900 rounded-full"
                                      title="Hapus lampiran"
                                   >
                                      <X className="w-4 h-4" />
                                   </button>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched X button successfully.");
} else {
  console.log("Target string not found for X button.");
}
