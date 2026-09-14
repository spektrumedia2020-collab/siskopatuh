import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const badBlock = `    const isKemenhaj = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
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

`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, "");
}

const goodBlock = `  const isKemenhaj = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
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

// Only replace the FIRST '  return (' after line 200 to be safe.
const lines = content.split('\n');
let replaced = false;
for (let i = 250; i < lines.length; i++) {
    if (lines[i] === '  return (' && !replaced) {
        lines[i] = goodBlock;
        replaced = true;
        break;
    }
}
content = lines.join('\n');
writeFileSync(file, content);
console.log("Fixed scope properly");
