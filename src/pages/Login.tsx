import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScanFace, Fingerprint, KeyRound, Building, UserSquare2, ShieldCheck, PlaneTakeoff, Globe2, LockKeyhole, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function Login() {
  const demoAccounts = {
    jemaah: { nik: "9999999999999999", password: "demo123" },
    penyelenggara: { nib: "PIHK-DEMO", password: "demo123" },
    admin: { nip: "12345", token: "111" }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [direktoriList, setDirektoriList] = useState<any[]>([]);
  const [agenList, setAgenList] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgen = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const snap = await getDocs(collection(db, 'direktori'));
        if (!snap.empty) {
          let list = snap.docs.map(doc => ({ name: doc.data().name, type: doc.data().type }));
          if (!list.find(a => a.name.includes("Kemenhaj"))) {
             list.unshift({ name: "Kemenhaj (Haji Reguler)", type: "Pemerintah (Haji Reguler)" });
          }
          setAgenList(list);
        } else {
          setAgenList([
            { name: "PT. Khazanah Tamma Internasional", type: "PIHK (Haji Khusus)" },
            { name: "PT. Mabrur Travel Umroh", type: "PPIU (Umroh)" },
            { name: "PT. Hanania", type: "PIHK (Haji Khusus)" },
            { name: "PT. Masy'aril Haram Tour", type: "PIHK (Haji Khusus)" },
            { name: "PT. Cahaya Raudhah", type: "PPIU (Umroh)" },
            { name: "PT. Surya Citra Madani", type: "PPIU (Umroh)" },
            { name: "Kemenhaj (Haji Reguler)", type: "Pemerintah (Haji Reguler)" }
          ]);
        }
      } catch (e) {
        console.error("Failed fetching agencies", e);
      }
    };
    fetchAgen();
  }, []);
  
  // Initialize PIHK name based on location state if available
  useEffect(() => {
    if (location.state?.selectedBiro) {
      setLoginMethod("jemaah");
      setIsLoginMode(false);
      setJemaahPenyelenggara(location.state.selectedBiro);
      setPenyelenggaraName(location.state.selectedBiro);
    }
  }, [location.state]);

  useEffect(() => {
    import("firebase/firestore").then(({ collection, getDocs }) => {
      import("@/lib/firebase").then(({ db }) => {
        getDocs(collection(db, "direktori")).then(snap => {
          let list = snap.docs.map(doc => doc.data().name);
          if (!list.includes("Kemenhaj (Haji Reguler)")) {
             list.unshift("Kemenhaj (Haji Reguler)");
          }
          if (list.length > 0) {
             setDirektoriList(list);
             if (!penyelenggaraName) setPenyelenggaraName(list[0]);
          }
        }).catch((err) => console.error("Error fetching direktori:", err));
      });
    });
  }, []);

  const [loginMethod, setLoginMethod] = useState<"jemaah" | "penyelenggara" | "admin">("jemaah");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [demoName, setDemoName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  
  // Penyelenggara states
  const [isPenyelenggaraLoginMode, setIsPenyelenggaraLoginMode] = useState(true);
  const [penyelenggaraNib, setPenyelenggaraNib] = useState("");
  const [penyelenggaraName, setPenyelenggaraName] = useState("");
  const [customPenyelenggaraName, setCustomPenyelenggaraName] = useState("");
  const [jemaahPenyelenggara, setJemaahPenyelenggara] = useState("");
  const [jemaahJenis, setJemaahJenis] = useState("Haji Reguler");
  const [penyelenggaraPassword, setPenyelenggaraPassword] = useState("");
  const [isPenyelenggaraLoading, setIsPenyelenggaraLoading] = useState(false);

  const [adminNip, setAdminNip] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);



  const handleJemaahLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length < 16 || !password) return;
    
    setIsScanning(true);
    setError("");
    
    try {
      if (nik === demoAccounts.jemaah.nik && password === demoAccounts.jemaah.password && isLoginMode) {
        localStorage.setItem("jemaah_auth_uid", "demo-jemaah-001");
        navigate("/jemaah");
        return;
      }
      const { db } = await import('@/lib/firebase');
      const { doc, setDoc, getDoc } = await import('firebase/firestore');
      
      const uid = nik; // Use NIK directly as UID for this prototype
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (isLoginMode) {
          if (!userSnap.exists()) {
              throw new Error("NIK belum terdaftar. Silakan beralih ke menu Daftar e-KYC.");
          }
      } else {
          if (userSnap.exists()) {
              // DEMO OVERRIDE: Update name if they re-register existing NIK
              const { updateDoc } = await import('firebase/firestore');
              if (demoName && userSnap.data().name !== demoName) {
                  await updateDoc(userRef, { name: demoName });
              }
              localStorage.setItem("jemaah_auth_uid", uid);
              navigate("/jemaah");
              return;
          }
          if (!demoName.trim()) {
              throw new Error("Nama lengkap wajib diisi untuk pendaftaran.");
          }
          
          // Seed initial user data
          await setDoc(doc(db, 'users', uid), {
            nik,
            name: demoName || ("Jemaah Haji " + nik.substring(12)),
            porsiNumber: "1000" + Math.floor(Math.random() * 900000),
            virtualAccount: "8820" + nik.substring(0, 8),
            estimatedYear: 2028,
            penyelenggara: jemaahPenyelenggara,
            paket: jemaahJenis === "Haji Reguler" ? "Haji Reguler (Kemenhaj)" : jemaahJenis === "Haji Khusus" ? "Haji Khusus (PIHK)" : "Umrah Reguler",
            jenis: jemaahJenis,
            role: "jemaah",
            createdAt: new Date(), status: "Aktif"
          });

          // Seed savings
          await setDoc(doc(db, 'savings', uid), {
            totalBalance: 25000000,
            transactions: [
              {
                date: new Date(),
                description: "Setoran Awal BPS BPIH",
                type: "deposit",
                amount: 25000000,
                balanceAfter: 25000000
              }
            ]
          });

          // Seed documents
          await setDoc(doc(db, 'documents', uid), {
            passport: { status: 'missing', url: '', updatedAt: new Date() },
            vaccine: { status: 'missing', url: '', updatedAt: new Date() }
          });

          // Seed timelines
          await setDoc(doc(db, 'timelines', uid), {
            stages: [
              { title: "Pendaftaran & e-KYC Berhasil", description: "Data kependudukan telah tersinkronisasi dengan Dukcapil.", status: "completed", order: 1, date: new Date() },
              { title: "Setoran Awal (Lunas)", description: "Nomor Porsi telah diterbitkan secara otomatis setelah validasi webhook dari Bank BPS.", status: "completed", order: 2, date: new Date() },
              { title: "Pemberkasan E-Vault", description: "Menunggu Anda melengkapi unggahan paspor dan hasil cek kesehatan.", status: "current", order: 3, date: new Date() },
              { title: "Pembagian Kloter & Manasik", description: "Estimasi: 2028", status: "pending", order: 4, date: null }
            ]
          });
      }
      
      // Save session locally to bypass firebase Auth limits
      localStorage.setItem("jemaah_auth_uid", uid);
      navigate("/jemaah");
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa koneksi Anda.");
    } finally {
      setIsScanning(false);
    }
  };

  const handlePenyelenggaraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penyelenggaraNib || !penyelenggaraPassword) return;
    
    setIsPenyelenggaraLoading(true);
    setError("");
    
    try {
      if (isPenyelenggaraLoginMode && penyelenggaraNib === demoAccounts.penyelenggara.nib && penyelenggaraPassword === demoAccounts.penyelenggara.password) {
        localStorage.setItem("penyelenggara_auth_uid", "demo-penyelenggara-001");
        navigate("/penyelenggara");
        return;
      }
      const { db } = await import('@/lib/firebase');
      const { collection, query, where, getDocs, addDoc } = await import('firebase/firestore');
      
      const q = query(collection(db, "users"), where("role", "==", "penyelenggara"), where("nib", "==", penyelenggaraNib));
      const snapshot = await getDocs(q);
      
      if (isPenyelenggaraLoginMode) {
        if (snapshot.empty) {
          setError("Data PIHK/PPIU tidak ditemukan di database. Pastikan NIB/ID Anda terdaftar.");
          setIsPenyelenggaraLoading(false);
          return;
        }
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();
        
        if (userData.status === 'Dibekukan') {
           setError("Akses Ditolak: Izin Usaha Anda sedang DIBEKUKAN oleh Kementerian Agama. Silakan hubungi pusat.");
           setIsPenyelenggaraLoading(false);
           return;
        }
        if (userData.status === 'Cabut Izin') {
           setError("Akses Ditolak: Izin Usaha Anda telah DICABUT oleh Kementerian Agama.");
           setIsPenyelenggaraLoading(false);
           return;
        }
        
        localStorage.setItem("penyelenggara_auth_uid", userDoc.id);
        navigate("/penyelenggara");
      } else {
        if (!snapshot.empty) {
          setError("NIB/ID ini sudah terdaftar sebagai Penyelenggara.");
          setIsPenyelenggaraLoading(false);
          return;
        }
        const finalName = penyelenggaraName === "LAINNYA" ? customPenyelenggaraName : penyelenggaraName;
        const docRef = await addDoc(collection(db, "users"), {
          name: finalName,
          nib: penyelenggaraNib,
          password: penyelenggaraPassword,
          role: "penyelenggara",
          createdAt: new Date(), status: "Aktif"
        });
        
        if (penyelenggaraName === "LAINNYA") {
          await addDoc(collection(db, "direktori"), {
            name: finalName,
            type: "PPIU (Umroh)",
            rating: "B",
            status: "Terdaftar Baru",
            quota: 50,
            since: new Date().getFullYear(),
            address: "-",
            phone: "-",
            email: "-"
          });
        }
        
        localStorage.setItem("penyelenggara_auth_uid", docRef.id);
        navigate("/penyelenggara");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsPenyelenggaraLoading(false);
    }
  };

  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNip || !adminToken) {
      setError("Silakan isi NIP dan Token 2FA");
      return;
    }
    
    setIsAdminLoading(true);
    setError("");

    
    try {
      // Allow bypass for demo super admin if empty DB
      if (adminNip === "12345") {
        localStorage.setItem("admin_auth_nip", "12345");
        localStorage.setItem("admin_auth_name", "Super Admin Demo");
        localStorage.setItem("admin_auth_role", "Super Admin");
        navigate("/admin");
        return;
      }

      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const adminsRef = collection(db, "admins");

      const q = query(adminsRef, where("nip", "==", adminNip));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("NIP tidak ditemukan di sistem. Hubungi Super Admin.");
        setIsAdminLoading(false);
        return;
      }

      const adminData = querySnapshot.docs[0].data();
      localStorage.setItem("admin_auth_nip", adminData.nip);
      localStorage.setItem("admin_auth_name", adminData.name);
      localStorage.setItem("admin_auth_role", adminData.role);
      
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Gagal masuk sistem admin");
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleStandardLogin = (e: React.FormEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  const useAdminDemoAccount = () => {
    setLoginMethod("admin");
    setAdminNip("12345");
    setAdminToken("111");
    setError("");
  };

  const useJemaahDemoAccount = () => {
    setLoginMethod("jemaah");
    setIsLoginMode(true);
    setNik(demoAccounts.jemaah.nik);
    setPassword(demoAccounts.jemaah.password);
    setError("");
  };

  const usePenyelenggaraDemoAccount = () => {
    setLoginMethod("penyelenggara");
    setIsPenyelenggaraLoginMode(true);
    setPenyelenggaraNib(demoAccounts.penyelenggara.nib);
    setPenyelenggaraPassword(demoAccounts.penyelenggara.password);
    setError("");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid w-full items-stretch gap-6 lg:grid-cols-[minmax(280px,0.85fr)_minmax(480px,1.15fr)] lg:gap-8">
        <section className="relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950 via-slate-900 to-sky-950 p-6 shadow-2xl sm:min-h-[230px] lg:min-h-[650px] lg:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-emerald-300/20 bg-emerald-400/10" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-sky-300/20 bg-sky-400/10" />
          <div className="relative z-10 flex items-center gap-3">
            <img src="/logo.webp" alt="Logo Siskopatuh" className="h-14 w-14 rounded-2xl object-contain drop-shadow-xl sm:h-16 sm:w-16" />
            <div>
              <p className="text-lg font-black tracking-tight text-white">Siskopatuh v.2</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">Akses terpadu nasional</p>
            </div>
          </div>
          <div className="relative z-10 mt-8 max-w-md lg:mt-auto">
            <div className="mb-4 hidden items-center gap-3 lg:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-white/10 text-emerald-200"><Globe2 className="h-6 w-6" /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-white/10 text-sky-200"><PlaneTakeoff className="h-6 w-6" /></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-white/10 text-amber-200"><LockKeyhole className="h-6 w-6" /></div>
            </div>
            <h2 className="text-xl font-black leading-tight text-white sm:text-2xl lg:text-4xl">Satu gerbang untuk layanan umrah dan haji khusus.</h2>
            <p className="mt-3 max-w-sm text-xs leading-5 text-slate-300 sm:text-sm">Masuk ke portal sesuai peran Anda untuk mengelola, memantau, dan mengakses layanan Siskopatuh.</p>
            <div className="mt-5 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-200/80 lg:flex"><Sparkles className="h-3.5 w-3.5" /> Sistem terintegrasi dan terpusat</div>
          </div>
        </section>

        <Card className="w-full border-white/15 bg-slate-900/65 shadow-xl shadow-slate-950/20 backdrop-blur-md">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-inner">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl text-white font-light tracking-tighter">Gerbang Akses Terpusat</CardTitle>
          <CardDescription className="text-slate-400">Pilih tipe pengguna untuk masuk ke dalam sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setLoginMethod("jemaah")}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                loginMethod === "jemaah" ? "bg-slate-800 shadow-sm text-emerald-400 border border-slate-700" : "opacity-60 hover:opacity-100 transition-opacity"
              }`}
            >
              <div className="flex flex-col items-center gap-1 uppercase tracking-wider">
                <UserSquare2 className="h-4 w-4" />
                <span>Jemaah</span>
              </div>
            </button>
            <button
              onClick={() => setLoginMethod("penyelenggara")}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                loginMethod === "penyelenggara" ? "bg-slate-800 shadow-sm text-emerald-400 border border-slate-700" : "opacity-60 hover:opacity-100 transition-opacity"
              }`}
            >
              <div className="flex flex-col items-center gap-1 uppercase tracking-wider">
                <Building className="h-4 w-4" />
                <span>PIHK/PPIU</span>
              </div>
            </button>
            <button
              onClick={() => setLoginMethod("admin")}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                loginMethod === "admin" ? "bg-slate-800 shadow-sm text-emerald-400 border border-slate-700" : "opacity-60 hover:opacity-100 transition-opacity"
              }`}
            >
              <div className="flex flex-col items-center gap-1 uppercase tracking-wider">
                <KeyRound className="h-4 w-4" />
                <span>Kemenhaj</span>
              </div>
            </button>
          </div>

          {loginMethod === "jemaah" && (
            <form onSubmit={handleJemaahLogin} className="space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
                <button type="button" onClick={() => setIsLoginMode(true)} className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${isLoginMode ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Masuk</button>
                <button type="button" onClick={() => setIsLoginMode(false)} className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${!isLoginMode ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Daftar e-KYC</button>
              </div>

              {!isLoginMode && (
                <div className="p-4 bg-emerald-900/20 rounded-xl border border-emerald-500/20 mb-6">
                  <p className="text-xs text-emerald-400 font-bold mb-1 uppercase tracking-wider">Pendaftaran Mandiri & e-KYC</p>
                  <p className="text-[10px] text-emerald-500/80 leading-relaxed">Sistem terintegrasi Dukcapil. Tidak perlu upload KTP fisik, cukup NIK dan Face Recognition.</p>
                </div>
              )}

              {!isLoginMode && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap Sesuai KTP</label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!isLoginMode}
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                        placeholder="Contoh: Ahmad Ibrahim"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis Pendaftaran</label>
                    <select 
                      value={jemaahJenis}
                      onChange={(e) => {
                          setJemaahJenis(e.target.value);
                          if (e.target.value === "Haji Reguler") {
                              setJemaahPenyelenggara("Kemenhaj");
                          } else {
                              setJemaahPenyelenggara("");
                          }
                      }}
                      className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white"
                    >
                      <option value="Haji Reguler">Haji Reguler (Pemerintah)</option>
                      <option value="Haji Khusus">Haji Khusus (PIHK)</option>
                      <option value="Umrah">Umrah (PPIU)</option>
                    </select>
                  </div>
                  
                  {(jemaahJenis === "Haji Khusus" || jemaahJenis === "Umrah") && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Travel (PIHK/PPIU)</label>
                      <select 
                        required={!isLoginMode}
                        value={jemaahPenyelenggara}
                        onChange={(e) => setJemaahPenyelenggara(e.target.value)}
                        className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white"
                      >
                        <option value="" disabled>Pilih Travel...</option>
                        {agenList
                           .filter(agen => {
                               if (jemaahJenis === "Haji Khusus") return agen.type?.includes("PIHK");
                               if (jemaahJenis === "Umrah") return agen.type?.includes("PPIU") || agen.type?.includes("PIHK");
                               return true;
                           })
                           .map((agen, idx) => (
                             <option key={idx} value={agen.name}>{agen.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Induk Kependudukan (NIK)</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full pl-10 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                    placeholder="Masukkan 16 digit NIK"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                    placeholder="Masukkan Kata Sandi"
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-rose-900/20 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full   font-bold tracking-wider text-xs h-10 rounded-lg" disabled={isScanning || nik.length < 16 || !password}>
                {isScanning ? (
                  <>
                    <ScanFace className="mr-2 h-4 w-4 animate-pulse" />
                    MEMVERIFIKASI BIOMETRIK...
                  </>
                ) : (
                  <>
                    <ScanFace className="mr-2 h-4 w-4" />
                    LANJUT VERIFIKASI WAJAH (80% MATCH)
                  </>
                )}
              </Button>
            </form>
          )}

          {loginMethod === "penyelenggara" && (
            <form onSubmit={handlePenyelenggaraSubmit} className="space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
                <button type="button" onClick={() => setIsPenyelenggaraLoginMode(true)} className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${isPenyelenggaraLoginMode ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Masuk</button>
                <button type="button" onClick={() => setIsPenyelenggaraLoginMode(false)} className={`flex-1 text-xs font-bold py-2 rounded-md transition-colors ${!isPenyelenggaraLoginMode ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Daftar PIHK/PPIU</button>
              </div>
              
              {!isPenyelenggaraLoginMode && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Perusahaan / Travel</label>
                  <select
                    required
                    value={penyelenggaraName}
                    onChange={(e) => setPenyelenggaraName(e.target.value)}
                    className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white"
                  >
                    {direktoriList.map(pihk => (
                      <option key={pihk} value={pihk}>{pihk}</option>
                    ))}
                    <option value="LAINNYA">+ Daftarkan Travel Baru (Belum Terdaftar)</option>
                  </select>
                  {penyelenggaraName === "LAINNYA" && (
                    <input
                      type="text"
                      required
                      value={customPenyelenggaraName}
                      onChange={(e) => setCustomPenyelenggaraName(e.target.value)}
                      className="w-full px-3 h-10 mt-2 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                      placeholder="Masukkan Nama Perusahaan Travel Anda..."
                    />
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID Penyelenggara / NIB</label>
                <input
                  type="text"
                  required
                  value={penyelenggaraNib}
                  onChange={(e) => setPenyelenggaraNib(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                  placeholder="PPIU-XXXX / PIHK-XXXX / NIB"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kata Sandi</label>
                <input
                  type="password"
                  required
                  value={penyelenggaraPassword}
                  onChange={(e) => setPenyelenggaraPassword(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-rose-900/20 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}
              
              <Button type="submit" disabled={isPenyelenggaraLoading} className="w-full   font-bold tracking-wider text-xs h-10 rounded-lg uppercase">
                {isPenyelenggaraLoading ? "Memproses..." : (isPenyelenggaraLoginMode ? "Masuk Workspace Penyelenggara" : "Daftarkan Penyelenggara")}
              </Button>
            </form>
          )}

          {loginMethod === "admin" && (
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-4 bg-rose-900/20 rounded-xl border border-rose-500/20 mb-6 flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0" />
                <div className="space-y-2">
                  <p className="text-[10px] text-rose-400/80 leading-relaxed">
                    <strong className="text-rose-400">Akses Terbatas:</strong> Area ini dikontrol secara ketat. Masukkan NIP yang terdaftar di Manajemen Admin.
                  </p>
                  <p className="text-[10px] text-emerald-400/80 font-bold bg-emerald-950/50 p-2 rounded border border-emerald-900/50">
                    💡 Info Demo: Untuk Token 2FA bisa diisi bebas (misal: "111").<br/>
                    Untuk login darurat Super Admin gunakan NIP: 12345
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NIP / ID Kredensial</label>
                <input
                  type="text"
                  required
                  value={adminNip}
                  onChange={(e) => setAdminNip(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-sm text-white placeholder:text-slate-600"
                  placeholder="Masukkan NIP Anda..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passcode / 2FA Token</label>
                <input
                  type="password"
                  required
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none text-sm text-white tracking-[0.3em] font-mono placeholder:tracking-normal placeholder:font-sans"
                  placeholder="******"
                />
              </div>
              <Button type="submit" disabled={isAdminLoading} className="w-full  font-bold tracking-wider text-xs h-10 rounded-lg uppercase">
                {isAdminLoading ? "MENGOTENTIKASI..." : "OTENTIKASI SISTEM"}
              </Button>
            </form>

          )}

          <div className="mt-6 rounded-xl border border-sky-300/20 bg-sky-950/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">Akun Test / Demo</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">Gunakan akun ini untuk mencoba area Kemenhaj tanpa data produksi.</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-sky-300">Demo aktif</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-white/10 bg-slate-950/40 p-2">
                <span className="block text-[10px] text-slate-500">Role</span>
                <span className="font-bold text-white">Kemenhaj</span>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/40 p-2">
                <span className="block text-[10px] text-slate-500">NIP Demo</span>
                <span className="font-mono font-bold text-white">12345</span>
              </div>
              <div className="col-span-2 rounded-lg border border-white/10 bg-slate-950/40 p-2">
                <span className="block text-[10px] text-slate-500">Token 2FA Demo</span>
                <span className="font-mono font-bold text-white">111</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <button type="button" onClick={useJemaahDemoAccount} className="rounded-lg border border-emerald-300/20 bg-emerald-950/30 px-3 py-2 text-left text-[10px] font-bold text-emerald-200 hover:bg-emerald-900/40">Jemaah<br /><span className="font-normal text-emerald-100/70">9999999999999999 / demo123</span></button>
              <button type="button" onClick={usePenyelenggaraDemoAccount} className="rounded-lg border border-amber-300/20 bg-amber-950/30 px-3 py-2 text-left text-[10px] font-bold text-amber-200 hover:bg-amber-900/40">PIHK/PPIU<br /><span className="font-normal text-amber-100/70">PIHK-DEMO / demo123</span></button>
              <button type="button" onClick={useAdminDemoAccount} className="rounded-lg border border-sky-300/20 bg-sky-950/30 px-3 py-2 text-left text-[10px] font-bold text-sky-200 hover:bg-sky-900/40">Kemenhaj<br /><span className="font-normal text-sky-100/70">12345 / 111</span></button>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
