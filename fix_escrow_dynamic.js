import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Inject calculation variables at the top of the component
const searchCompStart = 'export function DashboardPenyelenggara() {';
const replaceCompStart = `export function DashboardPenyelenggara() {`;

// Insert variables before the return statement
const searchReturn = '  return (';
const replaceReturn = `  const isKemenhaj = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
  const paxCount = jemaahs.length > 0 ? jemaahs.length : 45;
  const biayaPerPax = isKemenhaj ? 87409365 : 33333333; // Real BPIH 2026 = Rp 87.409.365
  const totalEscrow = paxCount * biayaPerPax;
  const termin1 = totalEscrow * 0.3;
  const termin2 = totalEscrow * 0.2;
  const termin3 = totalEscrow * 0.3;
  const termin4 = totalEscrow * 0.2;
  
  const formatRp = (num: number) => "Rp " + Math.round(num).toLocaleString('id-ID');
  const formatJuta = (num: number) => "Rp " + (num / 1000000).toLocaleString('id-ID', {maximumFractionDigits: 1}) + " Juta";
  const formatMiliar = (num: number) => "Rp " + (num / 1000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Miliar";

  return (`;

if (content.includes(searchReturn) && !content.includes('const isKemenhaj =')) {
    content = content.replace(searchReturn, replaceReturn);
}

// Replace card values
const searchCardEscrow = `<h3 className="text-2xl font-bold text-white">Rp 450 Juta</h3>
                    <p className="text-slate-400 text-xs font-medium mt-2 leading-tight">Total Escrow (45 Jemaah &times; Rp 33,3 Juta)<br/><span className="text-slate-500 font-bold">= Rp 1,5 Miliar</span></p>`;

const replaceCardEscrow = `<h3 className="text-2xl font-bold text-white">{formatJuta(termin1)}</h3>
                    <p className="text-slate-400 text-xs font-medium mt-2 leading-tight">Total Escrow ({paxCount} Jemaah &times; {formatJuta(biayaPerPax)})<br/><span className="text-slate-500 font-bold">= {totalEscrow > 1000000000 ? formatMiliar(totalEscrow) : formatJuta(totalEscrow)}</span></p>`;
                    
content = content.replace(searchCardEscrow, replaceCardEscrow);

// Replace modal values
// 1. Pax Count
const searchModalPax = '<span className="font-bold text-white">45 Pax</span>';
const replaceModalPax = '<span className="font-bold text-white">{paxCount} Pax</span>';
content = content.replace(searchModalPax, replaceModalPax);

// 2. Biaya Per Pax
const searchModalBiaya = '<span className="font-bold text-white">Rp 33.333.333</span>';
const replaceModalBiaya = '<span className="font-bold text-white">{formatRp(biayaPerPax)}</span>';
content = content.replace(searchModalBiaya, replaceModalBiaya);

// 3. Total Escrow
const searchModalTotal = '<span className="text-lg font-bold text-emerald-400">Rp 1.500.000.000</span>';
const replaceModalTotal = '<span className="text-lg font-bold text-emerald-400">{formatRp(totalEscrow)}</span>';
content = content.replace(searchModalTotal, replaceModalTotal);

// 4. Termins
const searchT1 = '<span className="font-bold text-emerald-400">Rp 450.000.000</span>';
const replaceT1 = '<span className="font-bold text-emerald-400">{formatRp(termin1)}</span>';
content = content.replace(searchT1, replaceT1);

const searchT2 = '<span className="font-bold text-slate-300">Rp 300.000.000</span>';
const replaceT2 = '<span className="font-bold text-slate-300">{formatRp(termin2)}</span>';
content = content.replace(searchT2, replaceT2);

const searchT3 = '<span className="font-bold text-slate-300">Rp 450.000.000</span>';
const replaceT3 = '<span className="font-bold text-slate-300">{formatRp(termin3)}</span>';
content = content.split(searchT3).join(replaceT3);

const searchT4 = '<span className="font-bold text-slate-300">Rp 300.000.000</span>';
const replaceT4 = '<span className="font-bold text-slate-300">{formatRp(termin4)}</span>';
content = content.replace(searchT4, replaceT4);


writeFileSync(file, content);
console.log("Updated escrow calculation logic to be dynamic and accurate!");
