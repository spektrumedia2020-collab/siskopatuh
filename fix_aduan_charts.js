import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const target = `<div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-4">`;

if (content.includes(target)) {
    const chartsCode = `
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
              <CardContent className="p-6 h-[180px] flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Penelantaran', value: 85 },
                    { name: 'Administratif', value: 32 }
                  ]} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} width={80} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                      {[{ name: 'Penelantaran', value: 85 }, { name: 'Administratif', value: 32 }].map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={index === 0 ? '#10b981' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
              <CardContent className="p-6 h-[180px] flex flex-col justify-end">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Klarifikasi', value: 50 },
                    { name: 'Mediasi', value: 18 },
                    { name: 'Bareskrim', value: 49 }
                  ]} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                      {[{ name: 'Klarifikasi', value: 50 }, { name: 'Mediasi', value: 18 }, { name: 'Bareskrim', value: 49 }].map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 relative shadow-lg">
              <CardContent className="p-4 h-[180px] flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-xl font-black text-rose-500">43%</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">Sangat<br/>Negatif</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sangat Negatif', value: 43, color: '#f43f5e' },
                        { name: 'Negatif', value: 35, color: '#f59e0b' },
                        { name: 'Netral', value: 22, color: '#3b82f6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {[
                        { name: 'Sangat Negatif', value: 43, color: '#f43f5e' },
                        { name: 'Negatif', value: 35, color: '#f59e0b' },
                        { name: 'Netral', value: 22, color: '#3b82f6' }
                      ].map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-4">`;
    content = content.replace(target, chartsCode);
    writeFileSync(file, content);
    console.log("Restored Aduan Charts!");
} else {
    console.log("Target not found.");
}
