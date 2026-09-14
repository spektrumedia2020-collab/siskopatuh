import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. We want to move the SOS alerts and "Sistem Komando" header inside the 'kuota' tab, or just make them specific.
// Actually, let's just condition the header and global SOS to activeTab === 'kuota'
const globalHeaderRegex = /(\{sosAlerts\.length > 0 && \([\s\S]*?<\/div>\s*\)\}\s*<div className="flex justify-between items-center mb-8">[\s\S]*?Update Panduan PDF[\s\S]*?<\/div>\s*<\/div>)/;

const globalHeaderMatch = content.match(globalHeaderRegex);
if (globalHeaderMatch) {
  content = content.replace(globalHeaderRegex, `{activeTab === 'kuota' && (
    <>
      ${globalHeaderMatch[1]}
    </>
  )}`);
}

// 2. Separate 'kepatuhan' and 'ews' tabs
const oldCombinedTabsRegex = /\{\(activeTab === 'kepatuhan' \|\| activeTab === 'ews'\) && \([\s\S]*?\}\)/;

const separatedTabs = `
      {activeTab === 'kepatuhan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Kepatuhan Penyelenggara
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan Indeks SLA Travel & Akreditasi</p>
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

      {activeTab === 'ews' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Early Warning System (EWS)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Sinyal Peringatan Dini & Status Darurat Jemaah</p>
            </div>
          </div>

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
`;

content = content.replace(oldCombinedTabsRegex, separatedTabs);
writeFileSync(file, content);
console.log("Successfully fixed tabs");
