const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const uiStart = "{activeTab === 'kepatuhan' && (";
const uiEnd = "{activeTab === 'registrasi' && (";

if (content.includes(uiStart) && content.includes(uiEnd)) {
  const before = content.substring(0, content.indexOf(uiStart));
  const after = content.substring(content.indexOf(uiEnd));
  
  const newUI = `{activeTab === 'kepatuhan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in h-full">
          <Card className="bg-[#0b1120] border-slate-800/60 shadow-xl overflow-hidden mt-2">
            <CardHeader className="border-b border-slate-800/50 pb-4">
               <div className="flex justify-between items-center w-full">
                 <CardTitle className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> KEPATUHAN PENYELENGGARA
                 </CardTitle>
                 
                 <div className="flex gap-3 items-center">
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors w-40"
                     value={filterWilayah}
                     onChange={(e) => setFilterWilayah(e.target.value)}
                   >
                     <option value="Semua Wilayah">Semua Wilayah</option>
                     {wilayahList.map(w => (
                       <option key={w} value={w}>{w}</option>
                     ))}
                   </select>
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors w-40"
                     value={filterPelanggaran}
                     onChange={(e) => setFilterPelanggaran(e.target.value)}
                   >
                     <option value="Semua Tingkat">Semua Tingkat</option>
                     {pelanggaranList.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f172a] border-b border-slate-800">
                      <tr>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider">NAMA ENTITAS</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider">JENIS IZIN</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider text-center">WILAYAH</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider text-center">PELANGGARAN</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider text-center">STATUS</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider text-center">SKOR</th>
                        <th className="p-4 font-bold text-slate-400 text-xs tracking-wider text-center">TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredDirektoriList.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada data yang sesuai filter</td></tr>
                      )}
                      {filteredDirektoriList.map((item, idx) => {
                        const getPelanggaranStyle = (tingkat) => {
                          if(tingkat === 'Rendah') return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
                          if(tingkat === 'Sedang') return 'text-blue-400 bg-blue-950/40 border-blue-900/50';
                          if(tingkat === 'Tinggi') return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
                          if(tingkat === 'Kritis') return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
                          return 'text-slate-400 bg-slate-900 border-slate-700';
                        };

                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{item.name}</p>
                            </td>
                            <td className="p-4 text-slate-400 font-medium">
                              {item.type || 'PPIU'}
                            </td>
                            <td className="p-4 text-slate-400 text-center font-medium">
                              {item.wilayahOperasional}
                            </td>
                            <td className="p-4 text-center">
                              <span className={\`px-3 py-1 text-xs font-bold rounded border \${getPelanggaranStyle(item.tingkatPelanggaran)}\`}>
                                {item.tingkatPelanggaran}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex flex-col justify-center items-center px-3 py-1 rounded bg-amber-950/30 border border-amber-900/40">
                                <span className="text-amber-500 text-[11px] font-bold leading-tight">Dalam</span>
                                <span className="text-amber-500 text-[11px] font-bold leading-tight">Pengawasan</span>
                              </div>
                            </td>
                            <td className="p-4 text-center font-bold text-slate-300">
                              {item.skorAudit} <span className="text-slate-500 font-normal">/ 100</span>
                            </td>
                            <td className="p-4 text-center">
                              <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">
                                Detail
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      `;
      
  content = before + newUI + after;
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched successfully!");
} else {
  console.log("Could not find UI block limits.");
}
