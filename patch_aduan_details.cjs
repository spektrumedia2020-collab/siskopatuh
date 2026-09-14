const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetStart = `{aduanSubTab === 'haji_khusus' && (`;
const targetEnd = `                  
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ews' && (`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
  const before = content.substring(0, content.indexOf(targetStart));
  const after = content.substring(content.indexOf(targetEnd) + targetEnd.length);
  
  const newUI = `{aduanSubTab === 'haji_khusus' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">001/LAPDU/HK/2025</div><div className="text-xs text-slate-500 mt-1">Nov 25, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT Nurul Muflihun Albaroqah</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Laporan penipuan Haji furoda yang gagal berangkat, dialihkan ke Umrah</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">004/LAPDU/HK/2025</div><div className="text-xs text-slate-500 mt-1">Dec 16, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT. Hidayah Amanah Jemaah</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Gagalnya Pemberangkatan Haji</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">017/LAPDU/HK/2026</div><div className="text-xs text-slate-500 mt-1">Jan 9, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT. Gaido Azza Darussalam</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Permohonan Klarifikasi dan Peninjauan Status Jamaah Haji Khusus</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">019/LAPDU/HK/2026</div><div className="text-xs text-slate-500 mt-1">Jan 2026</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT. Nurul Muflihun Al-Baroqah</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Dugaan tindak pidana penipuan 10 jamaah haji furodah 2025</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Klarifikasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">028/LAPDU/HK/2026</div><div className="text-xs text-slate-500 mt-1">Jan 28, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT Al-Dawood Barokah Utama</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Laporan atas dugaan penipuan haji khusus oleh PT Al-Dawood</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'umrah' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PPIU (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">003/LAPDU/UM/2025</div><div className="text-xs text-slate-500 mt-1">Dec 12, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT Sultanah Nafisah Mandiri</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Jamaah umroh atas nama Ibu Cucu Suryani sakit di Arab Saudi kurang lebih 30 hari</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">011/LAPDU/UM/2025</div><div className="text-xs text-slate-500 mt-1">Dec 19, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT. Amanah Berkah Mandiri</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Dugaan penipuan PPIH 28 jamaah umroh terlantar di P3 bandara Soekarno</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">012/LAPDU/UM/2025</div><div className="text-xs text-slate-500 mt-1">Dec 22, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT Atlas Tour</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Aduan Masyarakat Atas Dugaan Penelantaran Jamaah Umroh</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">022/LAPDU/UM/2026</div><div className="text-xs text-slate-500 mt-1">Jan 22, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT Tourindo Tours & Travel</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Pengaduan atas Dugaan Pengabaian Hak Jamaah dan Ketidakpatuhan</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider">Mediasi</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">052/LAPDU/UM/2026</div><div className="text-xs text-slate-500 mt-1">Feb 25, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-emerald-400">PT. Nur Rizqon Hasana</td>
                        <td className="px-6 py-4 text-slate-300 text-xs">Laporan Dugaan Penipuan Umrah Oleh PT. Nur Rizqon Hasana</td>
                        <td className="px-6 py-4 text-center"><span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-wider text-center flex flex-col justify-center leading-tight"><span>Pemanggilan</span><span>Klarifikasi</span></span></td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'bareskrim' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK / PPIU (TERLAPOR)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">KAT</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-1/2">TINDAK LANJUT / STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">002/LAPDU/HK/2025</div><div className="text-xs text-slate-500 mt-1">Dec 12, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-rose-400">PT. Budi Luhur Abadi</td>
                        <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">HK</span></td>
                        <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani Bareskrim POLRI</span><br/><span className="text-slate-400">Surat Nomor: B/2545/V/RES.5.1./2026/Bareskrim tanggal 6 Mei 2026</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">005/LAPDU/UM/2025</div><div className="text-xs text-slate-500 mt-1">Dec 19, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-rose-400">PT. Tanur Muthmainnah Tour</td>
                        <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">UM</span></td>
                        <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani Bareskrim POLRI</span><br/><span className="text-slate-400">Surat Nomor: B/2545/V/RES.5.1./2026/Bareskrim tanggal 6 Mei 2026</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">013/LAPDU/HK/2025</div><div className="text-xs text-slate-500 mt-1">Dec 23, 2025</div></td>
                        <td className="px-6 py-4 font-bold text-rose-400">PT. Dwi Cipta Umroh</td>
                        <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">HK</span></td>
                        <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani Bareskrim POLRI</span><br/><span className="text-slate-400">Surat Nomor: B/2545/V/RES.5.1./2026/Bareskrim tanggal 6 Mei 2026</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">039/LAPDU/HK/2026</div><div className="text-xs text-slate-500 mt-1">Feb 11, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-rose-400">Gaido Travel & Tours</td>
                        <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">HK</span></td>
                        <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani Bareskrim POLRI</span><br/><span className="text-slate-400">Surat Nomor: B/1226/V/RES.5/2026/Bareskrim tanggal 5 Mei 2026</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4"><div className="font-mono text-slate-300">040/LAPDU/HK/2026</div><div className="text-xs text-slate-500 mt-1">Feb 11, 2026</div></td>
                        <td className="px-6 py-4 font-bold text-rose-400">PT. Arminareka</td>
                        <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">HK</span></td>
                        <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani Bareskrim POLRI</span><br/><span className="text-slate-400">Surat Nomor: B/1226/V/RES.5/2026/Bareskrim tanggal 5 Mei 2026</span></td>
                      </tr>
                    </tbody>
                  </table>
                  )}
                  
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ews' && (`;
      
  content = before + newUI + after;
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched successfully!");
} else {
  console.log("Could not find UI block limits.");
}
