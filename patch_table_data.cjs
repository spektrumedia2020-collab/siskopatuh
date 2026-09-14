const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const regex = /<tbody className="text-sm">[\s\S]*?<\/tbody>/;
const replacement = `<tbody className="text-sm">
                      {mobileScans.length > 0 ? mobileScans.map((scan, i) => (
                        <tr key={scan.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 animate-in fade-in slide-in-from-top-2">
                          <td className="p-4 font-mono text-xs text-slate-400">
                            {scan.timestamp?.seconds ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString('id-ID') : 
                             (typeof scan.timestamp === 'string' ? new Date(scan.timestamp).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID'))}
                          </td>
                          <td className="p-4 font-bold text-slate-300">
                            {scan.rawData?.includes(':') ? scan.rawData.split(':')[2] : (scan.scannedData || scan.rawData || 'Jemaah')}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">
                             {scan.rawData?.includes(':') ? scan.rawData.split(':')[1] : (scan.scannedData || scan.rawData || '-')}
                          </td>
                          <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Match</span></td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Belum ada data pindaian hari ini dari aplikasi mobile.</td></tr>
                      )}
                    </tbody>`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched table logic to accept alternative keys");
}
