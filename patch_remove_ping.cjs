const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetButton = `<Button className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => {
                    setToastMessage({title: 'Ping dari Mobile App!', desc: 'Petugas lapangan Budi_CGK baru saja menscan jemaah a.n Zahar Djalle.', type: 'success'});
                    recordAdminLog('Menerima live feed pemindaian ID Jemaah dari perangkat mobile petugas Budi_CGK.');
                  }}>
                    <SmartphoneNfc className="w-4 h-4 mr-2" /> Simulasi Ping dari Mobile
                  </Button>`;

const newButton = `<a href="/petugas-scanner" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center h-10 px-4 py-2 rounded-md font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-colors shadow-lg shadow-emerald-900/20">
                    <SmartphoneNfc className="w-4 h-4 mr-2" /> Buka App Mobile (Scanner)
                  </a>`;

if (content.indexOf('Simulasi Ping dari Mobile') !== -1) {
  content = content.replace(targetButton, newButton);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Replaced ping button with link to scanner app");
}
