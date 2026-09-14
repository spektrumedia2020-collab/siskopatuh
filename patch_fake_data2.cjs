const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const startMarker = `// Mock fallback`;
const endMarker = `]);`;

if (content.includes(startMarker) && content.includes(endMarker)) {
  const index = content.indexOf(startMarker);
  const startToReplace = content.substring(index);
  const endIndex = startToReplace.indexOf(endMarker) + endMarker.length;
  const toReplace = startToReplace.substring(0, endIndex);
  
  content = content.replace(toReplace, 'setJemaahTunda([]);');
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Mock data replaced!");
} else {
  console.log("Markers not found");
}
