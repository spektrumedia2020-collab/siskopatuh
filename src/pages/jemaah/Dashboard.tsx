import QRCode from 'react-qr-code';
import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileCheck, FileWarning, UploadCloud, MapPin, Clock, FileLock2, CreditCard, Banknote, CheckCircle2, PlaneTakeoff, Flag, Activity, TriangleAlert, ShieldAlert, Send, Camera, User, Phone, Map, Hash, UserCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, onSnapshot, query, where, collection, addDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function JemaahDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = location.pathname.includes('/dokumen') 
    ? 'vault' 
    : location.pathname.includes('/timeline') 
      ? 'timeline' 
      : location.pathname.includes('/keuangan')
        ? 'keuangan'
        : location.pathname.includes('/aduan')
          ? 'aduan'
          : location.pathname.includes('/profil')
            ? 'profil'
            : 'buku';
  
  const [loading, setLoading] = useState(true);
  const [sosStatus, setSosStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const [userData, setUserData] = useState<any>(null);
  const [myPackage, setMyPackage] = useState<any>(null);
  const [savingsData, setSavingsData] = useState<any>(null);
  const [documentsData, setDocumentsData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  
  // Dummy chart data for illustration (in real app, this is computed from savingsData)
    const computedBalance = savingsData?.transactions?.reduce((acc, tx) => {
    if (tx.type?.includes('deposit')) {
       return acc + (Number(tx.amount) || 0);
    }
    return acc;
  }, 0) || savingsData?.totalBalance || 0;
  
  const estimatedTotal = userData?.jenis === "Haji Reguler" ? 85000000 : (userData?.jenis === "Haji Khusus" ? 150000000 : 35000000);
  const progressPercent = Math.min(100, Math.round((computedBalance / estimatedTotal) * 100));

  const dataManfaat = [
    { month: 'Jan', pokok: computedBalance, manfaat: 0 },
    { month: 'Feb', pokok: computedBalance, manfaat: 150000 },
    { month: 'Mar', pokok: computedBalance, manfaat: 310000 },
    { month: 'Apr', pokok: computedBalance, manfaat: 480000 },
    { month: 'Mei', pokok: computedBalance, manfaat: 660000 },
    { month: 'Jun', pokok: computedBalance, manfaat: 850000 },
    { month: 'Jul', pokok: computedBalance, manfaat: 1050000 },
  ];

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSosConfirmModal, setShowSosConfirmModal] = useState(false);
  const [showSosResultModal, setShowSosResultModal] = useState(false);
  const [sosResultMsg, setSosResultMsg] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAmount, setUploadAmount] = useState("");

  const [aduanForm, setAduanForm] = useState({ perihal: '', kategori: 'UM', isi: '' });
  const [isSubmittingAduan, setIsSubmittingAduan] = useState(false);
  const [aduanSuccess, setAduanSuccess] = useState(false);
  const [myAduanList, setMyAduanList] = useState<any[]>([]);

  const handleSubmitAduan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aduanForm.perihal || !aduanForm.isi) return;
    setIsSubmittingAduan(true);
    try {
      const regNo = `ADUAN-${Math.floor(1000 + Math.random() * 9000)}/2026`;
      const pihkName = myPackage?.pihkName || "PT. Penyelenggara (Tidak Terdeteksi)";
      await addDoc(collection(db, "aduan"), {
        reg: regNo,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        pihk: pihkName,
        kategori: aduanForm.kategori,
        perihal: aduanForm.perihal,
        isi: aduanForm.isi,
        progress: "Pending",
        timestamp: new Date().getTime(),
        userId: localStorage.getItem("jemaah_auth_uid") || ""
      });
      setAduanForm({ perihal: '', kategori: 'UM', isi: '' });
      setAduanSuccess(true);
      setTimeout(() => setAduanSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting aduan:", error);
      alert("Terjadi kesalahan saat mengirim aduan. Silakan coba lagi.");
    } finally {
      setIsSubmittingAduan(false);
    }
  };
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadAmount) return;
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      const uid = localStorage.getItem("jemaah_auth_uid");
      if (uid) {
        try {
          await setDoc(doc(db, "timelines", uid), {
            pelunasanStatus: "verifying",
            updatedAt: new Date().getTime()
          }, { merge: true });
          
          const savingsDoc = await getDoc(doc(db, "savings", uid));
          const savingsData = savingsDoc.exists() ? savingsDoc.data() : {};
          const transactions = savingsData.transactions || [];
          
          const newTotal = (savingsData.totalBalance || 0) + Number(uploadAmount);
          transactions.push({
            date: new Date().toISOString(),
            description: "Konfirmasi Manual Pembayaran Pelunasan",
            type: "deposit (pending)",
            amount: Number(uploadAmount),
            balanceAfter: newTotal
          });
          savingsData.totalBalance = newTotal;
          

          await setDoc(doc(db, "savings", uid), {
            statusPelunasan: "Menunggu Verifikasi Admin",
            lastUploadAmount: uploadAmount,
            lastUploadReceipt: base64String,
            totalBalance: newTotal,
            transactions: transactions
          }, { merge: true });
        } catch (err) {
          console.error(err);
        }
      }

      setSuccessMsg(`Berhasil mengunggah bukti pembayaran sebesar Rp ${uploadAmount}. Tim admin akan melakukan verifikasi maksimal 1x24 jam.`);
      setShowSuccessModal(true);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadAmount("");
    };
    reader.readAsDataURL(uploadFile);
  };

  const handleSOS = () => {
    setShowSosConfirmModal(true);
  };

  const confirmSOS = async () => {
    setShowSosConfirmModal(false);
    setSosStatus('sending');
    try {
        let locationData = "Lokasi tidak diketahui (Izin ditolak/Gagal)";
        try {
            if (navigator.geolocation) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                locationData = `Lat: ${(position as GeolocationPosition).coords.latitude}, Lng: ${(position as GeolocationPosition).coords.longitude}`;
            }
        } catch(e) {
            console.log("Geolocation error", e);
        }
        
        const uid = localStorage.getItem("jemaah_auth_uid") || "unknown";
        await addDoc(collection(db, "sos_alerts"), {
            jemaahId: uid,
            jemaahName: userData?.name || "Anonim",
            ppiuName: userData?.penyelenggara || "Unknown",
            location: locationData,
            timestamp: new Date().toISOString(),
            status: 'active'
        });
        setSosStatus('sent');
        setSosResultMsg("Sinyal SOS terkirim! EWS Kemenhaj telah diaktifkan. Harap tetap di lokasi aman dan tunggu arahan.");
        setShowSosResultModal(true);
    } catch(e) {
        console.error(e);
        setSosStatus('idle');
        setSosResultMsg("Gagal mengirim sinyal. Pastikan koneksi internet stabil.");
        setShowSosResultModal(true);
    }
  };
