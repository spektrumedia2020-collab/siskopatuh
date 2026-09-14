import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Identify where `return (` starts.
const returnStart = content.indexOf('  return (\n    <div className="flex flex-col w-full text-slate-200">');

// We want to replace everything from `return (` up to `{activeTab === 'kuota' && (` with a clean version.
const targetContentRegex = /return \(\s*<div className="flex flex-col w-full text-slate-200">[\s\S]*?\{activeTab === 'kuota' && \(/;

const cleanStart = `return (
    <div className="flex flex-col w-full text-slate-200">

      {/* Global SOS Alert */}
      {sosAlerts.length > 0 && (
        <div className="bg-red-600/90 backdrop-blur border-b border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.5)] p-4 mb-6 rounded-xl flex items-center justify-between animate-pulse sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-wider">DARURAT: {sosAlerts.length} Sinyal SOS Jemaah Aktif di Lapangan!</h2>
              <p className="text-red-100 text-sm">Harap segera koordinasi dengan Konsulat Jenderal RI atau pihak penerbangan terkait indikasi penelantaran.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="font-bold" onClick={() => {
              setToastMessage({
                title: "Detail Sinyal SOS Darurat",
                desc: \`Jemaah: \${sosAlerts[0]?.nama || sosAlerts[0]?.jemaahName || 'Tidak diketahui'}\\nLokasi: \${sosAlerts[0]?.lokasi || sosAlerts[0]?.location || 'Tidak diketahui'}\\nKeterangan: \${sosAlerts[0]?.keterangan || 'N/A'}\`,
                type: "error"
              });
              setTimeout(() => setToastMessage(null), 8000);
            }}>
              Lihat Detail
            </Button>
            <Button className="font-bold bg-white text-red-600 hover:bg-red-50" onClick={async () => {
              try {
                await updateDoc(doc(db, "sos_alerts", sosAlerts[0].id), { status: "resolved" });
                setToastMessage({
                  title: "Sinyal Diselesaikan",
                  desc: "Laporan SOS berhasil ditutup dan satgas telah menangani jemaah.",
                  type: "success"
                });
                setTimeout(() => setToastMessage(null), 5000);
              } catch(e) {
                console.error(e);
              }
            }}>
              Selesai & Tutup
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'kuota' && (
        <div className="flex flex-col gap-4 flex-grow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight theme-title">Sistem Komando Kemenhaj</h1>
              <p className="text-sm text-slate-400">Pusat pemantauan lalu lintas penyelenggaraan Ibadah Haji & Umroh Nasional.</p>
            </div>
            
            {/* Upload Panduan Section */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-md">
                <Upload className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Update Panduan PDF</h3>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="file" 
                    accept=".pdf"
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 max-w-[180px]"
                    onChange={(e) => setPanduanFile(e.target.files?.[0] || null)}
                  />
                  <Button 
                    onClick={handleUploadPanduan}
                    disabled={!panduanFile || isUploadingPanduan}
                    size="sm"
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500"
                  >
                    {isUploadingPanduan ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
`;

content = content.replace(targetContentRegex, cleanStart);
writeFileSync(file, content);
console.log("Successfully fixed render");
