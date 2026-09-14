const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// The bad chunk starts at line 1018 and ends somewhere before the next `</td>` or something.
// Let's replace the whole bad chunk back to the correct string.
const badStart = `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                          <th className="p-4 font-medium">Calon Jemaah</th>`;

const badEnd = `</td>
                            <td className="p-4 text-center font-bold text-slate-300">
                              {item.skorAudit} <span className="text-slate-500 font-normal">/ 100</span>`;

if (content.includes(badStart) && content.includes(badEnd)) {
   const indexStart = content.indexOf(badStart);
   const indexEnd = content.indexOf(badEnd) + badEnd.length;
   
   const originalReplacement = `<div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800/50 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900/30">
                        <th className="p-4 font-bold">NAMA ENTITAS</th>
                        <th className="p-4 font-bold">JENIS IZIN</th>
                        <th className="p-4 font-bold text-center">WILAYAH</th>
                        <th className="p-4 font-bold text-center">PELANGGARAN</th>
                        <th className="p-4 font-bold text-center">STATUS</th>
                        <th className="p-4 font-bold text-center">SKOR</th>
                        <th className="p-4 font-bold text-center">TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredKepatuhanData.map((item, idx) => {
                        const getPelanggaranStyle = (tingkat: string) => {
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
                              {item.skorAudit} <span className="text-slate-500 font-normal">/ 100</span>`;
                              
    content = content.substring(0, indexStart) + originalReplacement + content.substring(indexEnd);
    fs.writeFileSync(dashboardPath, content, 'utf8');
    console.log("Kepatuhan table restored successfully!");
} else {
    console.log("Failed to restore Kepatuhan table.");
}
