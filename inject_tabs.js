import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const missingTabs = `
      {(activeTab === 'kepatuhan' || activeTab === 'ews') && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Kepatuhan Penyelenggara & EWS
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan SLA & Sinyal Peringatan Dini</p>
            </div>
          </div>

          {/* SOS Banner */}
          <div className="bg-rose-600 border border-rose-500 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-rose-900/20">
             <div className="flex items-center gap-4">
               <div className="bg-white/20 p-2 rounded-full">
                 <MessageSquareWarning className="w-6 h-6 text-white animate-pulse" />
               </div>
               <div>
                 <h4 className="text-white font-bold text-lg">DARURAT: 1 SINYAL SOS JEMAAH AKTIF DI LAPANGAN!</h4>
                 <p className="text-rose-100 text-sm">Harap segera koordinasi dengan Konsulat Jenderal RI atau pihak penerbangan terkait indikasi penelantaran.</p>
               </div>
             </div>
             <div className="flex gap-2">
               <Button className="bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-md border-0">Lihat Detail</Button>
               <Button variant="outline" className="border-rose-400/50 text-rose-100 hover:bg-rose-500/20 font-bold">Selesai & Tutup</Button>
             </div>
          </div>

          <Card className="bg-slate-900 border-slate-800">
             <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-slate-200">Indeks Kepatuhan Travel</CardTitle>
               <CardDescription>Skor SLA dan deteksi anomali operasional.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                      <th className="p-4 font-medium">Nama Penyelenggara</th>
                      <th className="p-4 font-medium">Skor Kepatuhan</th>
                      <th className="p-4 font-medium">Status Akreditasi</th>
                      <th className="p-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-slate-300">PT. Khazanah Tamma Internasional</td>
                      <td className="p-4 font-bold text-rose-400">45 / 100</td>
                      <td className="p-4"><span className="px-2 py-1 bg-rose-950 text-rose-400 border border-rose-900 rounded text-[10px] font-bold">Akreditasi D</span></td>
                      <td className="p-4"><Button size="sm" variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Berikan Teguran</Button></td>
                    </tr>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4 font-bold text-slate-300">PT. Mabrur Travel Umroh</td>
                      <td className="p-4 font-bold text-emerald-400">92 / 100</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold">Akreditasi A</span></td>
                      <td className="p-4"><span className="text-xs text-slate-500 italic">Aman</span></td>
                    </tr>
                  </tbody>
                </table>
             </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'operasional' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-blue-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ActivitySquare className="w-4 h-4" /> Radar Kesiapan Operasional
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan Metrik Maskapai & Akomodasi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-slate-900 border-slate-800">
               <CardHeader>
                 <CardTitle className="text-slate-200">Kesiapan Maskapai (Radar)</CardTitle>
               </CardHeader>
               <CardContent className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: 'Visa', A: 120, B: 110, fullMark: 150 },
                      { subject: 'Tiket', A: 98, B: 130, fullMark: 150 },
                      { subject: 'Hotel', A: 86, B: 130, fullMark: 150 },
                      { subject: 'Transport', A: 99, B: 100, fullMark: 150 },
                      { subject: 'Katering', A: 85, B: 90, fullMark: 150 },
                      { subject: 'Asuransi', A: 65, B: 85, fullMark: 150 },
                    ]}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Radar name="Garuda Indonesia" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                      <Radar name="Saudia" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
               </CardContent>
             </Card>
             
             <Card className="bg-slate-900 border-slate-800">
               <CardHeader>
                 <CardTitle className="text-slate-200">Progres Visa & Dokumen</CardTitle>
               </CardHeader>
               <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Jan', Visa: 4000, Paspor: 2400 },
                      { name: 'Feb', Visa: 3000, Paspor: 1398 },
                      { name: 'Mar', Visa: 2000, Paspor: 9800 },
                      { name: 'Apr', Visa: 2780, Paspor: 3908 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                      <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 10}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px'}} />
                      <Legend />
                      <Bar dataKey="Visa" fill="#3b82f6" radius={[4,4,0,0]} />
                      <Bar dataKey="Paspor" fill="#10b981" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </CardContent>
             </Card>
          </div>
        </div>
      )}

      {activeTab === 'aduan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-amber-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Users className="w-4 h-4" /> Rekap Aduan Jemaah
              </h3>
              <p className="text-sm text-slate-400 mt-1">Daftar Laporan Penelantaran dan Komplain dari Jemaah</p>
            </div>
            <Button size="sm" className="font-bold bg-amber-600 hover:bg-amber-500 text-white" onClick={() => setToastMessage({title: 'Tindak Lanjut', desc: 'Meneruskan laporan ke Bareskrim.', type: 'aduan'})}>
              Teruskan ke Bareskrim
            </Button>
          </div>
          
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                      <th className="p-4 font-medium">No. Reg</th>
                      <th className="p-4 font-medium">Travel Dilaporkan</th>
                      <th className="p-4 font-medium">Kategori</th>
                      <th className="p-4 font-medium">Perihal & Tindak Lanjut</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {aduanBareskrim.slice(0, 5).map((aduan, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4">
                          <p className="font-mono text-xs font-bold text-slate-300">{aduan.reg}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{aduan.tanggal}</p>
                        </td>
                        <td className="p-4 font-bold text-rose-400 text-xs">{aduan.pihk}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-amber-950/50 text-amber-500 border border-amber-900 rounded text-[10px] font-bold">{aduan.kategori}</span></td>
                        <td className="p-4 text-xs text-slate-400 leading-relaxed max-w-sm">{aduan.perihal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </CardContent>
          </Card>
        </div>
      )}
`;

content = content.replace("{activeTab === 'registrasi' && (", missingTabs + "\n      {activeTab === 'registrasi' && (");
writeFileSync(file, content);
console.log("Successfully injected missing tabs");
