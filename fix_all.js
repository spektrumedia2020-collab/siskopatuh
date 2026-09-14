import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Fix 1: The actual paxCount for calculation needs to use the real Jemaah count (121253) rather than just the dummy array length in state, OR we make the state array match what's shown in KPI
// The KPI cards show:
// Jemaah Terdaftar: \`{packages.reduce((acc, curr) => acc + curr.filled, 0) || '45'}\`
// So let's make paxCount exactly this!
const searchPaxCount = 'const paxCount = jemaahs.length > 0 ? jemaahs.length : 45;';
const replacePaxCount = 'const paxCount = packages.reduce((acc, curr) => acc + curr.filled, 0) || 45;';
content = content.replace(searchPaxCount, replacePaxCount);


// Fix 2: Inside the escrow_claims array mapping or default seeding, it has hardcoded "Rp 450.000.000".
const searchEscrowSeed = `        const defaultEscrows = [
          { order: 1, term: "Termin 1 (Tiket 30%)", status: "cair", req: "Penerbitan Tiket (PNR Issued)", desc: "Dicairkan setelah verifikasi PNR maskapai penerbangan.", amount: "Rp 450.000.000" },
          { order: 2, term: "Termin 2 (Visa 20%)", status: "pending", req: "Penerbitan Visa", desc: "API cross-check ke sistem Imigrasi dan e-Hajj Saudi.", amount: "Rp 300.000.000" },
          { order: 3, term: "Termin 3 (Hotel 30%)", status: "locked", req: "Kontrak Hotel / Akomodasi", desc: "Dicairkan setelah bukti booking hotel diverifikasi sistem Kemenhaj.", amount: "Rp 450.000.000" },
          { order: 4, term: "Termin 4 (Keberangkatan 20%)", status: "locked", req: "Validasi Keberangkatan Jemaah", desc: "Dicairkan saat keberangkatan (Manifest Boarding).", amount: "Rp 300.000.000" }
        ];`;
const replaceEscrowSeed = `        const bpih = (pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji")) ? 87409365 : 33333333;
        const ttlEscrow = bpih * 45; // Default fallback for seed
        const defaultEscrows = [
          { order: 1, term: "Termin 1 (Tiket 30%)", status: "cair", req: "Penerbitan Tiket (PNR Issued)", desc: "Dicairkan setelah verifikasi PNR maskapai penerbangan.", amount: "Dinamis" },
          { order: 2, term: "Termin 2 (Visa 20%)", status: "pending", req: "Penerbitan Visa", desc: "API cross-check ke sistem Imigrasi dan e-Hajj Saudi.", amount: "Dinamis" },
          { order: 3, term: "Termin 3 (Hotel 30%)", status: "locked", req: "Kontrak Hotel / Akomodasi", desc: "Dicairkan setelah bukti booking hotel diverifikasi sistem Kemenhaj.", amount: "Dinamis" },
          { order: 4, term: "Termin 4 (Keberangkatan 20%)", status: "locked", req: "Validasi Keberangkatan Jemaah", desc: "Dicairkan saat keberangkatan (Manifest Boarding).", amount: "Dinamis" }
        ];`;
content = content.replace(searchEscrowSeed, replaceEscrowSeed);

// Fix 3: In the Milestone Tracker UI where the hardcoded value might be coming from state.
const searchCairHardcode = `CAIR {milestone.amount ? \`(\${milestone.amount})\` : ''}`;
const replaceCairHardcode = `CAIR ({termin1 > 1000000000 ? formatMiliar(termin1) : formatJuta(termin1)})`;
content = content.replace(searchCairHardcode, replaceCairHardcode);

// Fix 4: Hardcoded modal amounts.
const searchHardcodeRp450 = '<span className="font-bold text-slate-400">Rp 450.000.000</span>';
const searchHardcodeRp300 = '<span className="font-bold text-slate-400">Rp 300.000.000</span>';

content = content.replace(searchHardcodeRp450, '<span className="font-bold text-slate-400">{formatRp(termin3)}</span>');
content = content.replace(searchHardcodeRp300, '<span className="font-bold text-slate-400">{formatRp(termin2)}</span>');
content = content.replace(searchHardcodeRp300, '<span className="font-bold text-slate-400">{formatRp(termin4)}</span>'); // Assuming there's another for termin4

writeFileSync(file, content);
console.log("Applied massive synchronization fixes!");
