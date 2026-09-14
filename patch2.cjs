const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `              </form>
            )}
          </CardContent>
        </Card>
      )}`;

const replacement = `              </form>
            )}
          </CardContent>
        </Card>
        
        {/* Riwayat & Pelacakan Aduan */}
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Status Pelacakan Aduan Anda
          </h3>
          {myAduanList.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Belum ada aduan yang Anda ajukan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myAduanList.map((aduan) => {
                const isPending = aduan.progress === "Pending" || aduan.progress === "Klarifikasi";
                const isInvestigasi = aduan.progress === "Investigasi" || aduan.progress === "Mediasi" || aduan.progress === "Bareskrim";
                const isSelesai = aduan.progress === "Selesai";
                
                let badgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                if (aduan.progress === "Pending") badgeColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                else if (aduan.progress === "Klarifikasi") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
                else if (aduan.progress === "Investigasi") badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                else if (aduan.progress === "Mediasi") badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                else if (aduan.progress === "Bareskrim") badgeColor = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                else if (aduan.progress === "Selesai") badgeColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

                return (
                  <div key={aduan.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-500 mb-1">{aduan.reg} • {aduan.tanggal}</div>
                        <div className="font-bold text-slate-200 text-base">{aduan.perihal}</div>
                      </div>
                      <span className={\`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap \${badgeColor}\`}>
                        {aduan.progress}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-5 leading-relaxed">{aduan.isi}</p>
                    
                    {/* Progress Tracker */}
                    <div className="relative pt-6">
                      <div className="absolute top-8 left-6 right-6 h-0.5 bg-slate-800"></div>
                      <div className="absolute top-8 left-6 h-0.5 transition-all duration-500" style={{
                        width: isSelesai ? '100%' : isInvestigasi ? '50%' : '0%',
                        backgroundColor: isSelesai ? '#10b981' : isInvestigasi ? '#3b82f6' : 'transparent'
                      }}></div>
                      
                      <div className="flex justify-between relative z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${isPending || isInvestigasi || isSelesai ? 'bg-amber-500 ring-4 ring-slate-900' : 'bg-slate-800'}\`}></div>
                          <span className={\`text-[10px] font-bold \${isPending || isInvestigasi || isSelesai ? 'text-amber-500' : 'text-slate-500'}\`}>Pending</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${isInvestigasi || isSelesai ? 'bg-blue-500 ring-4 ring-slate-900' : 'bg-slate-800'}\`}></div>
                          <span className={\`text-[10px] font-bold \${isInvestigasi || isSelesai ? 'text-blue-500' : 'text-slate-500'}\`}>Investigasi</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={\`w-5 h-5 rounded-full flex items-center justify-center \${isSelesai ? 'bg-emerald-500 ring-4 ring-slate-900' : 'bg-slate-800'}\`}></div>
                          <span className={\`text-[10px] font-bold \${isSelesai ? 'text-emerald-500' : 'text-slate-500'}\`}>Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}`;

content = content.replace(target, replacement);
fs.writeFileSync(p, content, 'utf8');
