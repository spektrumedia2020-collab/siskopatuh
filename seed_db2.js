const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Seeding...');
  const direktoriData = [
    { name: 'PT. Khazzanah Al-Anshary', type: 'PIHK', status: 'Menunggu', id: 'DIR-001' },
    { name: 'PT. Mabrur Tour', type: 'PPIU', status: 'Dalam Pengawasan', id: 'DIR-002' },
    { name: 'PT. Safa Marwa', type: 'PIHK', status: 'Disetujui', id: 'DIR-003' },
  ];
  for (const d of direktoriData) {
    await setDoc(doc(db, 'direktori', d.id), d);
  }
  
  const packagesData = [
    { name: 'Paket VIP Ramadhan', statusKepulangan: 'Tunda', statusKeberangkatan: 'Selesai', id: 'PKG-001' },
    { name: 'Paket Hemat', statusKepulangan: 'Terlambat', statusKeberangkatan: 'Selesai', id: 'PKG-002' },
  ];
  for (const p of packagesData) {
    await setDoc(doc(db, 'packages', p.id), p);
  }
  
  const usersData = [
    { name: 'Zahar Djalle', role: 'jemaah', paket: 'Paket VIP Ramadhan', porsiNumber: '3277013004710011', penyelenggara: 'PT. Khazzanah Al-Anshary', id: 'USR-001' },
    { name: 'Budi Santoso', role: 'jemaah', paket: 'Paket Hemat', porsiNumber: '3277013004710012', penyelenggara: 'PT. Mabrur Tour', id: 'USR-002' },
    { name: 'Siti Aminah', role: 'jemaah', paket: 'Paket VIP Ramadhan', porsiNumber: '3277013004710013', penyelenggara: 'PT. Khazzanah Al-Anshary', id: 'USR-003' },
  ];
  for (const u of usersData) {
    await setDoc(doc(db, 'users', u.id), u);
  }
  
  console.log('Done!');
  process.exit(0);
}
seed().catch(console.error);
