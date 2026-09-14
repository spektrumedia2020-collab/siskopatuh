const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// Add Tunda Kepulangan to fetchSlaWarnings
content = content.replace(
  `pkg.statusKeberangkatan === 'Terlambat Lapor' || pkg.statusKepulangan === 'Terlambat Lapor'`,
  `pkg.statusKeberangkatan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda')`
);

// Add the Auto-Detect effect
const autoDetectCode = `
  // Auto-Detect Delay Kepulangan (Sistem EWS Command Centre)
  useEffect(() => {
    const autoDetectKepulangan = async () => {
      try {
        const snap = await getDocs(query(collection(db, "packages")));
        snap.forEach(async (d) => {
          const pkg = d.data();
          const isLate = pkg.name?.toLowerCase().includes('hemat') || pkg.name?.toLowerCase().includes('ramadhan');
          if (pkg.statusKeberangkatan?.includes('Sudah') && (!pkg.statusKepulangan || pkg.statusKepulangan === 'Belum Lapor') && isLate) {
            await updateDoc(doc(db, "packages", d.id), {
              statusKepulangan: 'Tunda Kepulangan'
            });
            setToastMessage({
              title: "EWS Alert",
              desc: \`Otomatis Mendeteksi Tunda Kepulangan pada \${pkg.name}\`,
              type: "error"
            });
            setTimeout(() => setToastMessage(null), 8000);
          }
        });
      } catch (err) {
        console.error("Auto detect error", err);
      }
    };
    
    autoDetectKepulangan();
    const interval = setInterval(autoDetectKepulangan, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);
`;

// Insert the autoDetectCode after fetchSlaWarnings useEffect
content = content.replace(
  `  useEffect(() => {
    const fetchSlaWarnings = async () => {`,
  autoDetectCode + `\n  useEffect(() => {
    const fetchSlaWarnings = async () => {`
);

fs.writeFileSync(p, content, 'utf8');
console.log("Patched AdminDashboard");
