import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const ewsStart = content.indexOf("{activeTab === 'ews' && (");
const operasionalStart = content.indexOf("{activeTab === 'operasional' && (");

const head = content.substring(0, ewsStart);
const tail = content.substring(operasionalStart);

const newMid = `{activeTab === 'ews' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Early Warning System (EWS)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Sinyal Peringatan Dini & Status Darurat Jemaah</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-slate-200">Log Peringatan Dini</CardTitle>
               <CardDescription>Riwayat sinyal anomali operasional dari travel.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <div className="p-8 text-center text-slate-500">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Tidak ada log peringatan dini lainnya saat ini.</p>
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Kepatuhan Detail */}
      {selectedKepatuhan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold theme-title mb-1">{selectedKepatuhan.name}</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">{selectedKepatuhan.type}</span>
                  <span className={\`px-2 py-0.5 rounded text-[10px] font-bold \${selectedKepatuhan.status === 'Tervalidasi' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-900' : 'bg-amber-900/30 text-amber-400 border border-amber-900'}\`}>
                    {selectedKepatuhan.status || 'Menunggu'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedKepatuhan(null)} className="opacity-60 hover:opacity-100 transition-opacity transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Skor Audit Kepatuhan</p>
                  <span className={\`text-2xl font-bold \${selectedKepatuhan.skor < 80 ? 'text-rose-400' : 'text-emerald-400'}\`}>{selectedKepatuhan.skor}</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tingkat Risiko</p>
                  <span className={\`text-sm font-bold \${selectedKepatuhan.skor < 80 ? 'text-rose-400' : 'text-emerald-400'}\`}>{selectedKepatuhan.skor < 80 ? 'Tinggi' : 'Rendah'}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
               <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setSelectedKepatuhan(null)}>Tutup</Button>
               {selectedKepatuhan.skor < 80 && (
                 <>
                   <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-900/30" onClick={() => {
                     setToastMessage({title: 'Tindak Lanjut', desc: 'Pembinaan dan teguran tertulis telah dicatat.', type: 'aduan'});
                     recordAdminLog(\`Memberikan sanksi Teguran Tertulis kepada PPIU/PIHK terkait audit kepatuhan.\`);
                   }}>Teguran Tertulis</Button>
                   <Button className="bg-rose-600 hover:bg-rose-500 font-bold text-white" onClick={() => {
                     setSelectedKepatuhan(null);
                     setToastMessage({title: 'Tindak Lanjut', desc: 'Akses diblokir sementara.', type: 'aduan'});
                     recordAdminLog(\`Melakukan pemblokiran akses sementara SISKOPATUHV2.\`);
                   }}>Blokir Akses</Button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}

      `;

content = head + newMid + tail;

// Also I noticed in `fix_mess.js` the JSX element `div` error:
// `src/pages/admin/Dashboard.tsx(529,6): error TS17008: JSX element 'div' has no corresponding closing tag.`
// Let's ensure the main `return (` has the matching `</div>` at the very end.
// At the end of file:
// `</div>\n  );\n}`
// Wait, my newMid doesn't break the global structure.
// But earlier in fix_mess.js, I replaced the top part of `return (`.
// Let's just fix it and run lint.

writeFileSync(file, content);
console.log("Restored mid section.");
