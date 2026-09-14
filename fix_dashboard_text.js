import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Toast / alert for cheap package
const search1 = "standar minimal referensi BPIU (Rp 28.000.000). Hal ini untuk mencegah risiko 'Umrah Murah' berindikasi penipuan";
const replace1 = "standar minimal referensi biaya (Rp 28.000.000). Hal ini untuk mencegah risiko paket sangat murah yang berindikasi kegagalan keberangkatan";
content = content.replace(search1, replace1);

// 2. Notification title
const search2 = "Pendaftar Umroh Baru!";
const replace2 = "Pendaftar Baru!";
content = content.replace(search2, replace2);

// 3. Fallback package name
const search3 = 'packages[0].name : "Umroh Reguler 9 Hari"';
const replace3 = 'packages[0].name : (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari")';
content = content.split(search3).join(replace3);

const search4 = 'data.paket || "Umroh Reguler 9 Hari"';
const replace4 = 'data.paket || (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari")';
content = content.split(search4).join(replace4);

// 4. Default mock packages if they are empty
const search5 = '{ name: "Umroh Reguler 9 Hari"';
const replace5 = '{ name: pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari"';
content = content.replace(search5, replace5);

writeFileSync(file, content);
console.log("Updated texts for Umroh / Haji Reguler generalization!");
