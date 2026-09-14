const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// Patch UI
const uiStart = "{activeTab === 'operasional' && (";
const uiEnd = `      )}

      {activeTab === 'aduan' && (`;

if (content.includes(uiStart) && content.includes(uiEnd)) {
  const before = content.substring(0, content.indexOf(uiStart));
  const after = content.substring(content.indexOf(uiEnd) + 9); // Keep the newline
  
  const newUI = `{activeTab === 'operasional' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <Card className="bg-[#0b1120] border-slate-800/60 shadow-xl overflow-hidden mt-2">
            <CardHeader className="border-b border-slate-800/50 pb-4">
               <div className="flex justify-between items-center w-full">
                 <CardTitle className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                   <ActivitySquare className="w-4 h-4" /> RADAR KESIAPAN OPERASIONAL
                 </CardTitle>
                 
                 <div className="flex gap-4 items-center">
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
                     value={filterOperasionalPenyelenggara}
                     onChange={(e) => setFilterOperasionalPenyelenggara(e.target.value)}
                   >
                     <option value="Semua Penyelenggara">Semua Penyelenggara</option>
                     {uniquePenyelenggara.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                   <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400">
                     {filteredOperasional.length} Paket Layanan Dipantau
                   </div>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f172a] border-b border-slate-800">
                      <tr>
                        <th className="p-4 font-bold text-slate-300 w-1/3">Nama Travel / Paket</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Status Visa</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Status Tiket (PNR)</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Kesiapan Hotel</th>
                        <th className="p-4 font-bold text-slate-300 text-center w-24">Indikator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredOperasional.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data paket layanan dipantau</td></tr>
                      )}
                      {filteredOperasional.map((pkg, idx) => {
                        const getVisaStyle = (status) => {
                          if(status?.includes('Terbit Seluruhnya')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('Sebagian')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          if(status?.includes('Proses')) return 'text-orange-400 border-orange-900 bg-orange-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        const getTiketStyle = (status) => {
                          if(status?.includes('Issued')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('Menunggu')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        const getHotelStyle = (status) => {
                          if(status?.includes('Lunas')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('DP')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        
                        let indicatorColor = 'bg-rose-500';
                        if (pkg.statusVisa?.includes('Terbit') && pkg.statusTiket?.includes('Issued') && pkg.statusHotel?.includes('Lunas')) {
                          indicatorColor = 'bg-emerald-500';
                        } else if (pkg.statusVisa?.includes('Proses') || pkg.statusVisa?.includes('Sebagian') || pkg.statusTiket?.includes('Menunggu') || pkg.statusHotel?.includes('DP')) {
                          indicatorColor = 'bg-amber-500';
                        }

                        return (
                        <tr key={pkg.id || idx} className="hover:bg-slate-800/20 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-200 text-[15px]">{pkg.name}</p>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{pkg.pihkName}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={\`px-3 py-1.5 text-[11px] font-medium rounded-full border \${getVisaStyle(pkg.statusVisa || 'Belum Diajukan')}\`}>
                              {pkg.statusVisa || 'Belum Diajukan'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={\`px-3 py-1.5 text-[11px] font-medium rounded-full border \${getTiketStyle(pkg.statusTiket || 'Belum Issued')}\`}>
                              {pkg.statusTiket || 'Belum Issued (SV-8832)'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={\`px-3 py-1.5 text-[11px] font-medium rounded-full border \${getHotelStyle(pkg.statusHotel || 'Belum Booking')}\`}>
                              {pkg.statusHotel || 'Belum Booking'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className={\`w-2.5 h-2.5 rounded-full mx-auto \${indicatorColor} shadow-[0_0_8px_currentColor]\`}></div>
                          </td>
                        </tr>
                        )})}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'aduan' && (`;
  
  content = before + newUI + after;
  
  // Now patch the mock data
  const hookStart = `  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snap) => {
      setOperasionalPackages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);`;
  
  const hookEnd = `  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        data = [
          { id: 'mock-1', name: 'Umroh Reguler 9 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Sebagian Terbit', statusTiket: 'Menunggu Pembayaran (GA-9921)', statusHotel: 'DP Dibayarkan' },
          { id: 'mock-2', name: 'Umroh Hemat 10 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Terbit Seluruhnya', statusTiket: 'Issued (JT-3341)', statusHotel: 'Confirmed / Lunas' },
          { id: 'mock-3', name: 'Umroh Plus Turki 12 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Proses Kedutaan', statusTiket: 'Issued (TK-4022)', statusHotel: 'DP Dibayarkan' },
          { id: 'mock-4', name: 'Umroh Ramadhan VIP', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Belum Diajukan', statusTiket: 'Belum Issued (SV-8832)', statusHotel: 'Belum Booking' }
        ];
      }
      setOperasionalPackages(data);
    });
    return () => unsub();
  }, []);`;
  
  if (content.includes(hookStart)) {
    content = content.replace(hookStart, hookEnd);
    fs.writeFileSync(dashboardPath, content, 'utf8');
    console.log("Patched successfully!");
  } else {
    console.log("Could not find useEffect for packages!");
  }
} else {
  console.log("Could not find UI block limits.");
}
