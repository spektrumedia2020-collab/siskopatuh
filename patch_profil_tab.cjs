const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetStr = `      {activeTab === 'aduan' && (`;
const insertStr = `      {activeTab === 'profil' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="theme-card border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-xl flex items-center justify-center">
                      {userData?.photoUrl ? (
                        <img src={userData.photoUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle2 className="w-16 h-16 text-slate-500" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    <input 
                      type="file" 
                      id="photo-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result;
                            try {
                              const uid = localStorage.getItem("jemaah_auth_uid");
                              if (uid) {
                                await setDoc(doc(db, "users", uid), {
                                  photoUrl: base64
                                }, { merge: true });
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400">Klik foto untuk mengubah</p>
                  </div>
                </div>

                {/* Profile Data Section */}
                <div className="flex-1 space-y-6 w-full">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{userData?.name || "Nama Jemaah"}</h2>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                      Jemaah {userData?.jenis || "Umrah"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Nomor Induk Kependudukan (NIK)</p>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.nik || "-"}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Nomor Porsi / Registrasi</p>
                        <p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">{userData?.porsi || "-"}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Nomor Telepon</p>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.phone || "-"}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                        <Map className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Alamat Tempat Tinggal</p>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.alamat || "-"}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'aduan' && (`;

content = content.replace(targetStr, insertStr);
fs.writeFileSync(p, content, 'utf8');
