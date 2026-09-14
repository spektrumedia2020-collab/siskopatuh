const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
  'import { doc, getDoc, onSnapshot, query, where, collection, addDoc } from "firebase/firestore";',
  'import { doc, getDoc, onSnapshot, query, where, collection, addDoc, setDoc } from "firebase/firestore";'
);

const oldSubmit = `  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    // In a real app, this would upload the file to Firebase Storage
    // and create a pending ledger transaction or payment request
    setSuccessMsg(\`Berhasil mengunggah bukti pembayaran sebesar Rp \${uploadAmount}. Tim admin akan melakukan verifikasi maksimal 1x24 jam.\`);
    setShowSuccessModal(true);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAmount("");
  };`;

const newSubmit = `  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    const uid = localStorage.getItem("jemaah_auth_uid");
    if (uid) {
      try {
        await setDoc(doc(db, "timelines", uid), {
          pelunasanStatus: "verifying",
          updatedAt: new Date().getTime()
        }, { merge: true });
        
        await setDoc(doc(db, "savings", uid), {
          statusPelunasan: "Menunggu Verifikasi Admin",
          lastUploadAmount: uploadAmount
        }, { merge: true });
      } catch (err) {
        console.error(err);
      }
    }

    setSuccessMsg(\`Berhasil mengunggah bukti pembayaran sebesar Rp \${uploadAmount}. Tim admin akan melakukan verifikasi maksimal 1x24 jam.\`);
    setShowSuccessModal(true);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAmount("");
  };`;

content = content.replace(oldSubmit, newSubmit);

fs.writeFileSync(p, content, 'utf8');
