import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/jemaah/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Add states for SOS modals
const stateSearch = `const [showUploadModal, setShowUploadModal] = useState(false);`;
const stateReplace = `const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSosConfirmModal, setShowSosConfirmModal] = useState(false);
  const [showSosResultModal, setShowSosResultModal] = useState(false);
  const [sosResultMsg, setSosResultMsg] = useState("");`;
content = content.replace(stateSearch, stateReplace);

// 2. Replace handleSOS logic
const handleSosRegex = /const handleSOS = async \(\) => \{[\s\S]*?\n\s*\}\s*catch\(e\)\s*\{\s*console\.error\(e\);\s*setSosStatus\('idle'\);\s*alert\("Gagal mengirim sinyal\. Pastikan koneksi internet stabil\."\);\s*\}\s*\};/;

const newHandleSos = `const handleSOS = () => {
    setShowSosConfirmModal(true);
  };

  const confirmSOS = async () => {
    setShowSosConfirmModal(false);
    setSosStatus('sending');
    try {
        let locationData = "Lokasi tidak diketahui (Izin ditolak/Gagal)";
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                locationData = \`Lat: \${(position as GeolocationPosition).coords.latitude}, Lng: \${(position as GeolocationPosition).coords.longitude}\`;
            }
        } catch(e) {
            console.log("Geolocation error", e);
        }
        
        const uid = localStorage.getItem("jemaah_auth_uid") || "unknown";
        await addDoc(collection(db, "sos_alerts"), {
            jemaahId: uid,
            jemaahName: userData?.name || "Anonim",
            ppiuName: userData?.penyelenggara || "Unknown",
            location: locationData,
            timestamp: new Date().toISOString(),
            status: 'active'
        });
        setSosStatus('sent');
        setSosResultMsg("Sinyal SOS terkirim! EWS Kemenhaj telah diaktifkan. Harap tetap di lokasi aman dan tunggu arahan.");
        setShowSosResultModal(true);
    } catch(e) {
        console.error(e);
        setSosStatus('idle');
        setSosResultMsg("Gagal mengirim sinyal. Pastikan koneksi internet stabil.");
        setShowSosResultModal(true);
    }
  };`;
content = content.replace(handleSosRegex, newHandleSos);

// 3. Add modal UI at the end before final </div>
const modalUI = `
      {showSosConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-red-900/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-red-900/30 bg-red-950/20">
              <h3 className="text-xl font-bold text-red-500 flex items-center gap-2"><TriangleAlert className="w-6 h-6"/> KONFIRMASI DARURAT</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                PERINGATAN: Sinyal Darurat akan dikirimkan langsung ke Sistem Komando Kemenhaj beserta data koordinat GPS Anda.
              </p>
              <p className="text-sm text-slate-300 mt-2 font-bold text-red-400">
                Apakah Anda benar-benar dalam kondisi darurat (penelantaran, ketiadaan tiket pulang, dll)?
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <Button onClick={confirmSOS} className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold text-base">
                YA, SAYA DALAM BAHAYA (KIRIM SOS)
              </Button>
              <Button onClick={() => setShowSosConfirmModal(false)} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12 font-bold text-base">
                BATAL
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSosResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 text-center">
              <div className={\`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 \${sosStatus === 'sent' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}\`}>
                <TriangleAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{sosStatus === 'sent' ? 'Sinyal Diterima Pusat' : 'Gagal Terkirim'}</h3>
              <p className="text-sm text-slate-300">{sosResultMsg}</p>
            </div>
            <div className="p-6">
              <Button onClick={() => setShowSosResultModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12">
                TUTUP
              </Button>
            </div>
          </div>
        </div>
      )}
`;

const replaceUIIndex = content.lastIndexOf("</div>");
content = content.substring(0, replaceUIIndex) + modalUI + content.substring(replaceUIIndex);

writeFileSync(file, content);
console.log("SOS Button fixed!");
