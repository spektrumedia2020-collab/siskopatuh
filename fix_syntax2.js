import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const regex2 = /<p className="text-sm text-slate-400 mt-1">Sinyal Peringatan Dini &amp; Status Darurat Jemaah<\/p>\s*<\/div>\s*<\/div>\s*\s*\}\)/;

// Wait, the ampersand in code is literal "&", not "&amp;".
const regex3 = /<p className="text-sm text-slate-400 mt-1">Sinyal Peringatan Dini & Status Darurat Jemaah<\/p>[\s\S]*?\}\)/;

content = content.replace(regex3, '<p className="text-sm text-slate-400 mt-1">Sinyal Peringatan Dini & Status Darurat Jemaah</p>\n            </div>\n          </div>\n        </div>\n      )}');

writeFileSync(file, content);
console.log("Replaced using regex3.");
