const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'const [logoFile, setLogoFile] = useState<File | null>(null);',
  `const [apiModal, setApiModal] = useState({show: false, instansi: '', type: 'consume'});
  const [logoFile, setLogoFile] = useState<File | null>(null);`
);

c = c.replace(
  /<CardTitle className="text-sm text-white flex items-center justify-between">\s*<div className="flex items-center gap-2">\s*<Fingerprint className="w-5 h-5 text-blue-400" \/> Ditjen Imigrasi \(Kemenkumham\)\s*<\/div>\s*<span className="flex items-center gap-1.5 text-\[10px\] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">\s*<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"><\/div> Connected\s*<\/span>\s*<\/CardTitle>/,
  `<CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-400" /> Ditjen Imigrasi (Kemenkumham)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'Ditjen Imigrasi', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>`
);

c = c.replace(
  /<CardTitle className="text-sm text-white flex items-center justify-between">\s*<div className="flex items-center gap-2">\s*<Building className="w-5 h-5 text-amber-400" \/> BPS BPIH \(Bank Penerima Setoran\)\s*<\/div>\s*<span className="flex items-center gap-1.5 text-\[10px\] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">\s*<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"><\/div> Connected\s*<\/span>\s*<\/CardTitle>/,
  `<CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" /> BPS BPIH (Bank Penerima Setoran)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'BPS BPIH', type: 'provide'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>`
);

c = c.replace(
  /<CardTitle className="text-sm text-white flex items-center justify-between">\s*<div className="flex items-center gap-2">\s*<Globe2 className="w-5 h-5 text-emerald-400" \/> Sistem Nusuk \(KSA\)\s*<\/div>\s*<span className="flex items-center gap-1.5 text-\[10px\] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">\s*<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"><\/div> Connected\s*<\/span>\s*<\/CardTitle>/,
  `<CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400" /> Sistem Nusuk (KSA)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'Sistem Nusuk', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>`
);

c = c.replace(
  /<CardTitle className="text-sm text-white flex items-center justify-between">\s*<div className="flex items-center gap-2">\s*<PlaneTakeoff className="w-5 h-5 text-indigo-400" \/> GDS Maskapai Penerbangan\s*<\/div>\s*<span className="flex items-center gap-1.5 text-\[10px\] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">\s*<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"><\/div> Connected\s*<\/span>\s*<\/CardTitle>/,
  `<CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-indigo-400" /> GDS Maskapai Penerbangan
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'GDS Maskapai', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>`
);

const modalHTML = `
      {apiModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> Konfigurasi Kredensial API: {apiModal.instansi}
              </h3>
              <button onClick={() => setApiModal({show: false, instansi: '', type: 'consume'})} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {apiModal.type === 'consume' ? (
                <>
                  <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-300">
                      Anda sedang mengatur kredensial yang diberikan oleh pihak eksternal (<strong>{apiModal.instansi}</strong>) agar server SISKOPATUH dapat menarik (consume) data dari server mereka.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Endpoint Base URL (G2G)</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" defaultValue={"https://api." + apiModal.instansi.toLowerCase().replace(/[^a-z]/g, '') + ".go.id/v1"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">Client ID / Username</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" defaultValue="siskopatuh_prod_client" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">Status Koneksi</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none">
                          <option>Aktif (Production)</option>
                          <option>Sandbox (Testing)</option>
                          <option>Nonaktif</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                        <span>Client Secret / API Key</span>
                        <span className="text-emerald-500 font-normal">Last updated: 2 hari lalu</span>
                      </label>
                      <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" defaultValue="***************************" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-300">
                      Anda sedang membuat (generate) API Key untuk diberikan kepada tim IT <strong>{apiModal.instansi}</strong> agar sistem mereka dapat secara proaktif mengirim (push) data pelunasan jemaah ke server SISKOPATUH.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Production API Key (Bearer Token)</label>
                      <div className="flex gap-2">
                        <input type="text" readOnly className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono select-all" defaultValue="sk_live_bps_9x8f7a6b5c4d3e2f1a0" />
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Copy</Button>
                        <Button variant="outline" className="border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Revoke</Button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">Kredensial ini memberi {apiModal.instansi} akses penuh ke endpoint <code>/api/v1/escrow/notify-payment</code></p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">IP Whitelist (Security)</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" placeholder="Contoh: 103.45.67.89, 114.56.78.90" defaultValue="103.144.22.11, 202.43.12.99" />
                      <p className="text-[10px] text-slate-500 mt-1.5">Wajib diisi! Server SISKOPATUH akan menolak request B2B jika IP Address pengirim tidak terdaftar di atas.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setApiModal({show: false, instansi: '', type: 'consume'})}>
                Batal
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-900/50 font-medium">
                  <RefreshCw className="w-4 h-4 mr-2" /> Ping Connection
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20">
                  Simpan Kredensial
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

const lines = c.split('\n');
const lastClosingIndex = lines.lastIndexOf('    </div>');
if (lastClosingIndex !== -1) {
    lines.splice(lastClosingIndex, 0, modalHTML);
} else {
    // fallback
    c = c.replace(/    <\/div>\s*<\/div>\s*\)\s*}/, modalHTML + '\n    </div>\n  </div>\n  )\n}');
}

if (lastClosingIndex !== -1) {
    fs.writeFileSync(p, lines.join('\n'), 'utf8');
} else {
    fs.writeFileSync(p, c, 'utf8');
}
