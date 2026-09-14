const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const hotelFraudContent = `          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
               <CardHeader className="border-b border-rose-900/30 pb-4 bg-slate-950/80">
                 <CardTitle className="text-rose-400 flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Anomali Lokasi Hotel (Geofencing)</span>
                    <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold animate-pulse">2 TRAVEL TERDETEKSI</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex gap-4 hover:bg-slate-800/30">
                      <div className="w-10 h-10 rounded bg-rose-950/50 border border-rose-900 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-200 font-bold text-sm">PT Nur Hidayah Wisata</h4>
                        <p className="text-xs text-slate-400 mt-1">Sistem GPS Jemaah mendeteksi lokasi check-in berjarak <strong className="text-rose-400">4.2 KM</strong> dari Masjidil Haram.</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px]">
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Hotel Dijanjikan</span>
                            <span className="text-emerald-400 font-bold">Zamzam Pullman (50m)</span>
                          </div>
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Hotel Aktual (GPS)</span>
                            <span className="text-rose-400 font-bold">Al-Kiswah (4.2km)</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">Tindak</Button>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-slate-900 border-amber-900/50 shadow-[0_0_20px_rgba(217,119,6,0.1)]">
               <CardHeader className="border-b border-amber-900/30 pb-4 bg-slate-950/80">
                 <CardTitle className="text-amber-400 flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2"><Bed className="w-5 h-5"/> Fraud Bintang Hotel (Bait & Switch)</span>
                    <span className="text-[10px] px-2 py-1 bg-amber-950/80 text-amber-400 border border-amber-900/50 rounded-full font-bold">1 TRAVEL DIBLOKIR</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex gap-4 hover:bg-slate-800/30">
                      <div className="w-10 h-10 rounded bg-amber-950/50 border border-amber-900 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-200 font-bold text-sm">PT Berkah Abadi Tour</h4>
                        <p className="text-xs text-slate-400 mt-1">Cross-check API Nusuk mendeteksi penurunan spesifikasi hotel secara diam-diam tanpa persetujuan Jemaah.</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px]">
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Brosur Paket</span>
                            <span className="text-amber-400 font-bold">⭐⭐⭐⭐⭐ (Bintang 5)</span>
                          </div>
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Validasi API Nusuk</span>
                            <span className="text-rose-400 font-bold">⭐⭐ (Bintang 2)</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-rose-900 text-rose-400 bg-rose-950/20">Blokir Visanya</Button>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>`;

c = c.replace(
  /<Card className="bg-slate-900 border-slate-800">\s*<CardHeader className="border-b border-slate-800 pb-4">\s*<CardTitle className="text-slate-200">Peringatan Sistem<\/CardTitle>\s*<\/CardHeader>\s*<CardContent className="pt-4">\s*<div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">\s*<div className="w-16 h-16 rounded-full bg-emerald-950\/30 flex items-center justify-center mb-4 border border-emerald-900\/30">\s*<CheckCircle2 className="w-8 h-8 text-emerald-500\/50" \/>\s*<\/div>\s*<p className="font-bold text-slate-300 text-sm">Aman<\/p>\s*<p className="text-xs mt-2 text-slate-400">Tidak ada peringatan aktif saat ini.<\/p>\s*<\/div>\s*<\/CardContent>\s*<\/Card>/,
  hotelFraudContent
);

fs.writeFileSync(p, c, 'utf8');
