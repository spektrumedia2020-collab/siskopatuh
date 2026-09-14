const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

content = content.replace("setActiveTab('manifes')", "navigate('/penyelenggara/manifes')");
content = content.replace("setActiveTab('operasional')", "navigate('/penyelenggara/operasional')");

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log("Patched navigate successfully.");
