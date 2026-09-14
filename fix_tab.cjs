const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const regex = /const activeTab = [^;]+;/s;
c = c.replace(regex, `const activeTab = location.pathname.includes('/escrow') ? 'escrow' : location.pathname.includes('/manifes') ? 'manifes' : location.pathname.includes('/paket') ? 'paket' : location.pathname.includes('/operasional') ? 'operasional' : location.pathname.includes('/konsorsium') ? 'konsorsium' : location.pathname.includes('/api') ? 'api_integrasi' : 'beranda';`);

fs.writeFileSync(p, c, 'utf8');
