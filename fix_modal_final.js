import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = '{/* Lihat Bukti Pembayaran Modal */}';
const insert = `{showEVaultModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Verifikasi E-Vault Jemaah</h3>
                <p className="text-sm text-slate-400 mt-1">{showEVaultModal.jemaahName}</p>
              </div>
              <button onClick={() => setShowEVaultModal({show: false})} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Paspor (Halaman Depan)</h4>
                    <p className="text-xs text-amber-400 font-medium">Menunggu Verifikasi</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Divalidasi", desc: "Paspor jemaah telah berhasil divalidasi.", type: "success"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Validasi</Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Ditolak", desc: "Dokumen paspor ditolak. Jemaah akan diminta mengunggah ulang.", type: "error"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Tolak</Button>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-900/30 rounded-lg flex items-center justify-center text-rose-400 border border-rose-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sertifikat Meningitis / ICV</h4>
                    <p className="text-xs text-emerald-400 font-medium">Tervalidasi (Otomatis IHC)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lihat Bukti Pembayaran Modal */}`;

if (content.includes(search)) {
    content = content.replace(search, insert);
    writeFileSync(file, content);
    console.log("Modal successfully inserted!");
} else {
    console.log("String not found!");
}

