      {activeTab === 'registrasi' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Verifikasi Penyelenggara
              </h3>
              <h2 className="text-3xl font-light text-white tracking-tight mt-1">Registrasi PIHK / PPIU</h2>
              <p className="text-zinc-400 text-sm mt-2">Verifikasi izin operasional dari AHU dan Kemenag.</p>
            </div>
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-zinc-800/50">
                    <tr>
                      <th className="px-4 py-3">Penyelenggara</th>
                      <th className="px-4 py-3">Jenis</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {direktoriList.map((item, i) => (
                      <tr key={item.id || i} className="border-b border-zinc-800/50">
                        <td className="px-4 py-4 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-4 text-zinc-300">{item.type}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Disetujui' ? 'bg-emerald-500/20 text-emerald-400' : item.status === 'Menunggu' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 flex gap-2">
                          <Button size="sm" variant="outline" className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs h-8">
                            <CheckCircle className="w-3 h-3 mr-1" /> Tervalidasi AHU
                          </Button>
                          <Button size="sm" variant="outline" className="border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800 text-xs h-8 text-emerald-400">
                            Terbitkan Izin
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-700 bg-red-900/30 hover:bg-red-800 text-xs h-8 text-red-400">
                            Tolak
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {direktoriList.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Tidak ada data pendaftaran</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
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
              <h2 className="text-3xl font-light text-white tracking-tight mt-1">Status Visa & Penerbangan</h2>
              <p className="text-zinc-400 text-sm mt-2">Pemantauan progres visa, maskapai, dan akomodasi jamaah.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-400" /> Kesiapan Maskapai (Radar)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: 'Garuda', A: 120, fullMark: 150 },
                    { subject: 'Saudia', A: 98, fullMark: 150 },
                    { subject: 'Lion Air', A: 86, fullMark: 150 },
                    { subject: 'Emirates', A: 99, fullMark: 150 },
                    { subject: 'Qatar', A: 85, fullMark: 150 },
                  ]}>
                    <PolarGrid stroke="#3f3f46" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                    <PolarRadiusAxis stroke="#3f3f46" />
                    <Radar name="Maskapai" dataKey="A" stroke="#60a5fa" fill="#3b82f6" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-zinc-100 flex items-center gap-2">
                  <ScanLine className="w-5 h-5 text-indigo-400" /> Progres Penerbitan Visa
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'DKI Jakarta', visaReady: 4000, inProcess: 2400 },
                    { name: 'Jabar', visaReady: 3000, inProcess: 1398 },
                    { name: 'Jatim', visaReady: 2000, inProcess: 9800 },
                    { name: 'Jateng', visaReady: 2780, inProcess: 3908 },
                    { name: 'Banten', visaReady: 1890, inProcess: 4800 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => \`\${val/1000}k\`} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="visaReady" name="Selesai" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProcess" name="Proses" fill="#818cf8" radius={[4, 4, 0, 0]} />
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
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Rekap Aduan Jemaah
              </h3>
              <h2 className="text-3xl font-light text-white tracking-tight mt-1">Sentra Pelayanan Terpadu</h2>
              <p className="text-zinc-400 text-sm mt-2">Log pengaduan dari Jemaah, Kemenag, dan Bareskrim Polri.</p>
            </div>
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-zinc-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" /> Log Aduan Terintegrasi (Bareskrim & Internal)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'AD-2026-001', pelapor: 'Zahar Djalle', terlapor: 'PT. Khazzanah Al-Anshary', masalah: 'Keterlambatan pemulangan lebih dari 2 hari tanpa kompensasi penginapan', status: 'Investigasi Bareskrim', date: '25 Ags 2026' },
                  { id: 'AD-2026-002', pelapor: 'Budi Santoso', terlapor: 'PT. Mabrur Tour', masalah: 'Fasilitas hotel tidak sesuai dengan paket yang dijanjikan', status: 'Mediasi Kemenag', date: '26 Ags 2026' },
                  { id: 'AD-2026-003', pelapor: 'Siti Aminah', terlapor: 'PT. Khazzanah Al-Anshary', masalah: 'Penahanan paspor oleh pihak travel', status: 'Eskalasi Polisi', date: '26 Ags 2026' },
                ].map((aduan) => (
                  <div key={aduan.id} className="p-4 rounded-lg bg-zinc-800/40 border border-zinc-700/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-500">{aduan.id}</span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-400">{aduan.date}</span>
                      </div>
                      <h4 className="text-white font-medium text-sm">{aduan.masalah}</h4>
                      <div className="text-xs text-zinc-400 mt-1">Pelapor: <span className="text-zinc-300">{aduan.pelapor}</span> | Terlapor: <span className="text-rose-400 font-medium">{aduan.terlapor}</span></div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full text-xs whitespace-nowrap">
                         {aduan.status}
                       </span>
                       <Button size="sm" variant="ghost" className="text-xs h-7 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">Tindak Lanjuti</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
