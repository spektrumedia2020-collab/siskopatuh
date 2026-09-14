import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const searchBtnValidasi = '<Button size="sm" variant="outline" className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">Validasi</Button>';
const replaceBtnValidasi = `<Button size="sm" variant="outline" className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Divalidasi", desc: "Paspor jemaah telah berhasil divalidasi.", type: "success"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Validasi</Button>`;

const searchBtnTolak = '<Button size="sm" variant="outline" className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10">Tolak</Button>';
const replaceBtnTolak = `<Button size="sm" variant="outline" className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Ditolak", desc: "Dokumen paspor ditolak. Jemaah akan diminta mengunggah ulang.", type: "error"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Tolak</Button>`;

content = content.replace(searchBtnValidasi, replaceBtnValidasi);
content = content.replace(searchBtnTolak, replaceBtnTolak);

writeFileSync(file, content);
console.log("Vault Validation buttons fixed");
