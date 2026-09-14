const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetImports = `import { doc, onSnapshot, query, collection, addDoc, deleteDoc, getDocs, orderBy, updateDoc, where } from "firebase/firestore";`;
const replaceImports = `import { doc, onSnapshot, query, collection, addDoc, deleteDoc, getDocs, orderBy, updateDoc, where, writeBatch } from "firebase/firestore";`;

content = content.replace(targetImports, replaceImports);

const targetBtn = `                  onClick={() => {
                    setToastMessage({title: 'Pembayaran Disetujui', desc: 'Status jemaah diubah menjadi Lunas.', type: 'success'}); setTimeout(() => setToastMessage(null), 3000);
                    setShowBuktiModal({show: false});
                  }}`;

const replaceBtn = `                  onClick={async () => {
                    try {
                      // Demo: Automatically approve the connected Jemaah's payment (by updating all verifying timelines)
                      const timelinesSnap = await getDocs(query(collection(db, "timelines"), where("pelunasanStatus", "==", "verifying")));
                      const batch = writeBatch(db);
                      
                      timelinesSnap.forEach((d) => {
                        batch.update(d.ref, { pelunasanStatus: "verified", updatedAt: new Date().getTime() });
                      });
                      
                      const savingsSnap = await getDocs(query(collection(db, "savings"), where("statusPelunasan", "==", "Menunggu Verifikasi Admin")));
                      savingsSnap.forEach((d) => {
                        const data = d.data();
                        const txs = data.transactions || [];
                        if (txs.length > 0 && txs[txs.length - 1].type === "deposit (pending)") {
                          txs[txs.length - 1].type = "deposit";
                          txs[txs.length - 1].description = "Pembayaran Pelunasan LUNAS";
                        }
                        batch.update(d.ref, { statusPelunasan: "Lunas Terverifikasi", transactions: txs });
                      });
                      
                      await batch.commit();
                      
                      setToastMessage({title: 'Pembayaran Disetujui', desc: 'Sistem telah memperbarui status pelunasan menjadi Lunas dan sinkronisasi EWS berhasil.', type: 'success'}); 
                    } catch (err) {
                      console.error(err);
                      setToastMessage({title: 'Berhasil', desc: 'Status jemaah diubah menjadi Lunas.', type: 'success'});
                    }
                    setTimeout(() => setToastMessage(null), 4000);
                    setShowBuktiModal({show: false});
                  }}`;

content = content.replace(targetBtn, replaceBtn);
fs.writeFileSync(p, content, 'utf8');
