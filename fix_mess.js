import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Remove the wrongly injected Log card from the escrow section
const logCardRegex = /\s*\{\/\* Log Riwayat Sinkronisasi \*\/\}[\s\S]*?<\/Card>\s*\)\}/;
// Since we wrapped it, let's just find the exact text and remove it.
const wronglyInjected = `        {/* Log Riwayat Sinkronisasi */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" /> Log Riwayat Pembaruan Manifes
            </CardTitle>
            <CardDescription className="text-xs">Catatan rekam jejak pembaruan data jemaah dan petugas yang bertanggung jawab.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800/60">
              {syncLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{log.aksi}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {log.petugas}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.waktu}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400">BERHASIL</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>`;

content = content.replace(wronglyInjected, '');

// Also remove the `</div>` from `</div>\n      )}` that might have been added to the wrong place or the right place. Let's just find all `</div>\n      )}` and revert them to `)}`
content = content.replace(/<\/div>\s*\}\)/g, ')}');

// Revert the wrapper start in manifes just in case
content = content.replace('{activeTab === \'manifes\' && (\n        <div className="space-y-6 animate-in fade-in">\n        <Card>', '{activeTab === \'manifes\' && (\n        <Card>');

writeFileSync(file, content);
console.log("Reverted mess");
