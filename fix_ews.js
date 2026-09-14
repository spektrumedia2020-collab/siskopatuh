import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const targetStart = "{activeTab === 'ews' && (";
const targetEnd = "{/* Modal Kepatuhan Detail */}";

if (!content.includes(targetStart) || !content.includes(targetEnd)) {
    console.error("Targets not found");
    process.exit(1);
}

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

const head = content.substring(0, startIndex);
const tail = content.substring(endIndex);

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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kolom SOS Alerts */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden flex flex-col h-[550px]">
               <CardHeader className="border-b border-slate-800 pb-4 bg-slate-950/80">
                 <CardTitle className="text-slate-200 flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse"/> SOS Jemaah Aktif</span>
                   <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold">{sosAlerts?.length || 0} Sinyal</span>
                 </CardTitle>
                 <CardDescription className="text-xs">Panggilan darurat real-time dari Jemaah di lapangan.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 overflow-y-auto flex-grow bg-slate-900/50">
                 {sosAlerts && sosAlerts.length > 0 ? (
                   <div className="divide-y divide-slate-800/50">
                     {sosAlerts.map(alert => (
                       <div key={alert.id} className="p-5 hover:bg-slate-800/40 transition-colors">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <h4 className="font-bold text-rose-400 text-sm">{alert.pihk || alert.ppiu || 'Travel Tidak Diketahui'}</h4>
                             <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                               <span>Reg: {alert.noReg || 'Tanpa Reg'}</span>
                               <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                               <span>{alert.timestamp ? new Date(alert.timestamp.seconds * 1000).toLocaleString('id-ID') : 'Waktu Terkini'}</span>
                             </p>
                           </div>
                           <span className="px-2 py-1 bg-rose-600 text-white font-bold text-[9px] uppercase tracking-widest rounded-sm animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.4)]">
                             Darurat
                           </span>
                         </div>
                         <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 mb-4">
                           <p className="text-xs text-slate-300 font-medium leading-relaxed">{alert.deskripsi || alert.message || 'Panggilan darurat terdeteksi dari aplikasi Jemaah.'}</p>
                           {alert.location && (
                              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3"/> {alert.location}</p>
                           )}
                         </div>
                         <div className="flex justify-end gap-2">
                           <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 h-7 text-[10px] font-bold" onClick={() => {
                             setToastMessage({title: "SOS Ditangani", desc: "Sinyal telah dicatat dan dalam proses penanganan.", type: "success"});
                           }}>Tandai Ditangani</Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                  <div className="p-12 text-center text-slate-500 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/30 flex items-center justify-center mb-4 border border-emerald-900/30">
                      <ShieldCheck className="w-8 h-8 text-emerald-500/50" />
                    </div>
                    <p className="font-bold text-slate-300 text-sm">Semua Terkendali</p>
                    <p className="text-xs mt-2 text-slate-400">Tidak ada sinyal darurat (SOS) aktif dari Jemaah saat ini.</p>
                  </div>
                 )}
               </CardContent>
            </Card>

            {/* Kolom SLA Warning */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden flex flex-col h-[550px]">
               <CardHeader className="border-b border-slate-800 pb-4 bg-slate-950/80">
                 <CardTitle className="text-slate-200 flex justify-between items-center text-sm">
                   <span className="flex items-center gap-2"><ActivitySquare className="w-5 h-5 text-amber-500"/> Anomali & Pelanggaran SLA</span>
                   <span className="text-[10px] px-2 py-1 bg-amber-950/80 text-amber-400 border border-amber-900/50 rounded-full font-bold">4 Peringatan</span>
                 </CardTitle>
                 <CardDescription className="text-xs">Sistem deteksi dini terkait kepatuhan penyelenggaraan dan operasional.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 overflow-y-auto flex-grow bg-slate-900/50">
                 <div className="divide-y divide-slate-800/50">
                    {/* Mock Item 1 */}
                    <div className="p-5 hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-amber-500 text-sm">PT. Khazanah Tamma Internasional</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                            <span>12 Feb 2026</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>SLA-26/0122</span>
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 font-bold text-[9px] uppercase tracking-widest rounded-sm">
                          Kritis
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed mt-2">Indikasi kegagalan pemberangkatan 45 Jemaah UM. Dana lunas tunda belum dikembalikan ke rekening BPKH lebih dari 14 hari kerja.</p>
                      <Button size="sm" variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Kirim Surat Peringatan III</Button>
                    </div>
                    
                    {/* Mock Item 2 */}
                    <div className="p-5 hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-amber-500 text-sm">PT. Masy'aril Haram Tour</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                            <span>10 Feb 2026</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>SLA-26/0120</span>
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-amber-950/80 text-amber-500 border border-amber-900/50 font-bold text-[9px] uppercase tracking-widest rounded-sm">
                          Menengah
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed mt-2">Terdeteksi anomali pada sistem Siskohat: 15 pendaftaran belum dilengkapi dokumen persyaratan dan paspor lebih dari 30 hari kalender.</p>
                      <Button size="sm" variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Kirim Peringatan I</Button>
                    </div>

                    {/* Mock Item 3 */}
                    <div className="p-5 hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-amber-500 text-sm">PT. Hanania</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                            <span>08 Feb 2026</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>SLA-26/0115</span>
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 font-bold text-[9px] uppercase tracking-widest rounded-sm">
                          Tinggi
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed mt-2">Overbooking maskapai penerbangan. 120 jemaah terlantar di Asrama Haji selama lebih dari 48 jam tanpa kepastian jadwal keberangkatan.</p>
                      <Button size="sm" variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Panggil Manajemen</Button>
                    </div>

                    {/* Mock Item 4 */}
                    <div className="p-5 hover:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-amber-500 text-sm">PT. Hidayah Amanah Jemaah</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                            <span>05 Feb 2026</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>SLA-26/0101</span>
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-amber-950/80 text-amber-500 border border-amber-900/50 font-bold text-[9px] uppercase tracking-widest rounded-sm">
                          Menengah
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed mt-2">Pelanggaran jadwal mediasi Jemaah. Penyelenggara mangkir dari panggilan mediasi tahap 2 tanpa konfirmasi ke Bareskrim.</p>
                      <Button size="sm" variant="outline" className="w-full border-amber-900/40 text-amber-500 hover:bg-amber-950/40 hover:text-amber-400 h-8 text-[10px] font-bold">Panggil Paksa</Button>
                    </div>
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}
      `;

writeFileSync(file, head + newMid + tail);
console.log("EWS tab restored!");
