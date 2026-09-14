const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `      try {
        await setDoc(doc(db, "timelines", uid), {
          pelunasanStatus: "verifying",
          updatedAt: new Date().getTime()
        }, { merge: true });
        
        await setDoc(doc(db, "savings", uid), {
          statusPelunasan: "Menunggu Verifikasi Admin",
          lastUploadAmount: uploadAmount
        }, { merge: true });
      } catch (err) {`;

const replace = `      try {
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
      } catch (err) {`;

content = content.replace(target, replace);
fs.writeFileSync(p, content, 'utf8');
