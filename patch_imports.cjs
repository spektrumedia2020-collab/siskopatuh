const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const importRegex = /import \{([^}]+)\} from "lucide-react";/;
const match = content.match(importRegex);

if (match) {
  let imports = match[1];
  if (!imports.includes('ArrowUpRight')) imports += ', ArrowUpRight';
  if (!imports.includes('AlertTriangle')) imports += ', AlertTriangle';
  
  content = content.replace(importRegex, \`import {\${imports}} from "lucide-react";\`);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Imports updated successfully.");
} else {
  console.log("Could not find lucide-react import.");
}
