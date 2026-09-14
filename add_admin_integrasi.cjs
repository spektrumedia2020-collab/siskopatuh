const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const integrasiContent = `
      {activeTab === 'integrasi' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-blue-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Network className="w-4 h-4" /> Manajemen API Lintas Sektoral (G2G & B2B)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan konektivitas sistem SISKOPATUH dengan Kementerian, Lembaga Negara, dan Otoritas Luar Negeri.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ditjen Imigrasi */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-blue-400" /> Ditjen Imigrasi (Kemenkumham)
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk mengecek apakah paspor jemaah asli, masih berlaku, dan apakah jemaah berstatus cekal (pencegahan tangkal).</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">gRPC / TLS 1.3</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">API Latency</span>
                    <span className="text-emerald-400 font-bold">14ms</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Sync Mode</span>
                    <span className="text-blue-400 font-bold">Real-time Validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BPS BPIH */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-400" /> BPS BPIH (Bank Penerima Setoran)
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan agar SISKOPATUH otomatis tahu saat jemaah sudah melunasi pembayaran rekening (Escrow) tanpa perlu mutasi manual.</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">REST API (ISO 20022)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Data Transfer (24h)</span>
                    <span className="text-amber-400 font-bold">4.2 GB</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Status Rekonsiliasi</span>
                    <span className="text-emerald-400 font-bold">Sinkron (Auto)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nusuk / Saudi */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-emerald-400" /> Sistem Nusuk (KSA)
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk melacak apakah e-Visa jemaah benar-benar sudah diterbitkan secara sah oleh otoritas Saudi (MoHU KSA).</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">REST API (OAuth 2.0)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">API Latency</span>
                    <span className="text-amber-400 font-bold">245ms (Intl)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Visa Webhook</span>
                    <span className="text-emerald-400 font-bold">Aktif (Push)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Airlines / GDS */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="w-5 h-5 text-indigo-400" /> GDS Maskapai Penerbangan
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk memvalidasi apakah Kode Booking (PNR) tiket PP yang dilaporkan travel adalah tiket asli (Issued) dan bukan booking palsu/bodong.</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Providers</span>
                    <span className="text-slate-300 font-mono">Amadeus, Sabre, SV, GA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Validation Mode</span>
                    <span className="text-indigo-400 font-bold">Atomic Locking</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">PNR Hit Rate</span>
                    <span className="text-emerald-400 font-bold">1.2K req/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
`;

c = c.replace("{activeTab === 'ledger' && (", integrasiContent + '\n\n      {activeTab === \'ledger\' && (');
fs.writeFileSync(p, c, 'utf8');
