import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const konsorsiumCode = `      {activeTab === 'konsorsium' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Konsorsium & Mutasi Jemaah</h2>
              <p className="text-sm text-slate-400 mt-1">Fasilitas penggabungan kloter dan pelimpahan jemaah resmi antar-Penyelenggara (PIHK/PPIU).</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white">Form Pengajuan Konsorsium</CardTitle>
                <CardDescription className="text-xs text-slate-400">Pilih travel mitra dan unggah dokumen kesepakatan.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Penyelenggara Tujuan (Mitra)</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none">
                    <option value="" disabled selected>-- Pilih PPIU/PIHK Mitra --</option>
                    <option value="1">PT Al-Dawood Barokah Utama (Akreditasi A)</option>
                    <option value="2">PT Khazanah Tamma Internasional (Akreditasi D)</option>
                    <option value="3">PT Arminareka Perdana (Akreditasi A)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Jumlah Jemaah yang Dimutasi</label>
                  <input type="number" min="1" placeholder="Cth: 15" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none" />
                  <p className="text-[10px] text-amber-500">Dana Escrow atas jemaah ini akan dialihkan hak klaimnya ke travel tujuan.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Unggah Surat Perjanjian / MoU Konsorsium</label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-800 transition-colors cursor-pointer">
                    <Upload className="h-5 w-5 text-slate-500 mb-2" />
                    <p className="text-xs font-medium text-slate-300">Pilih file PDF</p>
                    <p className="text-[10px] text-slate-500">Maks. 5MB, ditandatangani kedua pihak.</p>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-4" onClick={() => {
                  setToastMessage({title: 'Pengajuan Terkirim', desc: 'Mutasi Konsorsium sedang menunggu validasi Kemenhaj.', type: 'success'});
                  setTimeout(() => setToastMessage(null), 5000);
                }}>
                  Ajukan Mutasi ke Kemenhaj
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white">Status Pengajuan Mutasi (Audit Trail)</CardTitle>
                <CardDescription className="text-xs text-slate-400">Riwayat perpindahan jemaah dari/ke akun Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/60">
                  <div className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Keluar (Mutasi)</span>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">Ke: PT Al-Dawood Barokah Utama</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-bold">MENUNGGU VALIDASI</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded">15 Jemaah</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hari ini, 09:12 WIB</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Masuk (Terima)</span>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">Dari: PT Berkah Jaya Tour</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">SAH & SELESAI</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded">40 Jemaah</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tervalidasi</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

`;

content = content.replace('      {/* Import Excel Modal */}', konsorsiumCode + '      {/* Import Excel Modal */}');
writeFileSync(file, content);
console.log("Konsorsium added!");
