import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Update lucide-react imports
content = content.replace(
  'import { Plane, Building, Lock, CheckCircle2, QrCode, AlertCircle, FileText, Upload, Plus, ShieldCheck, Star, Activity, Wallet, PieChart as PieChartIcon, XCircle, ShieldAlert, Info, X } from "lucide-react";',
  'import { Plane, Building, Lock, CheckCircle2, QrCode, AlertCircle, FileText, Upload, Plus, ShieldCheck, Star, Activity, Wallet, PieChart as PieChartIcon, XCircle, ShieldAlert, Info, X, History, RefreshCw, Clock, User } from "lucide-react";'
);

// 2. Add syncLogs state
const stateMarker = 'const [packages, setPackages] = useState<any[]>([]);';
const stateCode = `const [packages, setPackages] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState([
    { id: 1, waktu: '2026-08-21 14:32:00 WIB', petugas: 'Ahmad Fauzi (Admin Operasional)', aksi: 'Sinkronisasi Otomatis Siskohat' },
    { id: 2, waktu: '2026-08-20 09:15:22 WIB', petugas: 'Siti Rahma (Staf Dokumen)', aksi: 'Import Bulk Data Jemaah (Gelombang 2)' },
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const formatTime = now.toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\\//g, '-').replace(',', '') + ' WIB';
      setSyncLogs(prev => [{ id: Date.now(), waktu: formatTime, petugas: \`\${pihkName} (Manual Sync)\`, aksi: 'Sinkronisasi Manual Manifes' }, ...prev]);
      setIsSyncing(false);
      setToastMessage({
        title: "Sinkronisasi Berhasil",
        desc: "Data manifes jemaah berhasil disinkronisasi dengan database pusat Kemenhaj.",
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
    }, 1500);
  };
`;
content = content.replace(stateMarker, stateCode);

// 3. Add Sync button in Manifes tab header
const buttonMarker = `<Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2 /30  /10 hover:/20"
                onClick={() => setShowImportModal(true)}
              >`;
const buttonCode = `<Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                onClick={handleSync}
                disabled={isSyncing}
              >
                <RefreshCw className={\`h-4 w-4 \${isSyncing ? 'animate-spin' : ''}\`} /> {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Pusat'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2 /30  /10 hover:/20"
                onClick={() => setShowImportModal(true)}
              >`;
content = content.replace(buttonMarker, buttonCode);

// 4. Add Log Riwayat Card below Manifes Card
const cardEndMarker = `            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Excel Modal */}`;
const logCode = `            </div>
          </CardContent>
        </Card>

        {/* Log Riwayat Sinkronisasi */}
        <Card className="mt-6 border-slate-800 bg-slate-900/50">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" /> Log Riwayat Sinkronisasi Manifes
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
        </Card>
      )}

      {/* Import Excel Modal */}`;
content = content.replace(cardEndMarker, logCode);

writeFileSync(file, content);
console.log("Dashboard updated with Log Riwayat!");
