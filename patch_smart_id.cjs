const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// 1. Add state for printJemaah
const targetState = `  const [showAddJemaahModal, setShowAddJemaahModal] = useState(false);`;
const replacementState = `  const [showAddJemaahModal, setShowAddJemaahModal] = useState(false);
  const [printJemaah, setPrintJemaah] = useState<any>(null);`;
content = content.replace(targetState, replacementState);

// 2. Modify "Cetak Smart-ID" button
const targetButton = `onClick={() => { setToastMessage({
                                 title: "Cetak Smart-ID Berhasil",
                                 desc: \`Jemaah: \${j.name}\\nTravel: \${j.penyelenggara || pihkName}\\n\\nQR ini terhubung live dengan Manifes Kemenhaj dan siap dipindai.\`,
                                 type: "success"
                               });
                               setTimeout(() => setToastMessage(null), 5000);
                             }}`;
content = content.replace(targetButton, `onClick={() => setPrintJemaah(j)}`);

// 3. Add Modal Component
const modalComponent = `      {/* Cetak Smart-ID Modal */}
      {printJemaah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="print-modal bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative text-slate-900 border border-slate-200">
            
            {/* Header / Brand */}
            <div className="bg-emerald-700 p-4 flex flex-col items-center justify-center text-center text-white relative">
              <button 
                onClick={() => setPrintJemaah(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-sm tracking-widest uppercase mb-1">SMART-ID JEMAAH</h2>
              <p className="text-[10px] opacity-80">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full border-4 border-white shadow-lg -mt-12 mb-4 overflow-hidden flex items-center justify-center text-slate-400">
                <User className="w-12 h-12" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{printJemaah.name}</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-4">{printJemaah.penyelenggara || pihkName}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-left mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">No. Porsi</p>
                  <p className="text-sm font-bold text-slate-700">{printJemaah.porsi}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Paket Layanan</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{printJemaah.packageName || "Umroh Reguler"}</p>
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl inline-block">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-medium">Scan QR untuk verifikasi lapangan</p>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 print:hidden">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setPrintJemaah(null)}
              >
                Tutup
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                onClick={() => {
                  window.print();
                }}
              >
                <QrCode className="w-4 h-4 mr-2" /> Cetak Kartu ID
              </Button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: \`
            @media print {
              body * {
                visibility: hidden;
              }
              .print-modal, .print-modal * {
                visibility: visible;
              }
              .print-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none;
                border: none;
              }
            }
          \`}} />
        </div>
      )}

      {/* Tambah Jemaah Manual Modal */}`;

content = content.replace(`      {/* Tambah Jemaah Manual Modal */}`, modalComponent);

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log("Patched smart id successfully.");
