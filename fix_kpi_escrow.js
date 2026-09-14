import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = '<h3 className="text-xl font-bold text-emerald-400">Rp 450 Juta</h3>';
const replace = '<h3 className="text-xl font-bold text-emerald-400">{termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)}</h3>';

if (content.includes(search)) {
    content = content.replace(search, replace);
    writeFileSync(file, content);
    console.log("Updated KPI card to use dynamic termin1 value");
} else {
    console.log("Could not find the hardcoded Rp 450 Juta in KPI card");
}
