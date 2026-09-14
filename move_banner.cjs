const fs = require('fs');
const path = require('path');

const p = path.resolve('src/pages/PublicLanding.tsx');
let lines = fs.readFileSync(p, 'utf8').split('\n');

const startIndex = lines.findIndex(l => l.includes('{/* Kewajiban PPIU PIHK Banner */}'));
const endIndex = startIndex + 21; // The banner is 22 lines long (index to index + 21)

// Extract the banner
const bannerLines = lines.splice(startIndex, 22);

// Find destination
const destIndex = lines.findIndex(l => l.includes('{/* Action Items Moved from Hero */}'));

// Insert the banner before the destination
lines.splice(destIndex, 0, ...bannerLines);

fs.writeFileSync(p, lines.join('\n'), 'utf8');
