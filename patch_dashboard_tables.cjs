const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// 1. Add the import statement
if (!content.includes('import { aduanHajiKhusus, aduanUmrah, aduanBareskrim }')) {
  const importStatement = "import { aduanHajiKhusus, aduanUmrah, aduanBareskrim } from '../../data/aduanData';\n";
  const firstImportMatch = content.match(/^import /m);
  if (firstImportMatch) {
    const insertIndex = firstImportMatch.index;
    content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
  } else {
    content = importStatement + content;
  }
}

// 2. Replace the Haji Khusus table body
const hkStart = `{aduanSubTab === 'haji_khusus' && (`;
const umrahStart = `{aduanSubTab === 'umrah' && (`;
const bareskrimStart = `{aduanSubTab === 'bareskrim' && (`;
const ewsStart = `{activeTab === 'ews' && (`;

if (content.includes(hkStart) && content.includes(ewsStart)) {
  const beforeHK = content.substring(0, content.indexOf(hkStart));
  const afterEWS = content.substring(content.indexOf(ewsStart));

  const newUI = `{aduanSubTab === 'haji_khusus' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanHajiKhusus.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{item.pihk}</td>
                          <td className="px-6 py-4 text-slate-300 text-xs">{item.perihal}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={\`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center inline-flex items-center justify-center \${item.progress.toLowerCase().includes('klarifikasi') ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}\`}>
                              {item.progress}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'umrah' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PPIU (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanUmrah.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{item.ppiu}</td>
                          <td className="px-6 py-4 text-slate-300 text-xs">{item.perihal}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={\`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center inline-flex items-center justify-center \${item.progress.toLowerCase().includes('klarifikasi') ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}\`}>
                              {item.progress}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'bareskrim' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK / PPIU (TERLAPOR)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">KAT</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-1/2">TINDAK LANJUT / STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanBareskrim.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-rose-400">{item.entitas}</td>
                          <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">{item.kategori}</span></td>
                          <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani {item.perihal.includes('Polda') ? 'Polda' : 'Bareskrim POLRI'}</span><br/><span className="text-slate-400">{item.perihal}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}
                  
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      `;
  
  fs.writeFileSync(dashboardPath, beforeHK + newUI + afterEWS, 'utf8');
  console.log("Patched completely.");
} else {
  console.log("Could not find the target sections.");
}
