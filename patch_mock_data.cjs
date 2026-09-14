const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// Replace directly in the UI where they render!
// Or replace the useEffects to seed dummy data if empty.
const ewsEffectTarget = `setSlaWarnings(latePackages);
          
          const delayedKepulanganPackages = allPackages.filter(pkg => pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));`;

const ewsEffectReplacement = `setSlaWarnings(latePackages);
          
          const delayedKepulanganPackages = allPackages.filter(pkg => pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
          if (delayedKepulanganPackages.length === 0) {
             // Mock fallback
             setJemaahTunda([
                { name: 'Zahar Djalle', porsi: '3277013004710011', penyelenggara: 'PT. Khazzanah Al-Anshary', paket: 'Paket VIP Ramadhan' },
                { name: 'Budi Santoso', porsi: '3277013004710012', penyelenggara: 'PT. Mabrur Tour', paket: 'Paket Hemat' },
                { name: 'Siti Aminah', porsi: '3277013004710013', penyelenggara: 'PT. Khazzanah Al-Anshary', paket: 'Paket VIP Ramadhan' }
             ]);
             return;
          }`;

const dirEffectTarget = `const snap = await getDocs(collection(db, "direktori"));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setDirektoriList(data);
        if (data.length > 0) setActivePemohon(data[0]);`;

const dirEffectReplacement = `const snap = await getDocs(collection(db, "direktori"));
        let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (data.length === 0) {
           data = [
              { name: 'PT. Khazzanah Al-Anshary', type: 'PIHK', status: 'Menunggu', id: 'DIR-001' },
              { name: 'PT. Mabrur Tour', type: 'PPIU', status: 'Dalam Pengawasan', id: 'DIR-002' },
              { name: 'PT. Safa Marwa', type: 'PIHK', status: 'Disetujui', id: 'DIR-003' },
           ];
        }
        setDirektoriList(data);
        if (data.length > 0) setActivePemohon(data[0]);`;

let newContent = content.replace(ewsEffectTarget, ewsEffectReplacement);
newContent = newContent.replace(dirEffectTarget, dirEffectReplacement);

fs.writeFileSync(p, newContent, 'utf8');
console.log('Patched mock data successfully.');
