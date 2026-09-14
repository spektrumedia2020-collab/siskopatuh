import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const targetStart = "{activeTab === 'operasional' && (";
const targetEnd = "{activeTab === 'aduan' && (";

if (!content.includes(targetStart) || !content.includes(targetEnd)) {
    console.error("Targets not found");
    process.exit(1);
}

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

const head = content.substring(0, startIndex);
const tail = content.substring(endIndex);

const newMid = `{activeTab === 'operasional' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ActivitySquare className="w-4 h-4" /> Radar Kesiapan Operasional
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan Metrik Maskapai & Akomodasi</p>
            </div>
          </div>
          
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
               <div>
                 <CardTitle className="text-slate-200 uppercase tracking-wider text-xs font-bold flex items-center gap-2">
                   <ActivitySquare className="w-4 h-4 text-emerald-500" />
                   RADAR KESIAPAN OPERASIONAL
                 </CardTitle>
               </div>
               <div className="flex items-center gap-4">
                 <select 
                   value={filterOperasionalPenyelenggara}
                   onChange={(e) => setFilterOperasionalPenyelenggara(e.target.value)}
                   className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                 >
                   <option value="Semua Penyelenggara">Semua Penyelenggara</option>
                   {uniquePenyelenggara.map((nama) => (
                     <option key={nama} value={nama}>{nama}</option>
                   ))}
                 </select>
                 <span className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-bold whitespace-nowrap">
                   {filteredOperasional.length} Paket Layanan Dipantau
                 </span>
               </div>
             </CardHeader>
             <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950">
                      <th className="p-5">Nama Travel / Paket</th>
                      <th className="p-5">Status Visa</th>
                      <th className="p-5">Status Tiket (PNR)</th>
                      <th className="p-5">Kesiapan Hotel</th>
                      <th className="p-5 text-center">Indikator</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredOperasional.map((pkg, idx) => {
                       const visa = pkg.statusVisa || "Belum Diajukan";
                       const tiket = pkg.statusTiket || "Belum Issued";
                       const hotel = pkg.statusHotel || "Belum Booking";
                       
                       const getVisaColor = (v) => {
                         if (v.includes("Terbit Seluruhnya")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (v.includes("Sebagian") || v.includes("Proses")) return "bg-amber-950/50 text-amber-500 border-amber-900/50";
                         return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                       };
                       const getTiketColor = (t) => {
                         if (t.includes("Issued") && !t.includes("Belum")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (t.includes("Menunggu") || t.includes("Proses")) return "bg-amber-950/50 text-amber-500 border-amber-900/50";
                         return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                       };
                       const getHotelColor = (h) => {
                         if (h.includes("Confirmed") || h.includes("Lunas")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (h.includes("DP") || h.includes("Proses")) return "bg-amber-950/50 text-amber-500 border-amber-900/50";
                         return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                       };
                       
                       const visaScore = getVisaColor(visa).includes("emerald") ? 2 : getVisaColor(visa).includes("amber") ? 1 : 0;
                       const tiketScore = getTiketColor(tiket).includes("emerald") ? 2 : getTiketColor(tiket).includes("amber") ? 1 : 0;
                       const hotelScore = getHotelColor(hotel).includes("emerald") ? 2 : getHotelColor(hotel).includes("amber") ? 1 : 0;
                       const totalScore = visaScore + tiketScore + hotelScore;
                       
                       let indicatorColor = "bg-rose-500";
                       if (totalScore >= 5) indicatorColor = "bg-emerald-500";
                       else if (totalScore >= 2) indicatorColor = "bg-amber-500";

                       return (
                         <tr key={pkg.id || idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                           <td className="p-5">
                             <p className="font-bold text-slate-200">{pkg.name || "Paket Umroh"}</p>
                             <p className="text-[11px] text-slate-500 mt-1 font-medium">{pkg.pihkName || "PT Penyelenggara"}</p>
                           </td>
                           <td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getVisaColor(visa)}\`}>
                               {visa}
                             </span>
                           </td>
                           <td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getTiketColor(tiket)}\`}>
                               {tiket}
                             </span>
                           </td>
                           <td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getHotelColor(hotel)}\`}>
                               {hotel}
                             </span>
                           </td>
                           <td className="p-5 text-center">
                             <div className={\`w-2.5 h-2.5 rounded-full mx-auto shadow-sm \${indicatorColor} \${indicatorColor === 'bg-amber-500' ? 'shadow-amber-500/50' : indicatorColor === 'bg-emerald-500' ? 'shadow-emerald-500/50' : 'shadow-rose-500/50'}\`}></div>
                           </td>
                         </tr>
                       );
                    })}
                    {filteredOperasional.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          Tidak ada paket operasional yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </CardContent>
          </Card>
        </div>
      )}

      `;

writeFileSync(file, head + newMid + tail);
console.log("Restored operasional correctly");
