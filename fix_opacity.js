import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

content = content.replace('theme-text-body/70 opacity-80', 'text-slate-400 mt-1');

writeFileSync(file, content);
console.log("Fixed opacity class.");
