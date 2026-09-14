const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const fetchSlaWarningsTarget = `  useEffect(() => {
    const fetchSlaWarnings = async () => {
      try {
        const q = query(collection(db, "packages"));
        const snap = await getDocs(q);
        const latePackages = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(pkg => pkg.statusKeberangkatan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
        setSlaWarnings(latePackages);
      } catch (err) {
        console.error(err);
      }
    };
    if (activeTab === 'ews') {
      fetchSlaWarnings();
    }
  }, [activeTab]);`;

const fetchSlaWarningsReplacement = `  const [jemaahTunda, setJemaahTunda] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'ews') {
      const unsub = onSnapshot(collection(db, "packages"), async (snap) => {
        try {
          const allPackages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const latePackages = allPackages.filter(pkg => pkg.statusKeberangkatan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
          setSlaWarnings(latePackages);
          
          const delayedKepulanganPackages = allPackages.filter(pkg => pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
          const latePackageNames = delayedKepulanganPackages.map(p => p.name);
          
          if (latePackageNames.length > 0) {
            const jQ = query(collection(db, "users"), where("role", "==", "jemaah"));
            const jSnap = await getDocs(jQ);
            const delayedJemaah = jSnap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(j => latePackageNames.includes(j.paket));
            setJemaahTunda(delayedJemaah);
          } else {
            setJemaahTunda([]);
          }
        } catch (err) {
          console.error(err);
        }
      });
      return () => unsub();
    }
  }, [activeTab]);`;

content = content.replace(fetchSlaWarningsTarget, fetchSlaWarningsReplacement);

const ewsCardTarget = `                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}`;

const ewsCardReplacement = `                 </div>
               </CardContent>
            </Card>
          </div>
          
          {/* Komponen Daftar Jemaah Tunda Kepulangan */}
          <Card className="bg-slate-900 border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)] overflow-hidden flex flex-col mt-6">
            <CardHeader className="border-b border-rose-900/30 pb-4 bg-slate-950/80">
              <CardTitle className="text-rose-400 flex justify-between items-center text-sm font-bold">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Daftar Jemaah Tunda Kepulangan (EWS)</span>
                <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold">{jemaahTunda.length} Jemaah Terdampak</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Daftar manifest jemaah yang terdeteksi tertunda kepulangannya dari Arab Saudi berdasarkan perbandingan jadwal manifest (SLA).</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[400px] bg-slate-900/50">
              {jemaahTunda.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Nama Jemaah & Porsi</th>
                        <th className="px-4 py-3">Travel Penyelenggara</th>
                        <th className="px-4 py-3">Paket & Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {jemaahTunda.map((jemaah, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-200">{jemaah.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Porsi: {jemaah.porsiNumber || jemaah.porsi || '-'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-amber-400">
                            {jemaah.penyelenggara}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs">{jemaah.paket}</div>
                            <div className="inline-flex mt-1 items-center gap-1 text-[9px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-900/50 font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Tunda Kepulangan
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" className="border-rose-900/50 text-rose-400 hover:bg-rose-900 hover:text-white h-7 text-[10px] font-bold" onClick={() => setActiveTab('kepatuhan')}>
                              Investigasi
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/30 flex items-center justify-center mb-4 border border-emerald-900/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <p className="font-bold text-slate-300 text-sm">Clear</p>
                  <p className="text-xs mt-2 text-slate-400">Tidak ada jemaah yang masuk dalam kategori Tunda Kepulangan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}`;

content = content.replace(ewsCardTarget, ewsCardReplacement);

fs.writeFileSync(p, content, 'utf8');
console.log("Patched EWS Jemaah List");
