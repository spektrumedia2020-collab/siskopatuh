const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetModalState = `  const [showBuktiModal, setShowBuktiModal] = useState<{show: boolean, jemaahName?: string}>({show: false});`;
const replaceModalState = `  const [showBuktiModal, setShowBuktiModal] = useState<{show: boolean, jemaahName?: string, receiptBase64?: string}>({show: false});`;
content = content.replace(targetModalState, replaceModalState);

const targetBtnOpen = `                          onClick={() => setShowBuktiModal({show: true, jemaahName: j.name})}
                        >
                          Bukti Bayar
                        </Button>`;
const replaceBtnOpen = `                          onClick={async () => {
                            let receiptBase64 = null;
                            if (j.id) {
                              try {
                                const s = await getDoc(doc(db, "savings", j.id));
                                if (s.exists()) {
                                  receiptBase64 = s.data().lastUploadReceipt;
                                }
                              } catch (e) {}
                            }
                            setShowBuktiModal({show: true, jemaahName: j.name, receiptBase64});
                          }}
                        >
                          Bukti Bayar
                        </Button>`;
content = content.replace(targetBtnOpen, replaceBtnOpen);

const targetModalContent = `            <div className="p-6 space-y-4">
              <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden relative">
                {/* Simulated Image */}
                <div className="absolute inset-0 bg-slate-800 animate-pulse" />
                <div className="relative z-10 flex flex-col items-center">
                  <FileText className="h-10 w-10 text-slate-500 mb-2" />
                  <p className="text-slate-400 text-sm">Pratinjau Struk Transfer</p>
                </div>
              </div>`;
const replaceModalContent = `            <div className="p-6 space-y-4">
              <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden relative">
                {showBuktiModal.receiptBase64 ? (
                  <img src={showBuktiModal.receiptBase64} alt="Bukti Transfer" className="object-contain w-full h-full" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-slate-800" />
                    <div className="relative z-10 flex flex-col items-center">
                      <FileText className="h-10 w-10 text-slate-500 mb-2" />
                      <p className="text-slate-400 text-sm">Pratinjau Struk Transfer Kosong</p>
                    </div>
                  </>
                )}
              </div>`;
content = content.replace(targetModalContent, replaceModalContent);

fs.writeFileSync(p, content, 'utf8');
