const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const uiStart = "{activeTab === 'aduan' && (";
const uiEnd = "{activeTab === 'ews' && (";

if (content.includes(uiStart) && content.includes(uiEnd)) {
  const before = content.substring(0, content.indexOf(uiStart));
  const after = content.substring(content.indexOf(uiEnd));
  
  const newUI = `{activeTab === 'aduan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          {/* Top 3 Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: ADUAN BERDASARKAN KATEGORI */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> ADUAN BERDASARKAN KATEGORI
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Administratif', value: 5, fill: '#a855f7' },
                    { name: 'Penelantaran', value: 5, fill: '#10b981' },
                    { name: 'Tunggakan / Refund', value: 20, fill: '#3b82f6' },
                    { name: 'Penipuan / Gagal', value: 25, fill: '#f59e0b' },
                    { name: 'Lainnya', value: 80, fill: '#fb7185' },
                  ]} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {
                        [...Array(5)].map((_, index) => (
                          <Cell key={\`cell-\${index}\`} fill={['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#fb7185'][index]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Card 2: STATUS PENYELESAIAN */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> STATUS PENYELESAIAN
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '', value: 60, fill: '#3b82f6' },
                    { name: 'Klarifikasi', value: 5, fill: '#f59e0b' },
                    { name: 'Mediasi', value: 20, fill: '#10b981' },
                    { name: 'Bareskrim', value: 55, fill: '#ef4444' },
                  ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                      {
                        [...Array(4)].map((_, index) => (
                          <Cell key={\`cell-\${index}\`} fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Card 3: ANALISIS SENTIMEN LAPORAN */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" /> ANALISIS SENTIMEN LAPORAN
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] flex justify-center items-center relative pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sangat Negatif', value: 43, fill: '#fb7185' },
                        { name: 'Negatif', value: 37, fill: '#3b82f6' },
                        { name: 'Netral', value: 20, fill: '#f59e0b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [...Array(3)].map((_, index) => (
                          <Cell key={\`cell-\${index}\`} fill={['#fb7185', '#3b82f6', '#f59e0b'][index]} />
                        ))
                      }
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-0">
                  <span className="text-2xl font-black text-rose-400 leading-none">43%</span>
                  <span className="text-[9px] text-slate-400 text-center tracking-wider font-bold mt-1 uppercase leading-tight">SANGAT<br/>NEGATIF</span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-emerald-900/50 mt-4 px-2">
            <button className="text-emerald-400 bg-[#0b1120] px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide border-t border-l border-r border-emerald-900/50 relative top-[1px]">Rekap Pengaduan</button>
            <button className="text-emerald-500/70 hover:text-emerald-400 font-bold text-[13px] tracking-wide transition-colors">Haji Khusus</button>
            <button className="text-emerald-500/70 hover:text-emerald-400 font-bold text-[13px] tracking-wide transition-colors">Umrah</button>
            <button className="text-rose-500 font-bold text-[13px] tracking-wide ml-4 hover:text-rose-400 transition-colors">Diserahkan ke Bareskrim</button>
          </div>

          {/* Table Details */}
          <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
             <CardContent className="p-0">
                <div className="overflow-x-auto">
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
