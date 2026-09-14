const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetJemaahTunda = `          if (delayedKepulanganPackages.length === 0) { 
             // Mock fallback 
             setJemaahTunda([
                { name: 'Zahar Djalle', porsi: '3277013004710011', penyelenggara: 'PT. Khazzanah Al-Anshary', paket: 'Paket VIP Ramadhan' },
                { name: 'Budi Santoso', porsi: '3277013004710012', penyelenggara: 'PT. Mabrur Tour', paket: 'Paket Hemat' },
                { name: 'Siti Aminah', porsi: '3277013004710013', penyelenggara: 'PT. Khazzanah Al-Anshary', paket: 'Paket VIP Ramadhan' }
             ]);
             return;
          }`;

const replaceJemaahTunda = `          if (delayedKepulanganPackages.length === 0) { 
             setJemaahTunda([]);
             return;
          }`;

const targetButton = `                  <Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white mt-6" onClick={() => {
                    setToastMessage({title: 'Ping dari Mobile App!', desc: 'Petugas lapangan Budi_CGK baru saja menscan jemaah a.n Zahar Djalle.', type: 'success'});
                  }}>
                    <SmartphoneNfc className="w-4 h-4 mr-2" /> Simulasi Ping dari Mobile
                  </Button>`;

if (content.includes(targetJemaahTunda)) {
  content = content.replace(targetJemaahTunda, replaceJemaahTunda);
  console.log('Replaced JemaahTunda mock');
} else {
  console.log('Could not find JemaahTunda mock');
}

if (content.includes(targetButton)) {
  content = content.replace(targetButton, '');
  console.log('Replaced Simulation button');
} else {
  console.log('Could not find Simulation button');
}

fs.writeFileSync(dashboardPath, content, 'utf8');
