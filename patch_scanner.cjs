const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const tableStart = `<table className="w-full text-left border-collapse mt-4">`;
const tableEnd = `                  </table>`;

if (content.includes(tableStart) && content.includes(tableEnd)) {
  const indexStart = content.indexOf(tableStart);
  const indexEnd = content.indexOf(tableEnd, indexStart) + tableEnd.length;
  
  const originalTable = content.substring(indexStart, indexEnd);
  
  const newTable = `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                          <th className="p-4 font-medium">Waktu</th>
                          <th className="p-4 font-medium">Calon Jemaah</th>
                          <th className="p-4 font-medium">Penyelenggara & Paket</th>
                          <th className="p-4 font-medium">Pesawat</th>
                          <th className="p-4 font-medium text-center">Jenis Aktivitas</th>
                          <th className="p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                        {mobileScans.length > 0 ? mobileScans.map((scan, i) => {
                          const jemaahName = scan.rawData?.includes(':') ? scan.rawData.split(':')[2] : (scan.scannedData || scan.rawData || 'Jemaah');
                          const noPorsi = scan.rawData?.includes(':') ? scan.rawData.split(':')[1] : (scan.scannedData || scan.rawData || '-');
                          const isKeberangkatan = scan.jenis ? scan.jenis === 'Keberangkatan' : (i % 2 === 0);
                          const penyelenggara = scan.penyelenggara || 'PT. Khazzanah Al-Anshary';
                          const paket = scan.paket || 'Paket VIP Ramadhan 12 Hari';
                          const pesawat = scan.pesawat || 'Garuda Indonesia (GA-980)';
                          
                          return (
                          <tr key={scan.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 animate-in fade-in slide-in-from-top-2">
                            <td className="p-4 font-mono text-xs text-slate-400">
                              {scan.timestamp?.seconds ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString('id-ID') : 
                                (typeof scan.timestamp === 'string' ? new Date(scan.timestamp).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID'))}
                            </td>
                            <td className="p-4">
                               <p className="font-bold text-slate-300">{jemaahName}</p>
                               <p className="text-xs text-slate-500 font-mono mt-0.5">Porsi: {noPorsi}</p>
                            </td>
                            <td className="p-4">
                               <p className="font-bold text-emerald-400 text-xs">{penyelenggara}</p>
                               <p className="text-xs text-slate-400 mt-0.5">{paket}</p>
                            </td>
                            <td className="p-4">
                               <div className="flex items-center gap-2">
                                  <PlaneTakeoff className="w-3 h-3 text-slate-400" />
                                  <span className="text-xs text-slate-300">{pesawat}</span>
                               </div>
                            </td>
                            <td className="p-4 text-center">
                               {isKeberangkatan ? (
                                  <span className="px-2.5 py-1 bg-blue-950/50 text-blue-400 border border-blue-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5"><ArrowUpRight className="w-3 h-3"/> Keberangkatan</span>
                               ) : (
                                  <span className="px-2.5 py-1 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5"><ArrowDownRight className="w-3 h-3"/> Kepulangan</span>
                               )}
                            </td>
                            <td className="p-4">
                               <span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Match</span>
                            </td>
                          </tr>
                        )}) : (
                          <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">Belum ada data pindaian hari ini dari aplikasi mobile.</td></tr>
                        )}
                    </tbody>
                  </table>
                  </div>`;
  
  content = content.replace(originalTable, newTable);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Scanner table patched successfully.");
} else {
  console.log("Scanner table not found.");
}
