const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const oldHandle = `  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    const uid = localStorage.getItem("jemaah_auth_uid");
    if (uid) {
      try {
        await setDoc(doc(db, "timelines", uid), {
          pelunasanStatus: "verifying",
          updatedAt: new Date().getTime()
        }, { merge: true });
        
        const savingsDoc = await getDoc(doc(db, "savings", uid));
        const savingsData = savingsDoc.exists() ? savingsDoc.data() : {};
        const transactions = savingsData.transactions || [];
        
        transactions.push({
          date: new Date().toISOString(),
          description: "Konfirmasi Manual Pembayaran Pelunasan",
          type: "deposit (pending)",
          amount: Number(uploadAmount),
          balanceAfter: 0
        });

        await setDoc(doc(db, "savings", uid), {
          statusPelunasan: "Menunggu Verifikasi Admin",
          lastUploadAmount: uploadAmount,
          transactions: transactions
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

const newHandle = `  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const uid = localStorage.getItem("jemaah_auth_uid");
      if (uid) {
        try {
          await setDoc(doc(db, "timelines", uid), {
            pelunasanStatus: "verifying",
            updatedAt: new Date().getTime()
          }, { merge: true });
          
          const savingsDoc = await getDoc(doc(db, "savings", uid));
          const savingsData = savingsDoc.exists() ? savingsDoc.data() : {};
          const transactions = savingsData.transactions || [];
          
          transactions.push({
            date: new Date().toISOString(),
            description: "Konfirmasi Manual Pembayaran Pelunasan",
            type: "deposit (pending)",
            amount: Number(uploadAmount),
            balanceAfter: 0
          });

          await setDoc(doc(db, "savings", uid), {
            statusPelunasan: "Menunggu Verifikasi Admin",
            lastUploadAmount: uploadAmount,
            lastUploadReceipt: base64String,
            transactions: transactions
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
    };
    reader.readAsDataURL(uploadFile);
  };`;

content = content.replace(oldHandle, newHandle);
fs.writeFileSync(p, content, 'utf8');
