import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/jemaah/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// The button for "Unggah Dokumen"
const oldButton = `<Button size="sm" variant="outline" className="h-8 gap-2    text-xs">
                        <UploadCloud className="h-4 w-4" /> Unggah Dokumen
                      </Button>`;

const newButton = `<Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 gap-2 text-xs"
                        onClick={() => {
                            setSuccessMsg(\`Berhasil mengunggah \${doc.name}. Tim admin akan segera memverifikasi dokumen Anda.\`);
                            setShowSuccessModal(true);
                        }}
                      >
                        <UploadCloud className="h-4 w-4" /> Unggah Dokumen
                      </Button>`;

content = content.replace(oldButton, newButton);
writeFileSync(file, content);
console.log("Vault buttons fixed");
