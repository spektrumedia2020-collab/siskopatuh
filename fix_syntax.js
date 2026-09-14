import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let lines = readFileSync(file, 'utf-8').split('\n');

// Find and remove the stray </div>
for(let i = 0; i < lines.length; i++) {
   if (lines[i].includes("</div>") && lines[i+1] && lines[i+1].includes(")}")) {
       // Check if there's no matching div opening
       console.log("Found closing div at line", i+1);
       lines.splice(i, 1);
       break; // only first one for escrow
   }
}

writeFileSync(file, lines.join('\n'));
console.log("Syntax fixed?");
