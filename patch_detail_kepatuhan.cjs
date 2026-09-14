const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// 1. Change the button onClick
const buttonTarget = `onClick={() => setToastMessage({title: 'Detail Kepatuhan', desc: \`Menampilkan riwayat audit untuk \${item.name}\`, type: 'info'})}`;
if (content.includes(buttonTarget)) {
  content = content.replace(buttonTarget, `onClick={() => setSelectedKepatuhan(item)}`);
  console.log("Button patched.");
}

// 2. Add the modal before the final closing div/section.
// I'll insert it right before the final `</div>\n    </div>\n  );\n}` or just before the `return` ... Wait, we can insert it at the end of the returned JSX, right before the last closing `</div>` (the main wrapper).

const findLastClosingDiv = (str) => {
  const marker = "    </div>\n  );\n}";
  if (str.includes(marker)) {
    return str.lastIndexOf(marker);
  }
  return -1;
};

const modalUI = `
      {/* Modal Detail Kepatuhan */}
      {selectedKepatuhan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Detail Kepatuhan & Riwayat Audit
              </h3>
              <button onClick={() => setSelectedKepatuhan(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
               <div className="mb-6">
                  <h4 className="text-xl font-bold text-slate-200 mb-1">{selectedKepatuhan.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {selectedKepatuhan.type || 'PPIU'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedKepatuhan.wilayahOperasional}</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Skor Audit Terakhir</p>
                     <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-200">{selectedKepatuhan.skorAudit}</span>
                        <span className="text-slate-500 mb-1">/ 100</span>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Status Risiko</p>
                     <span className={\`px-3 py-1 text-xs font-bold rounded border \${
                        selectedKepatuhan.tingkatPelanggaran === 'Rendah' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' :
                        selectedKepatuhan.tingkatPelanggaran === 'Sedang' ? 'text-blue-400 bg-blue-950/40 border-blue-900/50' :
                        selectedKepatuhan.tingkatPelanggaran === 'Tinggi' ? 'text-amber-400 bg-amber-950/40 border-amber-900/50' :
                        'text-rose-400 bg-rose-950/40 border-rose-900/50'
                     }\`}>
                       {selectedKepatuhan.tingkatPelanggaran}
                     </span>
                  </div>
               </div>

               <div>
                 <h4 className="font-bold text-sm text-slate-300 mb-3 uppercase tracking-wider">Catatan Pelanggaran & Temuan</h4>
                 <div className="space-y-3">
                   {selectedKepatuhan.tingkatPelanggaran === 'Kritis' && (
                      <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-rose-200">Indikasi Gagal Berangkat (EWS Terpicu)</p>
                           <p className="text-xs text-rose-300/80 mt-1">Ditemukan lebih dari 50 jemaah yang melewati batas SLA keberangkatan (delay > 3x24 jam). Direkomendasikan pembekuan sementara.</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: {new Date().toLocaleDateString('id-ID')}</p>
                         </div>
                      </div>
                   )}
                   {selectedKepatuhan.tingkatPelanggaran === 'Tinggi' && (
                      <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-amber-200">Pelanggaran Standar Pelayanan (SPM)</p>
                           <p className="text-xs text-amber-300/80 mt-1">Ditemukan penurunan kelas hotel sepihak tanpa pemberitahuan kepada jemaah pada paket keberangkatan bulan lalu.</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: 12 Hari Lalu</p>
                         </div>
                      </div>
                   )}
                   {(selectedKepatuhan.tingkatPelanggaran === 'Sedang' || selectedKepatuhan.tingkatPelanggaran === 'Rendah') && (
                      <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg flex items-start gap-3">
                         <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-blue-200">Temuan Administratif Ringan</p>
                           <p className="text-xs text-blue-300/80 mt-1">Keterlambatan pelaporan data manifest jemaah ke dalam Siskopatuh (delay 1-2 hari dari ketentuan).</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: Bulan Lalu</p>
                         </div>
                      </div>
                   )}
                   
                   <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-start gap-3 opacity-70">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-sm font-bold text-slate-300">Audit Reguler Selesai</p>
                         <p className="text-xs text-slate-400 mt-1">Penyelenggara telah menyelesaikan audit tahunan dengan dokumen finansial tervalidasi.</p>
                         <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: 6 Bulan Lalu</p>
                       </div>
                   </div>
                 </div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
               <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => setSelectedKepatuhan(null)}>Tutup</Button>
               {(selectedKepatuhan.tingkatPelanggaran === 'Tinggi' || selectedKepatuhan.tingkatPelanggaran === 'Kritis') && (
                 <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold"><ShieldAlert className="w-4 h-4 mr-2"/> Beri Sanksi Pembekuan</Button>
               )}
            </div>
          </div>
        </div>
      )}
`;

const insertIndex = findLastClosingDiv(content);
if (insertIndex !== -1) {
  content = content.slice(0, insertIndex) + modalUI + '\n' + content.slice(insertIndex);
  console.log("Modal UI added.");
} else {
  console.log("Could not find insertion point for modal UI.");
  // try fallback: before the very last `}`
  const fallbackIndex = content.lastIndexOf("}");
  if (fallbackIndex !== -1) {
    // but we need it inside the return statement's main div.
    // Let's just find the end of the return statement
    const lastDiv = content.lastIndexOf("</div>");
    if (lastDiv !== -1) {
      content = content.slice(0, lastDiv) + modalUI + '\n' + content.slice(lastDiv);
      console.log("Modal UI added using fallback.");
    }
  }
}

fs.writeFileSync(dashboardPath, content, 'utf8');
