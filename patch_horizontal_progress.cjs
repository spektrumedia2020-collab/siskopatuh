const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `<div className="relative py-8">
                {/* Connecting Line (Background) */}
                <div className="absolute top-[48px] left-[10%] right-[10%] h-1 bg-slate-800 rounded-full"></div>
                {/* Connecting Line (Progress) */}
                <div className="absolute top-[48px] left-[10%] w-[38%] h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>

                <div className="relative z-10 flex justify-between">
                  {/* Step 1: Setoran Awal */}
                  <div className="flex flex-col items-center gap-3 w-1/5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-emerald-400">Setoran Awal</p>
                      <p className="text-[10px] text-slate-500 mt-1">Selesai</p>
                    </div>
                  </div>

                  {/* Step 2: Verifikasi BPKH */}
                  <div className="flex flex-col items-center gap-3 w-1/5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-emerald-400">Verifikasi BPKH</p>
                      <p className="text-[10px] text-slate-500 mt-1">Selesai</p>
                    </div>
                  </div>

                  {/* Step 3: Pelunasan */}
                  <div className="flex flex-col items-center gap-3 w-1/5">
                    <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 text-white relative \${timelineData?.pelunasanStatus === 'verified' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}\`}>
                      {timelineData?.pelunasanStatus !== 'verified' && (
                        <>
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></span>
                        </>
                      )}
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={\`text-xs font-bold \${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}\`}>Pelunasan Bipih</p>
                      <p className={\`text-[10px] mt-1 \${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-500/80' : 'text-amber-500/80'}\`}>
                        {timelineData?.pelunasanStatus === 'verifying' ? 'Sedang Verifikasi' : timelineData?.pelunasanStatus === 'verified' ? 'Selesai' : 'Tahap Saat Ini'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Visa & PNR */}
                  <div className="flex flex-col items-center gap-3 w-1/5 opacity-50 grayscale">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-950 text-slate-400">
                      <PlaneTakeoff className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400">Visa & Tiket</p>
                      <p className="text-[10px] text-slate-500 mt-1">Menunggu</p>
                    </div>
                  </div>

                  {/* Step 5: Keberangkatan */}
                  <div className="flex flex-col items-center gap-3 w-1/5 opacity-50 grayscale">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-950 text-slate-400">
                      <Flag className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400">Keberangkatan</p>
                      <p className="text-[10px] text-slate-500 mt-1">Menunggu</p>
                    </div>
                  </div>
                </div>
              </div>`;

