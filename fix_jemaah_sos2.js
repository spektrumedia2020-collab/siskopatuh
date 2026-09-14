import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/jemaah/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const regex = /const handleSOS = async \(\) => \{[\s\S]*?alert\("Gagal mengirim sinyal\. Pastikan koneksi internet stabil\."\);\s*\}\s*\};/;

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

if (content.match(regex)) {
   content = content.replace(regex, newHandleSos);
   writeFileSync(file, content);
   console.log("Fixed handleSOS");
} else {
   console.log("Regex not found. Dumping handleSOS:");
   const match = content.match(/const handleSOS =[\s\S]{1,500}/);
   console.log(match ? match[0] : "Not found at all");
}

