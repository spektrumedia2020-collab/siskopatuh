import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Panduan.tsx';
let content = readFileSync(file, 'utf-8');

// Replace the local defaultSections declaration with an import
const targetStart = "  const defaultSections = [";
const targetEnd = "  ];";

if (content.includes(targetStart)) {
    const startIndex = content.indexOf(targetStart);
    let temp = content.substring(startIndex);
    const endIndexOffset = temp.indexOf(targetEnd) + targetEnd.length;
    const endIndex = startIndex + endIndexOffset;
    
    content = content.substring(0, startIndex) + content.substring(endIndex);
    
    // add import at the top
    const importStatement = `import { defaultSections } from "../lib/defaultPanduanData";\n`;
    content = importStatement + content;
    
    writeFileSync(file, content);
    console.log("Panduan.tsx updated successfully.");
} else {
    console.log("Could not find defaultSections in Panduan.tsx");
}
