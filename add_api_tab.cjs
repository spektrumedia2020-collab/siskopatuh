const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const apiTabContent = `
      {activeTab === 'api_integrasi' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Integrasi API (B2B)</h2>
              <p className="text-sm text-slate-400 mt-1">Kelola Kredensial API untuk menghubungkan sistem internal (ERP) Travel Anda langsung dengan Server SISKOPATUH Pusat.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" /> Kredensial API (Bearer Token)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">Gunakan API Key ini pada header HTTP request Anda: <code className="text-emerald-400 bg-emerald-950 px-1 rounded">Authorization: Bearer [API_KEY]</code></CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Live API Key (Production)</p>
                      <p className="font-mono text-emerald-400 text-sm tracking-wider">sk_live_siskopatuh_9x8f7a6b5c4d3e2f1a0</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800">Salin</Button>
                      <Button variant="outline" size="sm" className="h-8 border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Regenerate</Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mt-4 opacity-70">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sandbox API Key (Testing)</p>
                      <p className="font-mono text-slate-400 text-sm tracking-wider">sk_test_siskopatuh_1q2w3e4r5t6y7u8i9o0</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800">Salin</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm text-white">Endpoint Tersedia (API v1)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-900/50 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">GET</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/porsi/status</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 100/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Cek status nomor porsi jemaah (validitas dan pelunasan Escrow) dari server pusat.</p>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">POST</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/manifes/bulk-import</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 20/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Push ribuan data jemaah sekaligus dari ERP lokal Anda ke server SISKOPATUH (termasuk upload tiket dan visa massal).</p>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">POST</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/operasional/lapor-aktual</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 50/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Endpoint wajib untuk Auto-Lapor saat jemaah check-in di bandara keberangkatan/kepulangan untuk menghindari EWS peringatan.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
               <Card className="bg-emerald-950/20 border-emerald-900/30">
                  <CardHeader>
                    <CardTitle className="text-sm text-emerald-400 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Dokumentasi API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Silakan integrasikan sistem internal Travel Anda menggunakan spesifikasi OpenAPI 3.0 kami.
                    </p>
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200">
                      Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" />
                    </Button>
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200">
                      Download Postman Collection
                    </Button>
                  </CardContent>
               </Card>
               
               <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-white flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/> Status Layanan API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Server Status</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">API Latency</span>
                        <span className="text-emerald-400 font-bold">12ms</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Uptime (30 Hari)</span>
                        <span className="text-emerald-400 font-bold">99.99%</span>
                      </div>
                    </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </div>
      )}
`;

c = c.replace('{/* Tambah Jemaah Manual Modal */}', apiTabContent + '\n      {/* Tambah Jemaah Manual Modal */}');
fs.writeFileSync(p, c, 'utf8');