const replacement = `{(() => {
                const isVisaAman = myPackage?.statusVisa === 'Terbit Seluruhnya';
                const isBerangkat = myPackage?.statusKeberangkatan?.includes('Sudah');
                const isTundaPulang = myPackage?.statusKepulangan?.includes('Tunda') || myPackage?.statusKepulangan?.includes('Terlambat');
                const isPulang = myPackage?.statusKepulangan?.includes('Sudah');
                
                // Calculate line width logic
                let lineWidth = "38%"; // Base to pelunasan
                if (timelineData?.pelunasanStatus === 'verified') {
                  if (isPulang) lineWidth = "100%";
                  else if (isTundaPulang) lineWidth = "85%";
                  else if (isBerangkat) lineWidth = "68%";
                  else if (isVisaAman) lineWidth = "52%";
                  else lineWidth = "38%";
                }

                return (
                  <div className="relative py-8">
                    {/* Connecting Line (Background) */}
                    <div className="absolute top-[48px] left-[8%] right-[8%] h-1 bg-slate-800 rounded-full"></div>
                    {/* Connecting Line (Progress) */}
                    <div className={\`absolute top-[48px] left-[8%] h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000\`} style={{width: lineWidth}}></div>

                    <div className="relative z-10 flex justify-between">
                      {/* Step 1: Setoran Awal */}
                      <div className="flex flex-col items-center gap-3 w-1/6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-emerald-400">Setoran Awal</p>
                          <p className="text-[10px] text-slate-500 mt-1">Selesai</p>
                        </div>
                      </div>

                      {/* Step 2: Verifikasi BPKH */}
                      <div className="flex flex-col items-center gap-3 w-1/6">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-emerald-400">Verifikasi BPKH</p>
                          <p className="text-[10px] text-slate-500 mt-1">Selesai</p>
                        </div>
                      </div>

                      {/* Step 3: Pelunasan */}
                      <div className="flex flex-col items-center gap-3 w-1/6">
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 text-white relative \${timelineData?.pelunasanStatus === 'verified' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}\`}>
                          {timelineData?.pelunasanStatus !== 'verified' && (
                            <>
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></span>
                            </>
                          )}
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={\`text-xs font-bold \${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}\`}>Pelunasan Bipih</p>
                          <p className={\`text-[10px] mt-1 \${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-500/80' : 'text-amber-500/80'}\`}>
                            {timelineData?.pelunasanStatus === 'verifying' ? 'Sedang Verifikasi' : timelineData?.pelunasanStatus === 'verified' ? 'Selesai' : 'Tahap Saat Ini'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Visa & PNR */}
                      <div className={\`flex flex-col items-center gap-3 w-1/6 \${!isVisaAman ? 'opacity-50 grayscale' : ''}\`}>
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 \${isVisaAman ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : timelineData?.pelunasanStatus === 'verified' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}\`}>
                          <PlaneTakeoff className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={\`text-xs font-bold \${isVisaAman ? 'text-emerald-400' : timelineData?.pelunasanStatus === 'verified' ? 'text-amber-400' : 'text-slate-400'}\`}>Visa & Tiket</p>
                          <p className="text-[10px] text-slate-500 mt-1">{isVisaAman ? 'Terkonfirmasi' : (timelineData?.pelunasanStatus === 'verified' ? 'Proses' : 'Menunggu')}</p>
                        </div>
                      </div>

                      {/* Step 5: Keberangkatan */}
                      <div className={\`flex flex-col items-center gap-3 w-1/6 \${!isBerangkat && !isVisaAman ? 'opacity-50 grayscale' : ''}\`}>
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 \${isBerangkat ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isVisaAman ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}\`}>
                          <Flag className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={\`text-xs font-bold \${isBerangkat ? 'text-emerald-400' : isVisaAman ? 'text-amber-400' : 'text-slate-400'}\`}>Keberangkatan</p>
                          <p className="text-[10px] text-slate-500 mt-1">{isBerangkat ? 'Sudah Berangkat' : isVisaAman ? 'Tahap Saat Ini' : 'Menunggu'}</p>
                        </div>
                      </div>

                      {/* Step 6: Kepulangan */}
                      <div className={\`flex flex-col items-center gap-3 w-1/6 \${!isPulang && !isBerangkat ? 'opacity-50 grayscale' : ''}\`}>
                        <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 \${isPulang ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isTundaPulang ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(243,33,33,0.3)] animate-pulse' : isBerangkat ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}\`}>
                          {isTundaPulang ? <AlertTriangle className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <div className="text-center">
                          <p className={\`text-xs font-bold \${isPulang ? 'text-emerald-400' : isTundaPulang ? 'text-rose-400' : isBerangkat ? 'text-amber-400' : 'text-slate-400'}\`}>Kepulangan</p>
                          <p className={\`text-[10px] mt-1 \${isTundaPulang ? 'text-rose-400' : 'text-slate-500'}\`}>{isPulang ? 'Tiba di Tanah Air' : isTundaPulang ? 'Tunda (Deteksi EWS)' : isBerangkat ? 'Tahap Saat Ini' : 'Menunggu'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}`;

if (content.includes('Step 1: Setoran Awal') && content.includes('Step 5: Keberangkatan')) {
  // Try exact replace
  if (content.indexOf(target) !== -1) {
    content = content.replace(target, replacement);
    fs.writeFileSync(p, content, 'utf8');
    console.log("Patched horizontal progress exactly.");
  } else {
    console.log("Target string mismatch, let's use regex.");
    // regex replace
    const regex = /<div className="relative py-8">[\s\S]*?{userData\?.jenis === "Haji Reguler" \? \(/g;
    // this would be messy, so let's just do a manual string cut
    const startIndex = content.indexOf('<div className="relative py-8">');
    let endIndex = content.indexOf('<!-- Status Banner -->');
    if (endIndex === -1) {
        endIndex = content.indexOf('{/* Status Banner */}');
    }
    if (startIndex !== -1 && endIndex !== -1) {
       const before = content.substring(0, startIndex);
       const after = content.substring(endIndex);
       content = before + replacement + "\n              " + after;
       fs.writeFileSync(p, content, 'utf8');
       console.log("Patched horizontal progress via substring.");
    } else {
       console.log("Could not find start/end.");
    }
  }
} else {
  console.log("Could not find content to patch.");
}
