const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const strToReplace = `      {ewsWarnings.map(warning => (`;
const newStr = `      {activeTab === 'beranda' && (
        <div className="space-y-6 flex flex-col">
      {ewsWarnings.map(warning => (`;

content = content.replace(strToReplace, newStr);

const oldBerandaStart = `      {activeTab === 'beranda' && (
        <div className="space-y-6">`;
        
// The old beranda start is now the SECOND occurrence.
const parts = content.split(oldBerandaStart);
if (parts.length > 1) {
    // We join the first two parts with nothing, effectively removing the oldBerandaStart
    content = parts[0] + parts.slice(1).join(oldBerandaStart);
}

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log("Patched layout successfully.");
