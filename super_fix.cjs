const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const kepatuhanEndIdx = content.indexOf("{activeTab === 'ews' && (\");");
const ledgerStartIdx = content.indexOf("{activeTab === 'ledger' && (");

if (kepatuhanEndIdx > -1 && ledgerStartIdx > -1) {
    const head = content.substring(0, kepatuhanEndIdx);
    const tail = content.substring(ledgerStartIdx);
    
    // We get operasional, aduan, registrasi from restore_tabs.js
    const restoreContent = fs.readFileSync('restore_tabs.js', 'utf8');
    const opStart = restoreContent.indexOf("{activeTab === 'operasional'");
    const regEnd = restoreContent.indexOf("}`;", opStart);
    let middleTabs = "";
    if (opStart > -1 && regEnd > -1) {
      middleTabs = restoreContent.substring(opStart, regEnd);
    }
    
    // We get EWS from patch_admin_ews.cjs (the replacement part)
    const ewsCode = `      {activeTab === 'ews' && (
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
          
          <Card className="bg-slate-900 border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)] overflow-hidden flex flex-col mt-6">
            <CardHeader className="border-b border-rose-900/30 pb-4 bg-slate-950/80">
              <CardTitle className="text-rose-400 flex justify-between items-center text-sm font-bold">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Daftar Jemaah Tunda Kepulangan (EWS)</span>
                <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold">{jemaahTunda.length} Jemaah Terdampak</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Daftar manifest jemaah yang terdeteksi tertunda kepulangannya dari Arab Saudi berdasarkan perbandingan jadwal manifest (SLA).</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[400px] bg-slate-900/50">
              {jemaahTunda.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Nama Jemaah & Porsi</th>
                        <th className="px-4 py-3">Travel Penyelenggara</th>
                        <th className="px-4 py-3">Paket & Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {jemaahTunda.map((jemaah, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-200">{jemaah.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Porsi: {jemaah.porsiNumber || jemaah.porsi || '-'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-amber-400">
                            {jemaah.penyelenggara}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs">{jemaah.paket}</div>
                            <div className="inline-flex mt-1 items-center gap-1 text-[9px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-900/50 font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Tunda Kepulangan
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" className="border-rose-900/50 text-rose-400 hover:bg-rose-900 hover:text-white h-7 text-[10px] font-bold" onClick={() => setToastMessage({title: 'Investigasi', desc: 'Permintaan investigasi ditambahkan.', type: 'aduan'})}>
                              Investigasi
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/30 flex items-center justify-center mb-4 border border-emerald-900/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <p className="font-bold text-slate-300 text-sm">Clear</p>
                  <p className="text-xs mt-2 text-slate-400">Tidak ada jemaah yang masuk dalam kategori Tunda Kepulangan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}`;
      
    const scannerCode = `      {activeTab === 'scanner' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> Visibilitas Operator Lapangan (Mobile Sync)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Live Feed dari Aplikasi Mobile Petugas Lapangan di Bandara / Makkah.</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm theme-title flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SmartphoneNfc className="w-5 h-5 text-emerald-500" /> Status Mobile
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
                      <span className="text-slate-400">Latensi Sync</span>
                      <span className="text-emerald-400 font-mono">42ms</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Titik Pantau Aktif</span>
                      <span className="text-slate-300 font-bold text-right">CGK Terminal 3<br/>Bandara Kertajati</span>
                    </div>
                  </div>
                  
                  <table className="w-full text-left border-collapse mt-4">
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
                  
                  <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white mt-6" onClick={() => {
                    setToastMessage({title: 'Ping dari Mobile App!', desc: 'Petugas lapangan Budi_CGK baru saja menscan jemaah a.n Zahar Djalle.', type: 'success'});
                  }}>
                    <SmartphoneNfc className="w-4 h-4 mr-2" /> Simulasi Ping dari Mobile
                  </Button>
                </CardContent>
          </Card>
        </div>
      )}`;
      
    let assembled = head + "\n" + ewsCode + "\n" + middleTabs + "\n" + scannerCode + "\n      " + tail;
    
    // Fix Audit buttons in kepatuhan tab
    assembled = assembled.replace(/<Button size="sm" variant="outline" className="h-7 text-\[10px\]"[^>]*>Audit<\/Button>/g, '<Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setToastMessage({title: \'Investigasi Audit\', desc: \'Permintaan audit kepatuhan telah diteruskan ke Inspektorat Jenderal Kemenag.\', type: \'aduan\'})}>Audit</Button>');
    
    fs.writeFileSync(p, assembled, 'utf8');
    console.log("Super fix applied successfully.");
} else {
    console.log("Could not find delimiters.");
}
