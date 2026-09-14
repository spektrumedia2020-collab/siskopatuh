import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const target = `<Button size="sm" variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Berikan Teguran</Button>`;
const replacement = `<Button size="sm" onClick={() => handleSendWarning("PT. Khazanah Tamma Internasional", "Teguran Administratif: Skor Kepatuhan Rendah (Akreditasi D)")} variant="outline" className="h-8 text-xs font-bold border-rose-500/50 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Berikan Teguran</Button>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    writeFileSync(file, content);
    console.log("Fixed Berikan Teguran button!");
} else {
    console.log("Target not found");
}
