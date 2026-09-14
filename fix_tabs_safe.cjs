const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// The original Kepatuhan tbody:
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

// The scanner logic for mobile scans that should be in the scanner tab
const scannerReplacement = `<tbody className="text-sm">
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

// We know the Kepatuhan tbody starts after `Status Akreditasi`
const kepatuhanHeader = /<th className="p-4 font-medium">Status Akreditasi<\/th>\s*<th className="p-4 font-medium">Aksi<\/th>\s*<\/tr>\s*<\/thead>\s*<tbody className="text-sm">[\s\S]*?<\/tbody>/;
if (content.match(kepatuhanHeader)) {
    content = content.replace(kepatuhanHeader, \`<th className="p-4 font-medium">Status Akreditasi</th>
                      <th className="p-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  \` + kepatuhanReplacement);
    console.log("Kepatuhan replaced successfully");
} else {
    console.log("Could not find Kepatuhan table.");
}

// We know the Scanner tbody starts after `Status Match` in `Terminal 3 Ultimate - Soekarno Hatta`
const scannerHeader = /<th className="p-4 font-medium">No\. Porsi \/ KTP<\/th>\s*<th className="p-4 font-medium">Status Match<\/th>\s*<\/tr>\s*<\/thead>\s*<tbody className="text-sm">[\s\S]*?<\/tbody>/;
if (content.match(scannerHeader)) {
    content = content.replace(scannerHeader, \`<th className="p-4 font-medium">No. Porsi / KTP</th>
                        <th className="p-4 font-medium">Status Match</th>
                      </tr>
                    </thead>
                    \` + scannerReplacement);
    console.log("Scanner replaced successfully");
} else {
    console.log("Could not find Scanner table.");
}

fs.writeFileSync(p, content, 'utf8');
