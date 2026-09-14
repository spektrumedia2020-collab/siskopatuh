import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// The modal termin amounts are still hardcoded in some cases in Dashboard UI
const searchT2 = '<span className="font-bold text-slate-400">Rp 300.000.000</span>';
const replaceT2 = '<span className="font-bold text-slate-400">{formatRp(termin2)}</span>';

const searchT3 = '<span className="font-bold text-slate-400">Rp 450.000.000</span>';
const replaceT3 = '<span className="font-bold text-slate-400">{formatRp(termin3)}</span>';

const searchT4 = '<span className="font-bold text-slate-400">Rp 300.000.000</span>';
const replaceT4 = '<span className="font-bold text-slate-400">{formatRp(termin4)}</span>';

// In the code it appears multiple times, let's global replace
content = content.split(searchT2).join(replaceT2);
content = content.split(searchT3).join(replaceT3);
content = content.split(searchT4).join(replaceT4);

// KPI Card text fixes
// Termin1 for formatting
const searchKpi = `<h3 className="text-xl font-bold text-emerald-400">{termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)}</h3>`;
const replaceKpi = `<h3 className="text-xl font-bold text-emerald-400">{termin1 >= 1000000000000 ? (termin1/1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + ' Triliun' : termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)}</h3>`;
content = content.replace(searchKpi, replaceKpi);

writeFileSync(file, content);
console.log("Applied triliun and termin fixes!");
