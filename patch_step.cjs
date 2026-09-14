const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStepLogic = `                let step = 1;
                if (isVisaAman || isTiketAman || isHotelAman) step = 2;
                if (isVisaAman && isTiketAman && isHotelAman) step = 3;`;

const newStepLogic = `                let step = 1;
                if (isVisaAman || isTiketAman || isHotelAman) step = 2;
                if (isVisaAman && isTiketAman && isHotelAman) step = 3;
                if (step === 3 && myPackage.statusKeberangkatan === 'Sudah Berangkat') step = 4;
                if (step === 4 && myPackage.statusKepulangan === 'Sudah Pulang') step = 5;`;
content = content.replace(targetStepLogic, newStepLogic);

const targetText = `                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-sm font-bold text-white mb-1">
                          {step === 3 ? "Persiapan Keberangkatan Selesai!" : "Penyelenggara sedang mengurus persiapan keberangkatan Anda."}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {step === 3 ? "Visa, Tiket pesawat, dan Hotel telah diamankan. Silakan tunggu jadwal manasik dan keberangkatan." : "Tim travel Anda sedang memproses kelengkapan dokumen perjalanan dan akomodasi. Sistem Kemenhaj memantau proses ini."}
                        </p>
                      </div>`;
                      
const newText = `                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-sm font-bold text-white mb-1">
                          {step === 5 ? "Alhamdulillah, Ibadah Selesai!" : step === 4 ? "Anda Sedang Menjalankan Ibadah" : step === 3 ? "Persiapan Keberangkatan Selesai!" : "Penyelenggara sedang mengurus persiapan keberangkatan Anda."}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {step === 5 ? "Selamat kembali ke Tanah Air. Semoga menjadi mabrur." : step === 4 ? "Sistem sedang memantau jadwal kepulangan Anda." : step === 3 ? "Visa, Tiket pesawat, dan Hotel telah diamankan. Silakan tunggu jadwal manasik dan keberangkatan." : "Tim travel Anda sedang memproses kelengkapan dokumen perjalanan dan akomodasi. Sistem Kemenhaj memantau proses ini."}
                        </p>
                      </div>`;
content = content.replace(targetText, newText);

fs.writeFileSync(p, content, 'utf8');
