import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Replace formatter functions
const oldFormatters = `  const formatRp = (num: number) => "Rp " + Math.round(num).toLocaleString('id-ID');
  const formatJuta = (num: number) => "Rp " + (num / 1000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + " Juta";
  const formatMiliar = (num: number) => "Rp " + (num / 1000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Miliar";`;

const newFormatters = `  const formatRp = (num: number) => "Rp " + Math.round(num).toLocaleString('id-ID');
  const formatCurrencyShort = (num: number) => {
    if (num >= 1000000000000) {
      return "Rp " + (num / 1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Triliun";
    } else if (num >= 1000000000) {
      return "Rp " + (num / 1000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Miliar";
    } else if (num >= 1000000) {
      return "Rp " + (num / 1000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Juta";
    }
    return "Rp " + Math.round(num).toLocaleString('id-ID');
  };`;

content = content.replace(oldFormatters, newFormatters);

// KPI Card
const kpiSearch = `{termin1 >= 1000000000000 ? 'Rp ' + (termin1/1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + ' Triliun' : termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)}`;
content = content.replace(kpiSearch, `{formatCurrencyShort(termin1)}`);

const kpiSearch2 = `{termin1 >= 1000000000000 ? (termin1/1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + ' Triliun' : termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)}`;
content = content.replace(kpiSearch2, `{formatCurrencyShort(termin1)}`);

// Middle Card "Dana Tercairkan"
content = content.replace('{formatJuta(termin1)}', '{formatCurrencyShort(termin1)}');

const descSearch = `Total Escrow ({paxCount} Jemaah &times; {formatJuta(biayaPerPax)})<br/><span className="text-slate-500 font-bold">= {totalEscrow > 1000000000 ? formatMiliar(totalEscrow) : formatJuta(totalEscrow)}</span>`;
const descReplace = `Total Escrow ({paxCount.toLocaleString('id-ID')} Jemaah &times; {formatCurrencyShort(biayaPerPax)})<br/><span className="text-slate-500 font-bold">= {formatCurrencyShort(totalEscrow)}</span>`;
content = content.replace(descSearch, descReplace);

// CAIR Label
const labelSearch = `CAIR ({termin1 >= 1000000000000 ? 'Rp ' + (termin1/1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + ' Triliun' : termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)})`;
content = content.replace(labelSearch, `CAIR ({formatCurrencyShort(termin1)})`);

writeFileSync(file, content);
console.log("Formatting is perfect now!");
