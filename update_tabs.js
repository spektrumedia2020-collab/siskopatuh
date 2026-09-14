import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const oldTabs = `  const activeTab = location.pathname.includes('/escrow') 
    ? 'escrow' 
    : location.pathname.includes('/manifes') 
      ? 'manifes' 
      : location.pathname.includes('/paket')
        ? 'paket'
        : location.pathname.includes('/operasional')
          ? 'operasional'
          : 'beranda';`;

const newTabs = `  const activeTab = location.pathname.includes('/escrow') 
    ? 'escrow' 
    : location.pathname.includes('/manifes') 
      ? 'manifes' 
      : location.pathname.includes('/paket')
        ? 'paket'
        : location.pathname.includes('/operasional')
          ? 'operasional'
          : location.pathname.includes('/konsorsium')
            ? 'konsorsium'
            : 'beranda';`;

content = content.replace(oldTabs, newTabs);
writeFileSync(file, content);
console.log("Updated activeTab!");
