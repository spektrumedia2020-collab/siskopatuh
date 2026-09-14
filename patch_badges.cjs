const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(
  /className=\{`px-3 py-1\.5 rounded-full text-\[10px\] font-bold border \$\{get/g,
  'className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold border ${get'
);

fs.writeFileSync(p, content, 'utf8');
