const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `transactions.push({
            date: new Date().toISOString(),
            description: "Konfirmasi Manual Pembayaran Pelunasan",
            type: "deposit (pending)",
            amount: Number(uploadAmount),
            balanceAfter: 0
          });`;

const replacement = `const newTotal = (savingsData.totalBalance || 0) + Number(uploadAmount);
          transactions.push({
            date: new Date().toISOString(),
            description: "Konfirmasi Manual Pembayaran Pelunasan",
            type: "deposit (pending)",
            amount: Number(uploadAmount),
            balanceAfter: newTotal
          });
          savingsData.totalBalance = newTotal;
          `;

if (content.indexOf(target) !== -1) {
  content = content.replace(target, replacement);
  
  // also modify the db update
  content = content.replace(
  `await setDoc(doc(db, "savings", uid), {
            statusPelunasan: "Menunggu Verifikasi Admin",
            lastUploadAmount: uploadAmount,
            lastUploadReceipt: base64String,
            transactions: transactions
          }, { merge: true });`,
  `await setDoc(doc(db, "savings", uid), {
            statusPelunasan: "Menunggu Verifikasi Admin",
            lastUploadAmount: uploadAmount,
            lastUploadReceipt: base64String,
            totalBalance: newTotal,
            transactions: transactions
          }, { merge: true });`
  );

  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched transactions push");
} else {
  console.log("Not found transaction push");
}
