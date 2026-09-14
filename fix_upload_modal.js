import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/jemaah/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Add new state for the upload success modal
if (!content.includes('const [showSuccessModal, setShowSuccessModal]')) {
    content = content.replace(
        'const [uploadAmount, setUploadAmount] = useState("");',
        'const [uploadAmount, setUploadAmount] = useState("");\n  const [showSuccessModal, setShowSuccessModal] = useState(false);\n  const [successMsg, setSuccessMsg] = useState("");'
    );
}

// Replace the alert in handleUploadSubmit
const oldHandleSubmit = `const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    // In a real app, this would upload the file to Firebase Storage
    // and create a pending ledger transaction or payment request
    alert(\`Berhasil mengunggah bukti pembayaran sebesar Rp \${uploadAmount}\`);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAmount("");
  };`;

const newHandleSubmit = `const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    // In a real app, this would upload the file to Firebase Storage
    // and create a pending ledger transaction or payment request
    setSuccessMsg(\`Berhasil mengunggah bukti pembayaran sebesar Rp \${uploadAmount}. Tim admin akan melakukan verifikasi maksimal 1x24 jam.\`);
    setShowSuccessModal(true);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadAmount("");
  };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);

// Add the success modal to the JSX, right before the showSosConfirmModal
const sosModalStart = '{showSosConfirmModal && (';
const successModalJSX = `{showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-emerald-900/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-emerald-900/30 bg-emerald-950/20 text-center">
              <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400">Bukti Terkirim!</h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {successMsg}
              </p>
            </div>
            <div className="p-6">
              <Button onClick={() => setShowSuccessModal(false)} className="w-full theme-primary-bg text-emerald-950 font-bold h-12">
                TUTUP
              </Button>
            </div>
          </div>
        </div>
      )}
      
      `;

content = content.replace(sosModalStart, successModalJSX + sosModalStart);

writeFileSync(file, content);
console.log("Upload modal fixed");
