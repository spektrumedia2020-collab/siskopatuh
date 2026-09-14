const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/PublicLanding.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `{/* System Status Banner */}
      <LiveSystemStatus />`;

const replacementStr = `{/* Kewajiban PPIU PIHK Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
         <div className="p-4 bg-emerald-950/50 rounded-full border border-emerald-500/30 shrink-0 relative z-10">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
         </div>
         <div className="flex-1 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide">Kewajiban PPIU dan PIHK</h2>
            <p className="text-emerald-100/90 text-sm md:text-base font-medium mb-4">Laporkan Keberangkatan dan Kepulangan Jemaah Umrah & Haji Khusus Paling Lambat 1x24 Jam.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                  <div className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Sanksi Bertahap</div>
                  <div className="text-xs text-slate-300">1. Teguran Tertulis <br/> 2. Denda Administratif <br/> 3. Pembekuan Izin (Blokir SISKOPATUH) <br/> 4. Pencabutan Izin Usaha</div>
               </div>
               <div className="bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                  <div className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2"><MapPin className="w-4 h-4"/> Data Wajib</div>
                  <div className="text-xs text-slate-300">Identitas Jemaah, Nomor Paspor, Visa, Rute & Tanggal, Maskapai, dan Akomodasi/Hotel.</div>
               </div>
            </div>
         </div>
      </div>

      {/* System Status Banner */}
      <LiveSystemStatus />`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(p, content, 'utf8');
