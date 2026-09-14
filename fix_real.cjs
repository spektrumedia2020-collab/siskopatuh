const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const kepatuhanReplacement = `<tbody className="text-sm">
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-slate-300">PT. Khazzanah Al-Anshary</td>
                        <td className="p-4"><span className="text-emerald-400 font-bold">98/100</span></td>
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> A (Sangat Baik)</span></td>
                        <td className="p-4"><Button size="sm" variant="outline" className="h-7 text-[10px]">Audit</Button></td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-slate-300">PT. Al-Fatihah Tour</td>
                        <td className="p-4"><span className="text-amber-400 font-bold">75/100</span></td>
                        <td className="p-4"><span className="px-2 py-1 bg-amber-950 text-amber-400 border border-amber-900 rounded text-xs flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3"/> C (Peringatan)</span></td>
                        <td className="p-4"><Button size="sm" variant="outline" className="h-7 text-[10px]">Audit</Button></td>
                      </tr>
                    </tbody>`;

const kepatuhanRegex = /<tbody className="text-sm">[\s\S]*?\{scan\.rawData\?\.includes\(':'\)\s*\?\s*scan\.rawData\.split\(':'\)\[2\][\s\S]*?<\/td>[\s\S]*?<\/tr>[\s\S]*?<\/tbody>/;

if (content.match(kepatuhanRegex)) {
    content = content.replace(kepatuhanRegex, kepatuhanReplacement);
    console.log("Kepatuhan replaced successfully");
} else {
    console.log("Could not find Kepatuhan table.");
}

fs.writeFileSync(p, content, 'utf8');
