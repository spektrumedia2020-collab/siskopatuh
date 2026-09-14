const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

let ewsCode = "";
let operasionalCode = "";
let aduanCode = "";
let registrasiCode = "";
let scannerCode = "";

// Read from restore_tabs.js
const restoreContent = fs.readFileSync('restore_tabs.js', 'utf8');
const opStart = restoreContent.indexOf("{activeTab === 'operasional'");
const regEnd = restoreContent.indexOf("}`;", opStart);
if (opStart > -1 && regEnd > -1) {
  const tabsString = restoreContent.substring(opStart, regEnd);
  operasionalCode = "{activeTab === 'operasional'" + tabsString.split("{activeTab === 'aduan'")[0].substring(28);
  aduanCode = "{activeTab === 'aduan'" + tabsString.split("{activeTab === 'aduan'")[1].split("{activeTab === 'registrasi'")[0];
  registrasiCode = "{activeTab === 'registrasi'" + tabsString.split("{activeTab === 'registrasi'")[1];
}

// Generate EWS based on patch_admin_ews.cjs if possible, or just a placeholder
ewsCode = `      {activeTab === 'ews' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Early Warning System (EWS)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Deteksi Dini Keterlambatan dan Anomali</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-slate-200">Peringatan Sistem</CardTitle>
             </CardHeader>
             <CardContent className="pt-4">
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/30 flex items-center justify-center mb-4 border border-emerald-900/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <p className="font-bold text-slate-300 text-sm">Aman</p>
                  <p className="text-xs mt-2 text-slate-400">Tidak ada peringatan aktif saat ini.</p>
                </div>
             </CardContent>
          </Card>
        </div>
      )}`;

// Generate Scanner based on patch_scanner.cjs
scannerCode = `      {activeTab === 'scanner' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> Visibilitas Operator Lapangan
              </h3>
              <p className="text-sm text-slate-400 mt-1">Live Feed dari Aplikasi Mobile Petugas</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-sm theme-title flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SmartphoneNfc className="w-5 h-5 text-emerald-500" /> Scanner Aktif
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                        <th className="p-4 font-medium">Waktu</th>
                        <th className="p-4 font-medium">Jemaah</th>
                        <th className="p-4 font-medium">No. Porsi / KTP</th>
                        <th className="p-4 font-medium">Status Match</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
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
                  </tbody>
               </table>
            </CardContent>
          </Card>
        </div>
      )}`;

// Assemble all
const allMissing = `
${ewsCode}
${operasionalCode}
${aduanCode}
${registrasiCode}
${scannerCode}
`;

// Insert before ledger
const ledgerTarget = "{activeTab === 'ledger' && (";
if (content.indexOf(ledgerTarget) > -1 && content.indexOf("{activeTab === 'scanner'") === -1) {
  content = content.replace(ledgerTarget, allMissing + "\n      " + ledgerTarget);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Injected all missing tabs successfully.");
} else {
  console.log("Could not find ledger or tabs already exist.");
}
