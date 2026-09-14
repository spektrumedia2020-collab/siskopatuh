const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetStart = `{/* Navigation Tabs */}`;
const targetEnd = `{activeTab === 'ews' && (`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
  const before = content.substring(0, content.indexOf(targetStart));
  const after = content.substring(content.indexOf(targetEnd));
  
  const newUI = `{/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-emerald-900/50 mt-4 px-2">
            <button 
              onClick={() => setAduanSubTab('rekap')} 
              className={\`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors \${aduanSubTab === 'rekap' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}\`}>
              Rekap Pengaduan
            </button>
            <button 
              onClick={() => setAduanSubTab('haji_khusus')} 
              className={\`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors \${aduanSubTab === 'haji_khusus' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}\`}>
              Haji Khusus
            </button>
            <button 
              onClick={() => setAduanSubTab('umrah')} 
              className={\`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors \${aduanSubTab === 'umrah' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}\`}>
              Umrah
            </button>
            <button 
              onClick={() => setAduanSubTab('bareskrim')} 
              className={\`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors ml-4 \${aduanSubTab === 'bareskrim' ? 'text-rose-400 bg-[#0b1120] border-t border-l border-r border-rose-900/50' : 'text-rose-500 hover:text-rose-400'}\`}>
              Diserahkan ke Bareskrim
            </button>
          </div>

          {/* Table Details */}
          <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                  
                  {aduanSubTab === 'rekap' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase w-1/2">KETERANGAN</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">HAJI KHUSUS</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">UMRAH</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Pemanggilan Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">21</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">27</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">48</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">2</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">0</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">2</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Mediasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">10</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">8</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">18</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Bareskrim</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">14</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">35</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">49</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Jumlah Total</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">47</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">70</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">117</td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'haji_khusus' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase w-3/4">KETERANGAN (HAJI KHUSUS)</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/4">JUMLAH KASUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Pemanggilan Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">21</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">2</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Mediasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">10</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Bareskrim</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">14</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Jumlah Total</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">47</td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'umrah' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase w-3/4">KETERANGAN (UMRAH)</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/4">JUMLAH KASUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Pemanggilan Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">27</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">0</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Mediasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">8</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Bareskrim</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">35</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Jumlah Total</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">70</td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'bareskrim' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase">ID ADUAN</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase">TERLAPOR (PENYELENGGARA)</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase">KASUS</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">TANGGAL PENYERAHAN</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-mono text-slate-400">AD-2026-B01</td>
                        <td className="px-8 py-5 font-bold text-rose-400">PT. Khazzanah Al-Anshary</td>
                        <td className="px-8 py-5 text-slate-300">Penipuan / Gagal Berangkat (Umrah)</td>
                        <td className="px-8 py-5 text-center text-slate-400">12 Ags 2026</td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs whitespace-nowrap">Penyidikan Polisi</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-mono text-slate-400">AD-2026-B02</td>
                        <td className="px-8 py-5 font-bold text-rose-400">PT. Mabrur Tour</td>
                        <td className="px-8 py-5 text-slate-300">Penelantaran di Arab Saudi (Haji Khusus)</td>
                        <td className="px-8 py-5 text-center text-slate-400">15 Ags 2026</td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs whitespace-nowrap">Penyidikan Polisi</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-mono text-slate-400">AD-2026-B03</td>
                        <td className="px-8 py-5 font-bold text-rose-400">PT. Safa Marwa</td>
                        <td className="px-8 py-5 text-slate-300">Tunggakan Refund Dana Jamaah</td>
                        <td className="px-8 py-5 text-center text-slate-400">20 Ags 2026</td>
                        <td className="px-8 py-5 text-center">
                          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs whitespace-nowrap">Pemberkasan</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  )}
                  
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      `;
      
  content = before + newUI + after;
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched successfully!");
} else {
  console.log("Could not find UI block limits.");
}
