const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetStr = `        </div>
      )}

      {activeTab === 'beranda' && (`;

const replacementStr = `        </div>
      )}

      {/* Computed System Warnings */}
      {(missingTicketPkgs.length > 0 || unsyncedJemaahCount > 0) && (
        <div className="flex flex-col gap-3 mb-6">
          {unsyncedJemaahCount > 0 && (
            <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-amber-900/10">
              <div className="p-3 bg-amber-900/50 rounded-lg text-amber-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-amber-400 font-bold text-sm mb-1">Peringatan Sinkronisasi Jemaah</h4>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-950 px-2 py-0.5 rounded-full border border-amber-900">SYSTEM WARNING</span>
                </div>
                <p className="text-sm text-slate-300">Terdapat <b>{unsyncedJemaahCount} jemaah</b> yang datanya belum disinkronisasi dengan SISKOPATUH/Siskohat Pusat. Segera lakukan sinkronisasi di tab Manifes.</p>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs bg-amber-950 hover:bg-amber-900 border-amber-800 hover:text-white" onClick={() => setActiveTab('manifes')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Ke Tab Manifes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {missingTicketPkgs.length > 0 && missingTicketPkgs.map(pkg => (
            <div key={\`ticket-\${pkg.id}\`} className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-rose-900/10">
              <div className="p-3 bg-rose-900/50 rounded-lg text-rose-500">
                <Plane className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-rose-400 font-bold text-sm mb-1">SLA Pelanggaran: Bukti Tiket PP Belum Dilampirkan</h4>
                  <span className="text-[10px] text-rose-500 font-bold bg-rose-950 px-2 py-0.5 rounded-full border border-rose-900">URGENT</span>
                </div>
                <p className="text-sm text-slate-300">Anda belum melampirkan bukti tiket Pulang Pergi (PP) untuk keberangkatan paket <b>{pkg.name}</b>. Kegagalan melampirkan tiket akan menurunkan skor kepatuhan EWS (KMHU No.2/2026).</p>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs bg-rose-950 hover:bg-rose-900 border-rose-800 hover:text-white" onClick={() => setActiveTab('operasional')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Unggah Tiket Sekarang
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'beranda' && (`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched alerts successfully.");
} else {
  console.log("Target string not found for alerts.");
}
