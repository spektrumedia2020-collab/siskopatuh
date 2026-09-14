const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

content = content.replace("tickFormatter={(val) => \\`\\${val/1000}k\\`}", "tickFormatter={(val) => `${val/1000}k`}");

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log('Fixed backticks.');
