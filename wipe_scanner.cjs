const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const startIndex = content.indexOf("{activeTab === 'scanner' && (");
const endIndexMarker = "\n      {activeTab === 'ledger' && (";
const endIndex = content.indexOf(endIndexMarker);

if (startIndex !== -1 && endIndex !== -1) {
   const newScannerTab = `{activeTab === 'scanner' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> Visibilitas Operator Lapangan (Mobile Sync)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Status Perjalanan Jemaah dari Keberangkatan hingga Kepulangan.</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm theme-title flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SmartphoneNfc className="w-5 h-5 text-emerald-500" /> Status Pemantauan Mobile
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center shrink-0 border border-emerald-500/30">
                      <ScanLine className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white font-mono">18</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Petugas Mobile Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Koneksi API (WebSocket)</span>
                      <span className="text-emerald-400 font-bold">Terhubung</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Titik Pantau Aktif</span>
                      <span className="text-slate-300 font-bold text-right">CGK Terminal 3<br/>Bandara Kertajati</span>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
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
                          // Tentukan jenis dari data scan, default ke Keberangkatan jika tidak ada untuk fallback dummy
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
                                      <ArrowUpRight className="w-3 h-3"/> Berangkat
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
                                    <span className="px-2.5 py-1 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
                                      <ArrowDownRight className="w-3 h-3"/> Tiba
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{jemaah.kepulangan}</span>
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
                  </div>
                </CardContent>
          </Card>
        </div>
      )}
`;
   
   content = content.substring(0, startIndex) + newScannerTab + content.substring(endIndex);
   fs.writeFileSync(dashboardPath, content, 'utf8');
   console.log("Scanner completely replaced!");
} else {
   console.log("Could not find start or end index.");
}
