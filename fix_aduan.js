import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const targetStart = "{activeTab === 'aduan' && (";
const targetEnd = "{activeTab === 'registrasi' && (";

if (!content.includes(targetStart) || !content.includes(targetEnd)) {
    console.error("Targets not found");
    process.exit(1);
}

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

const head = content.substring(0, startIndex);
const tail = content.substring(endIndex);

const newMid = `{activeTab === 'aduan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-4 h-4" /> Rekap Aduan Jemaah
              </h3>
              <p className="text-sm text-slate-400 mt-1">Daftar Laporan Penelantaran dan Komplain dari Jemaah</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-4">
            <button
              onClick={() => setAduanSubTab('rekap')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${aduanSubTab === 'rekap' ? 'bg-slate-900 text-emerald-400' : 'text-emerald-500 hover:bg-slate-900/50'}\`}
            >
              Rekap Pengaduan
            </button>
            <button
              onClick={() => setAduanSubTab('haji')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${aduanSubTab === 'haji' ? 'bg-slate-900 text-emerald-400' : 'text-emerald-500 hover:bg-slate-900/50'}\`}
            >
              Haji Khusus
            </button>
            <button
              onClick={() => setAduanSubTab('umrah')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${aduanSubTab === 'umrah' ? 'bg-slate-900 text-emerald-400' : 'text-emerald-500 hover:bg-slate-900/50'}\`}
            >
              Umrah
            </button>
            <button
              onClick={() => setAduanSubTab('bareskrim')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \${aduanSubTab === 'bareskrim' ? 'bg-rose-950/50 text-rose-400' : 'text-rose-500 hover:bg-rose-950/30'}\`}
            >
              Diserahkan ke Bareskrim
            </button>
          </div>

          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-0 overflow-x-auto">
               {aduanSubTab === 'rekap' && (
                 <table className="w-full text-left border-collapse min-w-[600px]">
                   <thead>
                     <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950">
                       <th className="p-5">Keterangan</th>
                       <th className="p-5">Haji Khusus</th>
                       <th className="p-5">Umrah</th>
                       <th className="p-5">Total</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {rekapPengaduan.map((row, idx) => (
                       <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                         <td className="p-5 font-bold text-slate-200">{row.keterangan}</td>
                         <td className="p-5 text-slate-300">{row.hajiKhusus}</td>
                         <td className="p-5 text-slate-300">{row.umrah}</td>
                         <td className="p-5 font-bold text-emerald-400">{row.total}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}

               {aduanSubTab === 'haji' && (
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950">
                       <th className="p-5 w-48">No. Reg<br/><span className="text-[9px] text-slate-500">Tanggal Terima</span></th>
                       <th className="p-5">PIHK</th>
                       <th className="p-5">Perihal</th>
                       <th className="p-5 text-center">Progress</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {aduanHajiKhusus.map((aduan, idx) => (
                       <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                         <td className="p-5">
                           <p className="font-mono text-[11px] font-bold text-slate-300">{aduan.reg}</p>
                           <p className="text-[10px] text-slate-500 mt-1">{aduan.tanggal}</p>
                         </td>
                         <td className="p-5 font-bold text-amber-500 text-xs">{aduan.pihk}</td>
                         <td className="p-5 text-xs text-slate-400 leading-relaxed max-w-sm">{aduan.perihal}</td>
                         <td className="p-5 text-center">
                           <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold whitespace-nowrap">{aduan.progress}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}

               {aduanSubTab === 'umrah' && (
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950">
                       <th className="p-5 w-48">No. Reg<br/><span className="text-[9px] text-slate-500">Tanggal Terima</span></th>
                       <th className="p-5">PPIU</th>
                       <th className="p-5">Perihal</th>
                       <th className="p-5 text-center">Progress</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {aduanUmrah.map((aduan, idx) => (
                       <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                         <td className="p-5">
                           <p className="font-mono text-[11px] font-bold text-slate-300">{aduan.reg}</p>
                           <p className="text-[10px] text-slate-500 mt-1">{aduan.tanggal}</p>
                         </td>
                         <td className="p-5 font-bold text-emerald-400 text-xs">{aduan.ppiu}</td>
                         <td className="p-5 text-xs text-slate-400 leading-relaxed max-w-sm">{aduan.perihal}</td>
                         <td className="p-5 text-center">
                           <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold whitespace-nowrap">{aduan.progress}</span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}

               {aduanSubTab === 'bareskrim' && (
                 <table className="w-full text-left border-collapse min-w-[800px]">
                   <thead>
                     <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-950">
                       <th className="p-5 w-48">No. Reg<br/><span className="text-[9px] text-slate-500">Tanggal Terima</span></th>
                       <th className="p-5">PIHK/PPIU</th>
                       <th className="p-5">Kategori</th>
                       <th className="p-5">Perihal</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {aduanBareskrim.map((aduan, idx) => (
                       <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                         <td className="p-5">
                           <p className="font-mono text-[11px] font-bold text-rose-400">{aduan.reg}</p>
                           <p className="text-[10px] text-slate-500 mt-1">{aduan.tanggal}</p>
                         </td>
                         <td className="p-5 font-bold text-slate-200 text-xs">{aduan.pihk}</td>
                         <td className="p-5"><span className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-bold">{aduan.kategori}</span></td>
                         <td className="p-5 text-xs text-slate-400 leading-relaxed max-w-md">{aduan.perihal}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               )}

             </CardContent>
          </Card>
        </div>
      )}

      `;

writeFileSync(file, head + newMid + tail);
console.log("Restored Aduan correctly");
