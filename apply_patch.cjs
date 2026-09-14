const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const patchContent = fs.readFileSync('tabs_patch.tsx', 'utf8');

const targetStr = "{activeTab === 'ews' && (";
if (content.includes(targetStr)) {
  content = content.replace(targetStr, patchContent + "\n\n" + targetStr);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log('Patch applied successfully.');
} else {
  console.log('Target string not found!');
}
