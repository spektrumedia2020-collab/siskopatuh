import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `CAIR ({termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)})`;
const replace = `CAIR ({termin1 >= 1000000000000 ? 'Rp ' + (termin1/1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + ' Triliun' : termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)})`;
content = content.replace(search, replace);

writeFileSync(file, content);
console.log("Applied triliun to label");
