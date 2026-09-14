import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Insert after EWS tab
const ewsStart = content.indexOf("{activeTab === 'ews' && (");
// Find the end of EWS tab. It's just a simple div now since I separated it.
// EWS tab ends before {activeTab === 'scanner' && (
const scannerStart = content.indexOf("{activeTab === 'scanner' && (");

const head = content.substring(0, scannerStart);
const tail = content.substring(scannerStart);

const newTabs = `
      {activeTab === 'operasional' && (
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
             <CardHeader className="border-b border-slate-800 pb-4">
               <CardTitle className="text-slate-200">Daftar Penyelenggara Terhubung</CardTitle>
               <CardDescription>Status operasional dan integrasi API penyelenggara.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                      <th className="p-4 font-medium">Nama Penyelenggara</th>
                      <th className="p-4 font-medium">Status Integrasi</th>
                      <th className="p-4 font-medium">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {uniquePenyelenggara.slice(0, 5).map((nama, idx) => (
                      <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-bold text-slate-300">{nama}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-[10px] font-bold">Terhubung</span></td>
                        <td className="p-4"><Button size="sm" variant="outline" className="h-8 text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800">Lihat Metrik</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </CardContent>
          </Card>
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

      {activeTab === 'registrasi' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow h-[600px] animate-in fade-in">
          <div className="md:col-span-4 flex flex-col gap-3 overflow-y-auto pr-2 border-r border-slate-800">
            <div className="relative mb-2">
              <select 
                className="w-full pl-3 pr-8 h-9 rounded-lg border border-slate-700 bg-slate-950 focus:outline-none focus:border-emerald-500 text-sm theme-title text-slate-300 appearance-none cursor-pointer"
                value={activePemohon?.id || ''}
                onChange={(e) => {
                  const found = direktoriList.find(x => x.id === e.target.value);
                  if (found) setActivePemohon(found);
                }}
              >
                <option value="" disabled>-- Pilih Penyelenggara --</option>
                {direktoriList.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            {direktoriList.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActivePemohon(item)}
                className={\`p-4 rounded-xl cursor-pointer transition-colors border \${activePemohon?.id === item.id ? 'bg-slate-800/50 border-emerald-500/30' : 'bg-slate-950 border-slate-800 hover:bg-slate-900'}\`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={\`text-sm font-bold \${activePemohon?.id === item.id ? 'theme-title' : 'text-slate-300'}\`}>{item.name}</h4>
                  <span className="bg-amber-900/30 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-amber-500/30">
                    {item.status === 'Dalam Pengawasan' ? 'Menunggu' : item.status || 'Menunggu'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mb-2">ID: {item.id}</p>
              </div>
            ))}
          </div>

          <div className="md:col-span-8 flex flex-col h-full overflow-y-auto pl-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold theme-title mb-1">{activePemohon?.name || "Memuat..."}</h2>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Pengajuan Izin {activePemohon?.type || ""}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm flex items-center gap-2 theme-title">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs text-slate-400">1</span>
                    Validasi Status Hukum (AHU)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Nomor Induk Berusaha (NIB): <strong className="text-slate-300 font-mono">8120004951234</strong></p>
                      <p className="text-[10px] text-slate-500">Integrasi API Kemenkumham diperlukan untuk memeriksa keabsahan entitas.</p>
                    </div>
                    <Button size="sm" className="theme-title text-xs" onClick={(e) => {
                      const target = e.currentTarget;
                      target.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> TERVALIDASI AHU</span>';
                      target.classList.add('border', 'border-emerald-500/50', 'bg-emerald-900/20');
                    }}>
                      VALIDASI DATA AHU
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm flex items-center gap-2 theme-title">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs text-slate-400">2</span>
                    Persetujuan Akhir
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex justify-end gap-2">
                   <Button variant="outline" className="border-slate-700 text-slate-300">Tolak Permohonan</Button>
                   <Button className="bg-emerald-600 hover:bg-emerald-500 font-bold text-white">Terbitkan Izin PIHK/PPIU</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
`;

content = head + newTabs + "\n" + tail;
writeFileSync(file, content);
console.log("Successfully restored tabs");
