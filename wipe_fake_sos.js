import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// The fake SOS banner has `<div className="bg-rose-600 border border-rose-500 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-rose-900/20">`
const fakeSosRegex = /<div className="bg-rose-600 border border-rose-500 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-rose-900\/20">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;

content = content.replace(fakeSosRegex, '');
writeFileSync(file, content);
console.log("Successfully wiped fake SOS banners");