useEffect(() => {
    const uid = localStorage.getItem("jemaah_auth_uid");
    
    if (uid) {
      // Listen to User Profile
      // Listen to Real-time Package
      let unsubPackage = () => {};
      const unsubUser = onSnapshot(doc(db, "users", uid), (docSnap) => {
        const data = docSnap.data();
        setUserData(data);
        if (data && data.jenis !== "Haji Reguler" && data.penyelenggara && data.paket) {
          unsubPackage(); // unsubscribe previous if exists
          const q = query(
            collection(db, "packages"),
            where("pihkName", "==", data.penyelenggara),
            where("name", "==", data.paket)
          );
          unsubPackage = onSnapshot(q, (snap) => {
            if (!snap.empty) setMyPackage({ id: snap.docs[0].id, ...snap.docs[0].data() });
          });
        }
      });
      
      // Listen to Savings
      const unsubSavings = onSnapshot(doc(db, "savings", uid), (doc) => {
        setSavingsData(doc.data());
      });
      // Listen to Documents
      const unsubDocs = onSnapshot(doc(db, "documents", uid), (doc) => {
        setDocumentsData(doc.data());
      });
      // Listen to Timelines
      const unsubTimelines = onSnapshot(doc(db, "timelines", uid), (doc) => {
        setTimelineData(doc.data());
      });
      
      setLoading(false);
      
  
  return () => {
        unsubUser();
        if (typeof unsubPackage === "function") unsubPackage();
        unsubSavings();
        unsubDocs();
        unsubTimelines();
      };
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-[50vh] text-emerald-500 font-bold tracking-widest">MEMUAT DATA...</div>;
  }

  // Derived Document Stats
  const docs = documentsData || { passport: { status: 'missing' }, vaccine: { status: 'missing' } };
  const totalDocs = 4; // Assuming 2 auto-verified + 2 manual
  const verifiedDocs = 2 + (docs.passport?.status === 'validated' ? 1 : 0) + (docs.vaccine?.status === 'validated' ? 1 : 0);

  return (
    <div className="min-w-0 w-full space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Floating SOS Button */}
       <div className="fixed bottom-4 right-4 z-50 sm:bottom-8 sm:right-8">
        <Button 
         type="button"
         title="Kirim sinyal darurat"
         aria-label="Kirim sinyal darurat"
           onClick={handleSOS}
           disabled={sosStatus === 'sending'}
           className={`min-h-12 h-12 w-12 rounded-full p-0 text-sm font-bold shadow-[0_8px_24px_rgba(220,38,38,0.45)] flex items-center justify-center gap-2 sm:h-14 sm:w-auto sm:max-w-[calc(100vw-2rem)] sm:px-6 sm:text-lg sm:gap-3 ${sosStatus === 'sent' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'} text-white border-2 border-red-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">🆘</span>
          <TriangleAlert className="hidden h-6 w-6 sm:block" />
          <span className="hidden sm:inline">{sosStatus === 'sending' ? 'Mengirim...' : sosStatus === 'sent' ? 'SOS Terkirim' : 'DARURAT (SOS)'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white border-none shadow-md">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Dana (Virtual Account H2H)</p>
                <h3 className="text-2xl font-bold mt-1">
                  Rp {computedBalance.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">VA: {userData?.virtualAccount}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <Banknote className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex justify-between text-xs text-emerald-50 mb-1">
                 <span>Progress Pelunasan</span>
                 <span>{progressPercent}%</span>
               </div>
               <div className="w-full bg-emerald-950/50 rounded-full h-1.5 border border-emerald-800/50">
                 <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-[10px] text-emerald-100">Estimasi Biaya: Rp {estimatedTotal.toLocaleString('id-ID')}</p>
                 {progressPercent >= 100 && <span className="text-[9px] font-bold bg-emerald-500 px-1.5 py-0.5 rounded text-emerald-950">LUNAS</span>}
               </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Estimasi Berangkat</p>
              <h3 className="text-xl font-bold text-slate-100">Tahun {userData.estimatedYear || '-'}</h3>
              <p className="text-xs text-slate-500 mt-1">Porsi: {userData.porsiNumber || userData.nomorPorsi || userData.porsi || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <FileLock2 className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Status Dokumen E-Vault</p>
              <h3 className="text-xl font-bold text-slate-100">{verifiedDocs} / {totalDocs} Lengkap</h3>
              {verifiedDocs < totalDocs && (
                 <p className="text-xs text-amber-400 font-medium mt-1">Perlu Unggah Dokumen</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'buku' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
                  <Flag className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Penyelenggara</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.penyelenggara || 'Kemenhaj (Reguler)'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center border border-blue-500/20">
                  <PlaneTakeoff className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Jenis Layanan</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.jenis || 'Haji Reguler'}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/20">
                  <CheckCircle2 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Paket Dipilih</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">{userData?.paket || 'Reguler 40 Hari'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="border-b border-slate-800 pb-4 mb-4">
              <CardTitle className="text-xl">Pelacakan Status Keberangkatan</CardTitle>
              <CardDescription>Pantau progress dokumen dan verifikasi dari BPKH hingga penerbitan tiket dan visa Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Progress Bar Container */}
              {userData?.jenis === "Haji Reguler" ? (
              <>
              {(() => {
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
                  <div className="relative -mx-2 overflow-x-auto py-8 px-2">
                    {/* Connecting Line (Background) */}
                    <div className="absolute top-[48px] left-[8%] right-[8%] h-1 bg-slate-800 rounded-full"></div>
                    {/* Connecting Line (Progress) */}
                    <div className={`absolute top-[48px] left-[8%] h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000`} style={{width: lineWidth}}></div>

                    <div className="relative z-10 flex min-w-[680px] justify-between">
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 text-white relative ${timelineData?.pelunasanStatus === 'verified' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`}>
                          {timelineData?.pelunasanStatus !== 'verified' && (
                            <>
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping"></span>
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full"></span>
                            </>
                          )}
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold ${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>Pelunasan Bipih</p>
                          <p className={`text-[10px] mt-1 ${timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-500/80' : 'text-amber-500/80'}`}>
                            {timelineData?.pelunasanStatus === 'verifying' ? 'Sedang Verifikasi' : timelineData?.pelunasanStatus === 'verified' ? 'Selesai' : 'Tahap Saat Ini'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Visa & PNR */}
                      <div className={`flex flex-col items-center gap-3 w-1/6 ${!isVisaAman ? 'opacity-50 grayscale' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 ${isVisaAman ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : timelineData?.pelunasanStatus === 'verified' ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}`}>
                          <PlaneTakeoff className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold ${isVisaAman ? 'text-emerald-400' : timelineData?.pelunasanStatus === 'verified' ? 'text-amber-400' : 'text-slate-400'}`}>Visa & Tiket</p>
                          <p className="text-[10px] text-slate-500 mt-1">{isVisaAman ? 'Terkonfirmasi' : (timelineData?.pelunasanStatus === 'verified' ? 'Proses' : 'Menunggu')}</p>
                        </div>
                      </div>

                      {/* Step 5: Keberangkatan */}
                      <div className={`flex flex-col items-center gap-3 w-1/6 ${!isBerangkat && !isVisaAman ? 'opacity-50 grayscale' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 ${isBerangkat ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isVisaAman ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}`}>
                          <Flag className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold ${isBerangkat ? 'text-emerald-400' : isVisaAman ? 'text-amber-400' : 'text-slate-400'}`}>Keberangkatan</p>
                          <p className="text-[10px] text-slate-500 mt-1">{isBerangkat ? 'Sudah Berangkat' : isVisaAman ? 'Tahap Saat Ini' : 'Menunggu'}</p>
                        </div>
                      </div>

                      {/* Step 6: Kepulangan */}
                      <div className={`flex flex-col items-center gap-3 w-1/6 ${!isPulang && !isBerangkat ? 'opacity-50 grayscale' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-slate-950 ${isPulang ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : isTundaPulang ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(243,33,33,0.3)] animate-pulse' : isBerangkat ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-400'}`}>
                          {isTundaPulang ? <AlertTriangle className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-bold ${isPulang ? 'text-emerald-400' : isTundaPulang ? 'text-rose-400' : isBerangkat ? 'text-amber-400' : 'text-slate-400'}`}>Kepulangan</p>
                          <p className={`text-[10px] mt-1 ${isTundaPulang ? 'text-rose-400' : 'text-slate-500'}`}>{isPulang ? 'Tiba di Tanah Air' : isTundaPulang ? 'Tunda (Deteksi EWS)' : isBerangkat ? 'Tahap Saat Ini' : 'Menunggu'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Status Banner */}
              <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
                <div className={`p-4 rounded-full border ${timelineData?.pelunasanStatus === 'verifying' ? 'bg-blue-500/10 border-blue-500/20' : timelineData?.pelunasanStatus === 'verified' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <Activity className={`w-8 h-8 ${timelineData?.pelunasanStatus === 'verifying' ? 'text-blue-500' : timelineData?.pelunasanStatus === 'verified' ? 'text-emerald-500' : 'text-amber-500'}`} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-lg font-bold text-white mb-1">
                    {timelineData?.pelunasanStatus === 'verifying' 
                      ? 'Pembayaran Sedang Diverifikasi Admin' 
                      : timelineData?.pelunasanStatus === 'verified'
                        ? 'Pembayaran Lunas, Menunggu Dokumen'
                        : 'Menunggu Pelunasan Biaya Perjalanan (Bipih)'}
                  </h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {timelineData?.pelunasanStatus === 'verifying' 
                      ? 'Tim admin sedang memverifikasi bukti pembayaran yang Anda unggah maksimal 1x24 jam.' 
                      : timelineData?.pelunasanStatus === 'verified'
                        ? 'Biaya pelunasan Anda telah diterima dan diverifikasi. Penyelenggara akan segera memproses Visa dan Tiket.'
                        : 'Dokumen pendaftaran Anda telah diverifikasi. Silakan lunasi sisa biaya.'}
                  </p>
                  {timelineData?.pelunasanStatus !== 'verified' && (
                    <Button onClick={() => navigate('/jemaah/keuangan')} className="theme-primary-bg hover:opacity-90 font-bold h-10 px-6 rounded-lg text-xs border-transparent shadow-lg">
                      Tinjau Tagihan di Keuangan & Ledger
                    </Button>
                  )}
                </div>
              </div>
              </>
            ) : (
              // Umrah / Khusus View tracking myPackage
              myPackage ? (() => {
                const isVisaAman = myPackage.statusVisa === 'Terbit Seluruhnya';
                const isTiketAman = myPackage.statusTiket === 'Issued';
                const isHotelAman = myPackage.statusHotel === 'Confirmed / Lunas';

                let step = 1;
                if (isVisaAman || isTiketAman || isHotelAman) step = 2;
                if (isVisaAman && isTiketAman && isHotelAman) step = 3;
                if (step === 3 && myPackage.statusKeberangkatan === 'Sudah Berangkat') step = 4;
                if (step === 4 && myPackage.statusKepulangan === 'Sudah Pulang') step = 5;

                return (
                  <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Visa Status */}
                      <div className={`p-4 rounded-xl border ${isVisaAman ? 'bg-emerald-900/20 border-emerald-500/30' : myPackage.statusVisa === 'Belum Diajukan' || !myPackage.statusVisa ? 'bg-rose-900/20 border-rose-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Visa</p>
                          {isVisaAman ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Activity className="w-4 h-4 text-amber-500" />}
                        </div>
                        <p className={`text-lg font-bold ${isVisaAman ? 'text-emerald-400' : myPackage.statusVisa === 'Belum Diajukan' || !myPackage.statusVisa ? 'text-rose-400' : 'text-amber-400'}`}>
                          {myPackage.statusVisa || 'Belum Diajukan'}
                        </p>
                      </div>

                      {/* Tiket Status */}
                      <div className={`p-4 rounded-xl border ${isTiketAman ? 'bg-emerald-900/20 border-emerald-500/30' : myPackage.statusTiket === 'Belum Issued' || !myPackage.statusTiket ? 'bg-rose-900/20 border-rose-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiket & PNR</p>
                          {isTiketAman ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Activity className="w-4 h-4 text-amber-500" />}
                        </div>
                        <p className={`text-lg font-bold ${isTiketAman ? 'text-emerald-400' : myPackage.statusTiket === 'Belum Issued' || !myPackage.statusTiket ? 'text-rose-400' : 'text-amber-400'}`}>
                          {myPackage.statusTiket || 'Belum Issued'}
                        </p>
                        {myPackage.pnr && <p className="text-xs text-slate-400 mt-1 font-mono">Kode Booking: {myPackage.pnr}</p>}
                      </div>

                      {/* Hotel Status */}
                      <div className={`p-4 rounded-xl border ${isHotelAman ? 'bg-emerald-900/20 border-emerald-500/30' : myPackage.statusHotel === 'Belum Booking' || !myPackage.statusHotel ? 'bg-rose-900/20 border-rose-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akomodasi Hotel</p>
                          {isHotelAman ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Activity className="w-4 h-4 text-amber-500" />}
                        </div>
                        <p className={`text-lg font-bold ${isHotelAman ? 'text-emerald-400' : myPackage.statusHotel === 'Belum Booking' || !myPackage.statusHotel ? 'text-rose-400' : 'text-amber-400'}`}>
                          {myPackage.statusHotel || 'Belum Booking'}
                        </p>
                        {myPackage.hotelMakkah && <p className="text-xs text-slate-400 mt-1 truncate">Makkah: {myPackage.hotelMakkah}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Keberangkatan */}
                      <div className={`p-4 rounded-xl border ${myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemantauan Keberangkatan</p>
                          {myPackage.statusKeberangkatan === 'Sudah Berangkat' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <PlaneTakeoff className="w-4 h-4 text-slate-500" />}
                        </div>
                        <p className={`text-lg font-bold ${myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {myPackage.statusKeberangkatan === 'Sudah Berangkat' ? 'Sudah Diberangkatkan' : 'Menunggu Jadwal Berangkat'}
                        </p>
                      </div>

                      {/* Kepulangan */}
                      <div className={`p-4 rounded-xl border ${myPackage.statusKepulangan === 'Sudah Pulang' ? 'bg-emerald-900/20 border-emerald-500/30' : (myPackage.statusKepulangan?.includes('Terlambat') || myPackage.statusKepulangan?.includes('Tunda')) ? 'bg-rose-900/20 border-rose-500/30' : 'bg-slate-900/50 border-slate-700/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemantauan Kepulangan</p>
                          {myPackage.statusKepulangan === 'Sudah Pulang' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <MapPin className="w-4 h-4 text-slate-500" />}
                        </div>
                        <p className={`text-lg font-bold ${myPackage.statusKepulangan === 'Sudah Pulang' ? 'text-emerald-400' : (myPackage.statusKepulangan?.includes('Terlambat') || myPackage.statusKepulangan?.includes('Tunda')) ? 'text-rose-400' : 'text-slate-400'}`}>
                          {myPackage.statusKepulangan === 'Sudah Pulang' ? 'Tiba di Tanah Air' : (myPackage.statusKepulangan?.includes('Terlambat') || myPackage.statusKepulangan?.includes('Tunda')) ? 'Tunda Kepulangan (Deteksi Otomatis)' : 'Menunggu Kepulangan'}
                        </p>
                        {(myPackage.statusKepulangan?.includes('Terlambat') || myPackage.statusKepulangan?.includes('Tunda')) && (
                           <p className="text-xs text-rose-400 mt-1">Melewati SLA jadwal 24 Jam. Status dilaporkan ke Command Centre.</p>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                      <div className={`p-3 rounded-full border ${step === 3 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                        {step === 3 ? <CheckCircle2 className="w-6 h-6" /> : <PlaneTakeoff className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-sm font-bold text-white mb-1">
                          {step === 5 ? "Alhamdulillah, Ibadah Selesai!" : step === 4 ? "Anda Sedang Menjalankan Ibadah" : step === 3 ? "Persiapan Keberangkatan Selesai!" : "Penyelenggara sedang mengurus persiapan keberangkatan Anda."}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {step === 5 ? "Selamat kembali ke Tanah Air. Semoga menjadi mabrur." : step === 4 ? "Sistem sedang memantau jadwal kepulangan Anda." : step === 3 ? "Visa, Tiket pesawat, dan Hotel telah diamankan. Silakan tunggu jadwal manasik dan keberangkatan." : "Tim travel Anda sedang memproses kelengkapan dokumen perjalanan dan akomodasi. Sistem Kemenhaj memantau proses ini."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="py-12 text-center text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>Memuat data kesiapan operasional paket Anda...</p>
                </div>
              )
            )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0">
              <CreditCard className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400 mb-1">Jaminan Keamanan Dana (Sistem Escrow)</h4>
              <p className="text-xs text-emerald-500/80 leading-relaxed">
                Seluruh dana pembayaran Anda tersimpan dengan aman di Kas Negara (BPKH) melalui Virtual Account terpusat. Dana Anda <strong>TIDAK</strong> dikelola langsung oleh pihak Travel/Penyelenggara, dan baru akan dicairkan kepada mereka secara bertahap (Milestone-based) setelah visa dan tiket pesawat Anda resmi diterbitkan.
              </p>
            </div>
          </div>
          <Card>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Konfirmasi Pembayaran Manual</CardTitle>
                <CardDescription>Unggah bukti setor / transfer jika Anda tidak menggunakan Virtual Account.</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 gap-2 border-emerald-400/30 text-emerald-300 hover:bg-emerald-400/10"
                onClick={() => setShowUploadModal(true)}
              >
                <UploadCloud className="h-4 w-4" /> Unggah Struk
              </Button>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Akumulasi Nilai Manfaat (Yield Distribution)</CardTitle>
              <CardDescription>Visualisasi pertumbuhan dana dari hasil investasi BPKH yang didistribusikan ke Virtual Account Anda setiap bulan.</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataManfaat} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPokok" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorManfaat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Rp ${value / 1000000} Juta`}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                    contentStyle={{ borderRadius: '8px', backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="pokok" stackId="1" stroke="#10b981" fill="url(#colorPokok)" strokeWidth={2} name="Setoran Pokok" />
                  <Area type="monotone" dataKey="manfaat" stackId="1" stroke="#0ea5e9" fill="url(#colorManfaat)" strokeWidth={2} name="Nilai Manfaat" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full min-w-[680px] text-sm text-left">
                <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Tanggal Mutasi</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-right">Tipe</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                    <th className="px-4 py-3 text-right">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {(() => {
                    let runningBalance = 0;
                    return savingsData?.transactions?.map((tx: any, i: number) => {
                      if (tx.type?.includes('deposit')) {
                        runningBalance += Number(tx.amount) || 0;
                      }
                      return (
                        <tr key={i}>
                          <td className="px-4 py-3">{tx.date?.toDate ? tx.date.toDate().toLocaleDateString('id-ID') : new Date(tx.date).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-3">{tx.description}</td>
                          <td className="px-4 py-3 text-right capitalize">{tx.type}</td>
                          <td className={`px-4 py-3 text-right font-medium ${tx.type?.includes('deposit') ? 'text-emerald-400' : 'text-white'}`}>
                            + Rp {Number(tx.amount).toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-white">Rp {runningBalance.toLocaleString('id-ID')}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "KTP Elektronik", status: "valid", desc: "Diverifikasi otomatis via API Dukcapil", req: true },
            { title: "Kartu Keluarga", status: "valid", desc: "Diverifikasi otomatis via API Dukcapil", req: true },
            { title: "Paspor", status: docs.passport?.status === 'validated' ? 'valid' : docs.passport?.status === 'verifying' ? 'pending' : 'missing', desc: "Minimal masa berlaku 6 bulan", req: true },
            { title: "Sertifikat Meningitis", status: docs.vaccine?.status === 'validated' ? 'valid' : docs.vaccine?.status === 'verifying' ? 'pending' : 'missing', desc: "Wajib berdasarkan regulasi Kemenkes Saudi", req: true },
          ].map((doc, i) => (
            <Card key={i} className={`border-l-4 ${doc.status === 'valid' ? 'border-l-emerald-500' : doc.status === 'pending' ? 'border-l-amber-500' : 'border-l-red-500'}`}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${doc.status === 'valid' ? 'bg-emerald-900/30 text-emerald-500' : doc.status === 'pending' ? 'bg-amber-900/30 text-amber-500' : 'bg-rose-900/30 text-rose-500'}`}>
                  {doc.status === 'valid' ? <FileCheck className="h-6 w-6" /> : <FileWarning className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-200">{doc.title} {doc.req && <span className="text-rose-500">*</span>}</h4>
                  <p className="text-sm text-slate-500 mt-1">{doc.desc}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    {doc.status === 'valid' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-900/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">Tervalidasi</span>
                    ) : doc.status === 'pending' ? (
                      <span className="inline-flex items-center rounded-full bg-amber-900/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30 uppercase tracking-wider">Sedang Diverifikasi</span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 gap-2 text-xs"
                        onClick={() => {
                            setSuccessMsg(`Berhasil mengunggah ${doc.title}. Tim admin akan segera memverifikasi dokumen Anda.`);
                            setShowSuccessModal(true);
                        }}
                      >
                        <UploadCloud className="h-4 w-4" /> Unggah Dokumen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <Card>
          <CardHeader>
            <CardTitle>Perjalanan Ibadah Anda</CardTitle>
            <CardDescription>Garis waktu tahapan dari pendaftaran hingga kepulangan tersinkronisasi waktu nyata.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pb-4 mt-2">
              {[
                {
                  title: "Setoran Awal BPIH",
                  description: "Pendaftaran dan pembayaran setoran awal sebesar Rp 25.000.000 melalui BPS BPIH.",
                  status: "completed",
                  date: "12 Mar 2026",
                },
                {
                  title: "Verifikasi BPKH",
                  description: "Validasi persyaratan administrasi dasar dan pencatatan nilai manfaat oleh BPKH.",
                  status: "completed",
                  date: "14 Mar 2026",
                },
                {
                  title: "Pelunasan Bipih",
                  description: timelineData?.pelunasanStatus === 'verifying' 
                    ? "Tim admin sedang melakukan verifikasi pembayaran Anda (maks. 1x24 jam)."
                    : timelineData?.pelunasanStatus === 'verified'
                      ? "Pembayaran pelunasan telah lunas."
                      : "Pembayaran sisa biaya perjalanan haji (Bipih) sesuai dengan keputusan KMA.",
                  status: timelineData?.pelunasanStatus === 'verified' ? "completed" : "current",
                  date: timelineData?.pelunasanStatus === 'verifying' ? "Sedang Diverifikasi" : timelineData?.pelunasanStatus === 'verified' ? "Lunas" : "Tahap Saat Ini",
                },
                {
                  title: "Visa & Tiket (Proof of Capacity)",
                  description: "Proses penerbitan visa dan tiket pesawat oleh Penyelenggara.",
                  status: (myPackage?.statusVisa === 'Terbit Seluruhnya') ? "completed" : (timelineData?.pelunasanStatus === 'verified' ? "current" : "pending"),
                  date: (myPackage?.statusVisa === 'Terbit Seluruhnya') ? "Terkonfirmasi" : "Menunggu",
                },
                {
                  title: "Keberangkatan",
                  description: "Keberangkatan menuju Tanah Suci sesuai jadwal kloter/manifest.",
                  status: myPackage?.statusKeberangkatan?.includes('Sudah') ? "completed" : ((myPackage?.statusVisa === 'Terbit Seluruhnya') ? "current" : "pending"),
                  date: myPackage?.statusKeberangkatan?.includes('Sudah') ? "Sudah Diberangkatkan" : "Menunggu",
                },
                {
                  title: "Kepulangan",
                  description: myPackage?.statusKepulangan?.includes('Tunda') ? "Sistem mendeteksi keterlambatan kepulangan." : "Kedatangan kembali di Tanah Air dengan selamat.",
                  status: myPackage?.statusKepulangan?.includes('Sudah') ? "completed" : (myPackage?.statusKepulangan?.includes('Tunda') ? "current" : (myPackage?.statusKeberangkatan?.includes('Sudah') ? "current" : "pending")),
                  date: myPackage?.statusKepulangan?.includes('Sudah') ? "Tiba di Tanah Air" : (myPackage?.statusKepulangan?.includes('Tunda') ? "Tunda Kepulangan (Peringatan)" : "Menunggu")
                }
              ].map((stage: any, i: number) => (
                <div key={i} className={`relative pl-8 ${stage.status === 'pending' ? 'opacity-50' : ''}`}>
                  <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1 ring-4 ring-[#020617] ${stage.status === 'completed' ? 'bg-emerald-500' : stage.status === 'current' ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`}></div>
                  <h4 className={`font-bold ${stage.status === 'completed' ? 'text-emerald-400' : stage.status === 'current' ? 'text-amber-400' : 'text-slate-500'}`}>{stage.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{stage.date}</p>
                  <p className="text-sm text-slate-300 mt-2">{stage.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Upload Bukti Pembayaran Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Unggah Bukti Pembayaran</h3>
              <p className="text-sm text-slate-400 mt-1">Konfirmasi pembayaran manual akan diverifikasi oleh Admin Penyelenggara maksimal 1x24 jam.</p>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nominal Transfer (Rp)</label>
                <input 
                  type="number" 
                  value={uploadAmount}
                  onChange={(e) => setUploadAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ketik nominal di sini..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Foto Struk / Bukti Transfer</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    required
                  />
                  {uploadFile ? (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-emerald-400 font-medium">{uploadFile.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Klik untuk mengganti file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">Pilih file atau tarik ke sini</p>
                      <p className="text-xs text-slate-500 mt-1">Mendukung format JPG, PNG, atau PDF (Maks 2MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  
                  
                >
                  Kirim Konfirmasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    
      {showSuccessModal && (
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
      
      {showSosConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-red-900/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-red-900/30 bg-red-950/20">
              <h3 className="text-xl font-bold text-red-500 flex items-center gap-2"><TriangleAlert className="w-6 h-6"/> KONFIRMASI DARURAT</h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                PERINGATAN: Sinyal Darurat akan dikirimkan langsung ke Sistem Komando Kemenhaj beserta data koordinat GPS Anda.
              </p>
              <p className="text-sm text-slate-300 mt-2 font-bold text-red-400">
                Apakah Anda benar-benar dalam kondisi darurat (penelantaran, ketiadaan tiket pulang, dll)?
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <Button onClick={confirmSOS} className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-bold text-base">
                YA, SAYA DALAM BAHAYA (KIRIM SOS)
              </Button>
              <Button onClick={() => setShowSosConfirmModal(false)} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 h-12 font-bold text-base">
                BATAL
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profil' && (
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
                          if (file.size > 1024 * 1024) { // 1MB limit
                            alert("Ukuran foto terlalu besar. Maksimal 1 MB.");
                            return;
                          }
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
                        <p className="text-sm font-bold text-slate-200 mt-0.5 font-mono">{userData?.porsiNumber || userData?.nomorPorsi || userData?.porsi || "-"}</p>
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

      {activeTab === 'aduan' && (
        <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-rose-950/40 to-slate-900 p-6 sm:p-8 border-b border-slate-800 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldAlert className="w-32 h-32 text-rose-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30 text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Lapor Aduan</h2>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">
                Ajukan pengaduan langsung ke Command Center Kementerian Haji dan Umrah jika Anda mengalami penelantaran, masalah layanan hotel/pesawat, atau tindakan penipuan oleh pihak travel.
              </p>
            </div>
          </div>
          
          <CardContent className="p-6 sm:p-8">
            {aduanSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Aduan Berhasil Dikirim</h3>
                <p className="text-sm text-slate-400">
                  Pengaduan Anda telah masuk ke sistem Bareskrim dan Kemenhaj. Petugas akan segera memproses laporan Anda.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAduan} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori Layanan</label>
                    <select 
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-rose-500 focus:outline-none transition-colors"
                      value={aduanForm.kategori}
                      onChange={(e) => setAduanForm({...aduanForm, kategori: e.target.value})}
                    >
                      <option value="UM">Umrah</option>
                      <option value="HK">Haji Khusus</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penyelenggara (Terdeteksi)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-sm text-slate-300 cursor-not-allowed"
                      value={myPackage?.pihkName || "PT. Penyelenggara"}
                      disabled
                    />
                    <p className="text-[10px] text-slate-500">Diambil otomatis dari data pendaftaran Anda.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Perihal Aduan</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Tiket pesawat hangus dan ditelantarkan di hotel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:border-rose-500 focus:outline-none transition-colors"
                    value={aduanForm.perihal}
                    onChange={(e) => setAduanForm({...aduanForm, perihal: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detail Kejadian</label>
                  <textarea 
                    placeholder="Ceritakan kronologi lengkap permasalahan yang Anda alami..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-white focus:border-rose-500 focus:outline-none transition-colors min-h-[160px] resize-y"
                    value={aduanForm.isi}
                    onChange={(e) => setAduanForm({...aduanForm, isi: e.target.value})}
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-800/50 flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingAduan || !aduanForm.perihal || !aduanForm.isi}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 px-8 rounded-lg shadow-lg shadow-rose-900/20 transition-all flex items-center gap-2"
                  >
                    {isSubmittingAduan ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Kirim Pengaduan Resmi
                      </>
                    )}
                  </Button>
                </div>
              </form>
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${badgeColor}`}>
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
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isPending || isInvestigasi || isSelesai ? 'bg-amber-500 ring-4 ring-slate-900' : 'bg-slate-800'}`}></div>
                          <span className={`text-[10px] font-bold ${isPending || isInvestigasi || isSelesai ? 'text-amber-500' : 'text-slate-500'}`}>Pending</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isInvestigasi || isSelesai ? 'bg-blue-500 ring-4 ring-slate-900' : 'bg-slate-800'}`}></div>
                          <span className={`text-[10px] font-bold ${isInvestigasi || isSelesai ? 'text-blue-500' : 'text-slate-500'}`}>Investigasi</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelesai ? 'bg-emerald-500 ring-4 ring-slate-900' : 'bg-slate-800'}`}></div>
                          <span className={`text-[10px] font-bold ${isSelesai ? 'text-emerald-500' : 'text-slate-500'}`}>Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </div>
      )}

      {showSosResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 text-center">
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${sosStatus === 'sent' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
                <TriangleAlert className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{sosStatus === 'sent' ? 'Sinyal Diterima Pusat' : 'Gagal Terkirim'}</h3>
              <p className="text-sm text-slate-300">{sosResultMsg}</p>
            </div>
            <div className="p-6">
              <Button onClick={() => setShowSosResultModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold h-12">
                TUTUP
              </Button>
            </div>
          </div>
        </div>
      )}
</div>
  );
}
