import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = '<span className="text-sm text-slate-300">Biaya Paket Umrah (Rata-rata)</span>';
const replace = '<span className="text-sm text-slate-300">{pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji") ? "Biaya Penyelenggaraan Ibadah Haji (BPIH)" : "Biaya Paket Umrah (Rata-rata)"}</span>';

if (content.includes(search)) {
    content = content.replace(search, replace);
    writeFileSync(file, content);
    console.log("Updated escrow modal label!");
} else {
    console.log("Could not find label");
}
