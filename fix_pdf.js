import fs from 'fs';
const base64 = fs.readFileSync('public/Panduan_SISKOPATUH_V2.pdf', 'base64');
const dataUrl = `data:application/pdf;base64,${base64}`;
fs.writeFileSync('src/lib/defaultPdf.ts', `export const defaultPdfBase64 = "${dataUrl}";`);
