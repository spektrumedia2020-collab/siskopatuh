const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const tabMarker = `{activeTab === 'scanner' && (`;

if (content.includes(tabMarker)) {
  const indexScanner = content.indexOf(tabMarker);
  
  // Find the table inside this section
  const tableStartMarker = `<div className="overflow-x-auto">`;
  const tableEndMarker = `                  </div>`;
  
  const indexStart = content.indexOf(tableStartMarker, indexScanner);
  if (indexStart !== -1) {
     const indexEnd = content.indexOf(tableEndMarker, indexStart) + tableEndMarker.length;
     const originalTable = content.substring(indexStart, indexEnd);
     
     const newTable = `<div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                          <th className="p-4 font-medium">Calon Jemaah</th>
                          <th className="p-4 font-medium">Penyelenggara & Paket</th>
                          <th className="p-4 font-medium">Pesawat</th>
                          <th className="p-4 font-medium text-center">Keberangkatan</th>
                          <th className="p-4 font-medium text-center">Kepulangan</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                        {mobileScans.length > 0 ? Object.values(mobileScans.reduce((acc, scan) => {
                          const jemaahName = scan.rawData?.includes(':') ? scan.rawData.split(':')[2] : (scan.scannedData || scan.rawData || 'Jemaah');
                          const noPorsi = scan.rawData?.includes(':') ? scan.rawData.split(':')[1] : (scan.scannedData || scan.rawData || '-');
                          // Asumsi: Jika belum ada field 'jenis', kita anggap Keberangkatan dulu.
                          const jenis = scan.jenis || 'Keberangkatan'; 
                          
                          if (!acc[noPorsi]) {
                            acc[noPorsi] = {
                              id: scan.id,
                              noPorsi,
                              jemaahName,
                              penyelenggara: scan.penyelenggara || 'PT. Khazzanah Al-Anshary',
                              paket: scan.paket || 'Paket VIP Ramadhan',
                              pesawat: scan.pesawat || 'Garuda Indonesia (GA-980)',
                              keberangkatan: null,
                              kepulangan: null
                            };
                          }
                          
                          const timeStr = scan.timestamp?.seconds ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : (typeof scan.timestamp === 'string' ? new Date(scan.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}));
                          
                          if (jenis === 'Keberangkatan' && !acc[noPorsi].keberangkatan) {
                             acc[noPorsi].keberangkatan = timeStr;
                          } else if (jenis === 'Kepulangan' && !acc[noPorsi].kepulangan) {
                             acc[noPorsi].kepulangan = timeStr;
                          }
                          
                          return acc;
                        }, {} as Record<string, any>)).map((jemaah: any, i) => (
                          <tr key={jemaah.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                               <p className="font-bold text-slate-300">{jemaah.jemaahName}</p>
                               <p className="text-xs text-slate-500 font-mono mt-0.5">Porsi: {jemaah.noPorsi}</p>
                            </td>
                            <td className="p-4">
                               <p className="font-bold text-emerald-400 text-xs">{jemaah.penyelenggara}</p>
                               <p className="text-xs text-slate-400 mt-0.5">{jemaah.paket}</p>
                            </td>
                            <td className="p-4">
                               <div className="flex items-center gap-2">
                                  <PlaneTakeoff className="w-4 h-4 text-slate-400" />
                                  <span className="text-xs text-slate-300">{jemaah.pesawat}</span>
                               </div>
                            </td>
                            <td className="p-4 text-center">
                               {jemaah.keberangkatan ? (
                                  <div className="flex flex-col items-center">
                                    <span className="px-2.5 py-1 bg-blue-950/50 text-blue-400 border border-blue-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
                                      <CheckCircle2 className="w-3 h-3"/> Berangkat
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{jemaah.keberangkatan}</span>
                                  </div>
                               ) : (
                                  <span className="text-xs text-slate-600 italic">Menunggu...</span>
                               )}
                            </td>
                            <td className="p-4 text-center">
                               {jemaah.kepulangan ? (
                                  <div className="flex flex-col items-center">
                                    <span className="px-2.5 py-1 bg-emerald-950/50 text-emerald-400 border border-emerald-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
                                      <CheckCircle2 className="w-3 h-3"/> Tiba
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{jjemaah.kepulangan}</span>
                                  </div>
                               ) : (
                                  <span className="text-xs text-slate-600 italic">Belum Kembali</span>
                               )}
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Belum ada jemaah yang terpindai.</td></tr>
                        )}
                    </tbody>
                  </table>
                  </div>`;
                  
      content = content.replace(originalTable, newTable);
      fs.writeFileSync(dashboardPath, content, 'utf8');
      console.log("Scanner table patched specifically!");
  } else {
     console.log("Could not find table inside Scanner tab.");
  }
} else {
  console.log("Scanner tab marker not found.");
}
