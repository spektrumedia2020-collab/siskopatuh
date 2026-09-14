import { useState, useEffect } from "react";
import { collection, getDocs, query, limit, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShieldCheck, CheckCircle2, MapPin, Phone, Mail, Award, AlertCircle, HelpCircle, ChevronRight, BookOpen, LogIn, ArrowRight, LockKeyhole, Gauge, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { useTheme } from "../contexts/ThemeContext";


const CustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text x={x + width + 10} y={y + height / 2 + 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="start">
      {value.toLocaleString('id-ID')}
    </text>
  );
};


const LiveSystemStatus = () => {
  const [statuses, setStatuses] = useState({
    bpkh: { status: 'checking', ping: 0 },
    siskohat: { status: 'checking', ping: 0 },
    imigrasi: { status: 'checking', ping: 0 }
  });

  useEffect(() => {
    // Simulasi Polling API setiap 10 detik
    const checkStatus = () => {
      setStatuses({
        bpkh: { status: 'checking', ping: 0 },
        siskohat: { status: 'checking', ping: 0 },
        imigrasi: { status: 'checking', ping: 0 }
      });

      setTimeout(() => {
        setStatuses({
          bpkh: { status: 'online', ping: Math.floor(Math.random() * 30) + 10 },
          siskohat: { status: 'online', ping: Math.floor(Math.random() * 50) + 15 },
          imigrasi: { status: 'online', ping: Math.floor(Math.random() * 40) + 12 }
        });
      }, 1500);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderStatus = (name: string, data: any) => (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg px-2 py-1.5 sm:justify-start sm:px-0 sm:py-0">
      <span className="truncate">{name}</span>
      <span className={`shrink-0 ${data.status === 'checking' ? 'text-amber-400' : 'text-emerald-400'}`}>
        {data.status === 'checking' ? 'Menghubungkan...' : `Online · ${data.ping} ms`}
      </span>
    </div>
  );

  return (
    <div className="mb-5 rounded-xl border border-white/10 bg-slate-900/50 p-3 sm:p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold theme-title">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        Status layanan (simulasi)
      </div>
      <div className="grid gap-1 text-xs theme-body sm:grid-cols-3 sm:gap-4">
        {renderStatus('Integrasi BPKH', statuses.bpkh)}
        {renderStatus('Siskohat', statuses.siskohat)}
        {renderStatus('Layanan Imigrasi', statuses.imigrasi)}
      </div>
    </div>
  );
};

export function PublicLanding() {
  const { heroSettings, twinCardSettings } = useTheme();
  const navigate = useNavigate();
  const [selectedBiro, setSelectedBiro] = useState<any>(null);
  const [kuotaHajiRegulerTotal, setKuotaHajiRegulerTotal] = useState(203320);
  const [kuotaHajiRegulerTerisi, setKuotaHajiRegulerTerisi] = useState(190000);
  const [kuotaHajiKhususTotal, setKuotaHajiKhususTotal] = useState(17680);
  const [kuotaHajiKhususTerisi, setKuotaHajiKhususTerisi] = useState(15000);
  const [kuotaUmrahTotal, setKuotaUmrahTotal] = useState(1500000);
  const [kuotaUmrahTerisi, setKuotaUmrahTerisi] = useState(1200000);
  const [regionData, setRegionData] = useState<any[]>([
    {
        name: 'Jawa Barat',
        value: 38723
    },
    {
        name: 'Jawa Timur',
        value: 35152
    },
    {
        name: 'Jawa Tengah',
        value: 30377
    },
    {
        name: 'Banten',
        value: 9461
    },
    {
        name: 'Sumatera Utara',
        value: 8328
    },
    {
        name: 'DKI Jakarta',
        value: 7927
    },
    {
        name: 'Sulawesi Selatan',
        value: 7272
    },
    {
        name: 'Lampung',
        value: 7050
    },
    {
        name: 'Sumatera Selatan',
        value: 7012
    },
    {
        name: 'Riau',
        value: 5030
    },
    {
        name: 'Sumatera Barat',
        value: 4613
    },
    {
        name: 'Nusa Tenggara Barat',
        value: 4499
    },
    {
        name: 'Aceh',
        value: 4378
    },
    {
        name: 'Kalimantan Selatan',
        value: 3818
    },
    {
        name: 'DI Yogyakarta',
        value: 3147
    },
    {
        name: 'Jambi',
        value: 2909
    },
    {
        name: 'Kalimantan Timur',
        value: 2586
    },
    {
        name: 'Kalimantan Barat',
        value: 2519
    },
    {
        name: 'Sulawesi Tenggara',
        value: 2019
    },
    {
        name: 'Sulawesi Tengah',
        value: 1993
    },
    {
        name: 'Bengkulu',
        value: 1636
    },
    {
        name: 'Kalimantan Tengah',
        value: 1612
    },
    {
        name: 'Sulawesi Barat',
        value: 1453
    },
    {
        name: 'Kepulauan Riau',
        value: 1286
    },
    {
        name: 'Maluku',
        value: 1086
    },
    {
        name: 'Maluku Utara',
        value: 1076
    },
    {
        name: 'Papua',
        value: 1076
    },
    {
        name: 'Kepulauan Bangka Belitung',
        value: 1065
    },
    {
        name: 'Gorontalo',
        value: 978
    },
    {
        name: 'Papua Barat',
        value: 723
    },
    {
        name: 'Sulawesi Utara',
        value: 713
    },
    {
        name: 'Bali',
        value: 698
    },
    {
        name: 'Nusa Tenggara Timur',
        value: 668
    },
    {
        name: 'Kalimantan Utara',
        value: 416
    },
    {
        name: 'Papua Tengah',
        value: 350
    },
    {
        name: 'Papua Barat Daya',
        value: 300
    },
    {
        name: 'Papua Selatan',
        value: 250
    },
    {
        name: 'Papua Pegunungan',
        value: 200
    }
]);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'kuota');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.hajiRegulerTotal) setKuotaHajiRegulerTotal(data.hajiRegulerTotal);
        if (data.hajiRegulerTerisi) setKuotaHajiRegulerTerisi(data.hajiRegulerTerisi);
        if (data.hajiKhususTotal) setKuotaHajiKhususTotal(data.hajiKhususTotal);
        if (data.hajiKhususTerisi) setKuotaHajiKhususTerisi(data.hajiKhususTerisi);
        if (data.umrahTotal) setKuotaUmrahTotal(data.umrahTotal);
        if (data.umrahTerisi) setKuotaUmrahTerisi(data.umrahTerisi);
        
      }
    }, (error) => {
      console.error("Error fetching kuota:", error);
    });
    
    return () => unsubscribe();
  }, []);

  const totalNasionalKuota = kuotaHajiRegulerTotal + kuotaHajiKhususTotal;
  const totalTerisi = kuotaHajiRegulerTerisi + kuotaHajiKhususTerisi;
  const sisaKuota = Math.max(0, totalNasionalKuota - totalTerisi);
  const persentaseTerisi = totalNasionalKuota > 0 ? ((totalTerisi / totalNasionalKuota) * 100).toFixed(1) : "0.0";
  const regionBarColors = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16', '#3b82f6'];

  const [whitelist, setWhitelist] = useState<any[]>([]);

  useEffect(() => {
    const fetchWhitelist = async () => {
      try {
        const q = query(collection(db, "direktori"), limit(3));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWhitelist(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchWhitelist();
  }, []);

  

  
  const reportStats = [
    { name: "Haji Khusus (PIHK)", count: 47 },
    { name: "Umrah (PPIU)", count: 70 },
  ];
  const barColors = ['#ef4444', '#f59e0b'];
  const hasTwinCards = [twinCardSettings.leftCard, twinCardSettings.rightCard].some(
    (card) => card.title || card.description || card.imageUrl
  );
  const publicHeroTitle = heroSettings.title
    .replace(/\bKementrian\b/g, 'Kementerian')
    .replace(/\bUmroh\b/g, 'Umrah');
  const isGenericHero = !publicHeroTitle || /menghadirkan solusi masa depan/i.test(publicHeroTitle);
  const heroTitle = isGenericHero ? 'Sistem Terpadu Pengelolaan Umrah & Haji Khusus' : publicHeroTitle;
  const heroSubtitle = !heroSettings.subtitle || /pusat kendali operasional terpadu/i.test(heroSettings.subtitle)
    ? 'SISKOPATUH V2.0 menghadirkan pengelolaan yang terintegrasi, transparan, dan mudah diakses dalam satu portal.'
    : heroSettings.subtitle;


  return (
    <div className="public-landing flex min-w-0 flex-col w-full theme-body">

      {/* System Status Banner */}
      <LiveSystemStatus />

      {/* Primary landing hero */}
      <section className="relative mb-8 overflow-hidden rounded-[24px] border border-white/10 bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_38%)]"></div>
        <div className="relative grid items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-14">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Portal layanan terpadu
            </div>
            <h1 className="max-w-[680px] text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">{heroTitle}</h1>
            <p className="mt-5 max-w-[620px] text-base leading-7 text-slate-300 sm:text-lg">{heroSubtitle}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                Masuk SISKOPATUH <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/panduan" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
                <BookOpen className="h-4 w-4" /> Baca Panduan
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[250px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50 lg:block">
            {heroSettings.backgroundImageUrl ? (
              <img src={heroSettings.backgroundImageUrl} alt="Identitas visual SISKOPATUH" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.25),transparent_55%),linear-gradient(315deg,#0f172a,#111827)]"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-slate-950/75 p-4 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Satu portal, tiga kebutuhan utama</p>
              <p className="mt-2 text-sm leading-6 text-slate-200">Informasi porsi, direktori penyelenggara, dan panduan layanan dalam satu tempat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Twin Cards (Managed from Admin) */}
      {hasTwinCards && <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Card (1/3) */}
        <Card className="theme-card border-white/10 shadow-xl col-span-1 overflow-hidden relative min-h-[180px] max-h-[220px] flex flex-col justify-end p-5">
          {twinCardSettings.leftCard.imageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${twinCardSettings.leftCard.imageUrl})` }}
            />
          )}
          {/* Dim overlay */}
          {(twinCardSettings.leftCard.imageUrl || twinCardSettings.leftCard.title) && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none"></div>
          )}
          
          <div className="relative z-10 mt-auto">
            {twinCardSettings.leftCard.title && (
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                {twinCardSettings.leftCard.title}
              </h3>
            )}
            {twinCardSettings.leftCard.description && (
              <p className="text-sm text-slate-300 line-clamp-3">
                {twinCardSettings.leftCard.description}
              </p>
            )}
            {/* If no content at all, show empty placeholder height */}
            {!twinCardSettings.leftCard.title && !twinCardSettings.leftCard.imageUrl && (
              <div className="h-64 w-full"></div>
            )}
          </div>
        </Card>

        {/* Right Card (2/3) */}
        <Card className="theme-card border-white/10 shadow-xl col-span-1 lg:col-span-2 overflow-hidden relative min-h-[180px] max-h-[220px] flex flex-col justify-end p-5 lg:p-8">
          {twinCardSettings.rightCard.imageUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${twinCardSettings.rightCard.imageUrl})` }}
            />
          )}
          {/* Dim overlay */}
          {(twinCardSettings.rightCard.imageUrl || twinCardSettings.rightCard.title) && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none"></div>
          )}

          <div className="relative z-10 mt-auto max-w-xl">
            {twinCardSettings.rightCard.title && (
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                {twinCardSettings.rightCard.title}
              </h3>
            )}
            {twinCardSettings.rightCard.description && (
              <p className="text-sm lg:text-base text-slate-300 line-clamp-3">
                {twinCardSettings.rightCard.description}
              </p>
            )}
            {/* If no content at all, show empty placeholder height */}
            {!twinCardSettings.rightCard.title && !twinCardSettings.rightCard.imageUrl && (
              <div className="h-64 w-full"></div>
            )}
          </div>
        </Card>
      </section>}
      
      {/* Kewajiban PPIU PIHK Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
         <div className="p-4 bg-emerald-950/50 rounded-full border border-emerald-500/30 shrink-0 relative z-10">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
         </div>
         <div className="flex-1 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide">Kewajiban PPIU dan PIHK</h2>
            <p className="text-emerald-100/90 text-sm md:text-base font-medium mb-4">Laporkan Keberangkatan dan Kepulangan Jemaah Umrah & Haji Khusus Paling Lambat 1x24 Jam.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                  <div className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Sanksi Bertahap</div>
                  <div className="text-xs text-slate-300">1. Teguran Tertulis <br/> 2. Denda Administratif <br/> 3. Pembekuan Izin (Blokir SISKOPATUH) <br/> 4. Pencabutan Izin Usaha</div>
               </div>
               <div className="bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                  <div className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2"><MapPin className="w-4 h-4"/> Data Wajib</div>
                  <div className="text-xs text-slate-300">Identitas Jemaah, Nomor Paspor, Visa, Rute & Tanggal, Maskapai, dan Akomodasi/Hotel.</div>
               </div>
            </div>
         </div>
      </div>
      <section className="mb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">Akses cepat</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight theme-title">Layanan SISKOPATUH</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 theme-body sm:block">Pilih layanan yang Anda butuhkan untuk memulai.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/cek-porsi" className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <Search className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-4 text-base font-bold theme-title">Cek Porsi</h3>
            <p className="mt-2 text-sm leading-6 theme-body">Periksa informasi porsi haji Anda dengan mudah.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">Buka layanan <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
          </Link>
          <Link to="/direktori" className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <Network className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-4 text-base font-bold theme-title">Direktori Penyelenggara</h3>
            <p className="mt-2 text-sm leading-6 theme-body">Temukan informasi penyelenggara umrah dan haji khusus.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">Lihat direktori <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
          </Link>
          <Link to="/panduan" className="group rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">
            <BookOpen className="h-6 w-6 text-emerald-400" />
            <h3 className="mt-4 text-base font-bold theme-title">Baca Panduan</h3>
            <p className="mt-2 text-sm leading-6 theme-body">Pelajari cara menggunakan layanan SISKOPATUH.</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">Buka panduan <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
          </Link>
        </div>
      </section>
      {/* Action Items Moved from Hero */}
      <section className="flex flex-col md:flex-row items-stretch justify-between gap-6 mb-12">
        <div className="flex-1">
          <Card className="theme-action-box border border-white/10 rounded-2xl shadow-xl h-full flex flex-col justify-center">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold theme-title mb-2">Cek Estimasi Keberangkatan</h3>
              <p className="theme-body text-xs mb-6">Masukkan Nomor Porsi Anda untuk melihat estimasi tahun keberangkatan tanpa harus masuk ke sistem.</p>
              
              <form 
                className="flex gap-2" 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  const formData = new FormData(e.currentTarget);
                  const nomor = formData.get('nomor');
                  if (nomor) {
                    navigate(`/cek-porsi?nomor=${nomor}`); 
                  } else {
                    navigate('/cek-porsi');
                  }
                }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 theme-body" />
                  <input 
                    type="text" 
                    name="nomor"
                    placeholder="Contoh: 1000283948" 
                    className="h-9 w-full rounded-lg border border-slate-700 theme-card pl-9 pr-4 text-sm placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 theme-title"
                  />
                </div>
                <Button type="submit" className="theme-primary-bg theme-button-text hover:opacity-90 font-bold h-9 px-4 rounded-lg text-xs">
                  CEK PORSI
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-[320px] shrink-0">
          <Link to="/login" className="theme-primary-bg theme-button-text hover:opacity-90 px-6 py-4 rounded-xl text-sm font-bold transition-colors inline-flex justify-center items-center shadow-lg hover:-translate-y-1 transform duration-200 flex-1 text-center">
            DAFTAR MANDIRI (E-KYC)
          </Link>
          <Link to="/direktori" className="theme-primary-bg theme-button-text hover:opacity-90 px-6 py-4 rounded-xl text-sm font-bold transition-colors inline-flex justify-center items-center shadow-lg hover:-translate-y-1 transform duration-200 flex-1 text-center">
            CARI BIRO RESMI
          </Link>
        </div>
      </section>

            {/* Visualisasi Data Dashboard */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-primary)]/20 flex items-center justify-center text-[var(--theme-primary)]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight theme-title">Transparansi Kuota Nasional</h2>
            <p className="text-sm theme-body">Ringkasan data kuota jemaah haji dalam portal publik</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card className="theme-action-box border border-white/10 shadow-xl overflow-hidden flex flex-col h-full min-h-[400px]">
               <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-sm theme-title">Serapan Kuota Haji Nasional 2026</CardTitle>
               </CardHeader>
               <CardContent className="pt-6 flex flex-col flex-grow items-center justify-center">
                  <div className="text-center w-full">
                    <div className="flex justify-around w-full mb-8">
                       <div className="text-center">
                          <p className="text-[10px] theme-body font-bold uppercase tracking-widest mb-1">Total Porsi Haji</p>
                          <p className="text-3xl font-bold theme-title">{totalNasionalKuota.toLocaleString('id-ID')}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Terisi ({persentaseTerisi}%)</p>
                          <p className="text-3xl font-bold text-emerald-400">{totalTerisi.toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                    
                    <div className="relative pt-4">
                       <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden shadow-inner border border-white/5">
                          <div className="bg-[var(--theme-primary)] h-4 rounded-full transition-all duration-1000" style={{ width: `${persentaseTerisi}%` }}></div>
                       </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between px-8">
                       <div className="text-left">
                         <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Haji Reguler</p>
                         <p className="text-xl font-bold text-white mt-1">{kuotaHajiRegulerTerisi.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/ {kuotaHajiRegulerTotal.toLocaleString('id-ID')}</span></p>
                       </div>
                       <div className="text-center border-l border-r border-white/10 px-8">
                         <p className="text-xs theme-body font-bold uppercase tracking-widest">Sisa Total Porsi</p>
                         <p className="text-3xl font-light theme-title mt-2 tracking-tighter">{sisaKuota.toLocaleString('id-ID')}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Haji Khusus (PIHK)</p>
                         <p className="text-xl font-bold text-white mt-1">{kuotaHajiKhususTerisi.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/ {kuotaHajiKhususTotal.toLocaleString('id-ID')}</span></p>
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <Card className="theme-action-box border border-white/10 shadow-xl overflow-hidden flex flex-col h-full">
               <CardHeader className="border-b border-white/5 pb-4">
                  <CardTitle className="text-sm theme-title text-amber-400">Keberangkatan Umrah (Sepanjang Tahun)</CardTitle>
               </CardHeader>
               <CardContent className="pt-6 flex flex-col flex-grow items-center justify-center">
                  <div className="text-center w-full">
                     <p className="text-xs text-slate-400 mb-2">Total Keberangkatan Jemaah</p>
                     <p className="text-4xl font-bold text-amber-400 tracking-tighter">{kuotaUmrahTerisi.toLocaleString('id-ID')}</p>
                     <p className="text-xs text-slate-500 mt-2">Dari target tahunan: {kuotaUmrahTotal.toLocaleString('id-ID')}</p>
                     
                     <div className="w-full bg-slate-800 rounded-full h-2.5 mt-6 border border-slate-700">
                        <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${Math.min(100, (kuotaUmrahTerisi / kuotaUmrahTotal) * 100)}%` }}></div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 mt-6">
          <Card className="theme-action-box border border-white/10 shadow-xl overflow-hidden flex flex-col h-[400px]">
             <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-sm theme-title">Serapan Kuota Nasional 2026</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 flex flex-col flex-grow items-center justify-center">
                <div className="text-center w-full">
                  <div className="flex justify-around w-full mb-8">
                     <div className="text-center">
                        <p className="text-[10px] theme-body font-bold uppercase tracking-widest mb-1">Total Nasional</p>
                        <p className="text-3xl font-bold theme-title">{totalNasionalKuota.toLocaleString('id-ID')}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Terisi ({persentaseTerisi}%)</p>
                        <p className="text-3xl font-bold text-emerald-400">{totalTerisi.toLocaleString('id-ID')}</p>
                     </div>
                  </div>
                  
                  <div className="relative pt-4">
                     <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden shadow-inner border border-white/5">
                        <div className="bg-[var(--theme-primary)] h-4 rounded-full transition-all duration-1000" style={{ width: `${persentaseTerisi}%` }}></div>
                     </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5">
                     <p className="text-xs theme-body font-bold uppercase tracking-widest">Sisa Porsi Saat Ini</p>
                     <p className="text-4xl font-light theme-title mt-2 tracking-tighter">{sisaKuota.toLocaleString('id-ID')}</p>
                  </div>
                </div>
             </CardContent>
          </Card>

          {/* Card: Region Chart */}
          <Card className="theme-action-box border border-white/10 shadow-xl flex flex-col h-[400px]">
             <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-sm theme-title">Distribusi Kuota per Wilayah (38 Provinsi)</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 flex-grow flex flex-col relative w-full overflow-hidden">
                <div className="absolute inset-0 p-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10">
                  <div style={{ height: '1200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={90} tick={{fill: 'var(--theme-body-color, #94a3b8)', fontSize: 10}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--theme-card-bg, #0f172a)', borderColor: 'var(--theme-primary, #1e293b)', borderRadius: '8px', color: 'var(--theme-title-color, #f8fafc)'}} itemStyle={{color: '#ffffff', fontWeight: 'bold'}} formatter={(value) => [Number(value).toLocaleString('id-ID'), 'Total Kuota']} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} label={<CustomLabel />} isAnimationActive={false}>
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={regionBarColors[index % regionBarColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  </div>
                </div>
             </CardContent>
          </Card>
        </div>
      </section>

      {/* Important Info Section */}
      <section className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Info Calon Jemaah */}
        <Card className="theme-card border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <ShieldCheck className="w-32 h-32 text-emerald-500" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[var(--theme-primary)]/20 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-[var(--theme-primary)]" />
              </div>
              <h2 className="text-xl font-bold theme-title">Panduan Calon Jemaah</h2>
            </div>
            <ul className="space-y-4 text-sm theme-body">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Pastikan 5 Pasti Umrah:</strong> Pastikan Travel, Jadwal, Penerbangan, Hotel, dan Visanya berizin dan terdaftar resmi di sistem Kemenhaj.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Aman dengan Escrow BPKH:</strong> Jangan transfer dana ke rekening pribadi biro. Gunakan Virtual Account (VA) resmi. Dana Anda ditahan di Kas Negara hingga tiket dan visa terbit.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Daftar Mandiri (E-KYC):</strong> Lakukan pendaftaran awal secara mandiri lewat portal ini untuk mendapatkan porsi resmi tanpa perantara calo.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Info Penyelenggara */}
        <Card className="theme-card border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <AlertCircle className="w-32 h-32 text-amber-500" />
          </div>
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold theme-title">Informasi Penyelenggara</h2>
            </div>
            <ul className="space-y-4 text-sm theme-body">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Aturan Pencairan Escrow:</strong> Dana jemaah hanya akan dicairkan berdasarkan persentase Milestone (Kontrak Hotel, PNR Issued, dan Penerbitan Visa).</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Proof of Capacity (Atomic Lock):</strong> Anda WAJIB melampirkan PNR (Bukti Kapasitas Tiket) sebelum dapat membuat dan menayangkan paket baru ke publik.</p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p><strong className="theme-title">Kepatuhan SLA (EWS):</strong> Sistem memantau seluruh proses operasional secara real-time. Pelanggaran SLA akan langsung menurunkan Indeks Akreditasi dan visibilitas di Direktori Nasional.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>


      {/* Alur Escrow Section */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight theme-title">Alur Sistem Escrow</h2>
            <p className="text-sm theme-body">Jaminan Keamanan Dana Jemaah Kemenhaj</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          
          {/* Box 1 */}
          <div className="relative bg-slate-900/80 border-2 border-amber-400 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg ml-0 lg:ml-2">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Pembayaran<br/>Jamaah</h3>
            <p className="text-xs text-slate-400 leading-tight">Masuk ke rekening<br/>escrow</p>
          </div>

          {/* Box 2 */}
          <div className="relative bg-slate-900/80 border-2 border-orange-600 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg ml-0 lg:ml-4">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-orange-600 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-orange-600" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-orange-600 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Verifikasi Sistem<br/>(SISKOPATUH 2.0)</h3>
            <ul className="text-xs text-slate-400 list-disc pl-4 space-y-0.5">
              <li>Identitas</li>
              <li>Paket</li>
              <li>Jadwal</li>
            </ul>
          </div>

          {/* Box 3 */}
          <div className="relative bg-slate-900/80 border-2 border-yellow-900 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg ml-0 lg:ml-4">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-yellow-900 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-yellow-900" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-yellow-900 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-yellow-900" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Penguncian<br/>Dana</h3>
            <p className="text-xs text-slate-400 leading-tight">(Fund Locking)</p>
          </div>

          {/* Box 4 */}
          <div className="relative bg-slate-900/80 border-2 border-slate-400 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg ml-0 lg:ml-4">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-400 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-400 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Pencairan<br/>Bertahap</h3>
            <ul className="text-xs text-slate-400 list-disc pl-4 space-y-0.5">
              <li>Tiket: 30%</li>
              <li>Visa: 20%</li>
              <li>Hotel: 30%</li>
              <li>Keberangkatan: 20%</li>
            </ul>
          </div>

          {/* Box 5 (Row 2) */}
          <div className="relative bg-slate-900/80 border-2 border-orange-600 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg lg:col-start-3 ml-0 lg:ml-4 mt-0 lg:mt-4">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-orange-600 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-orange-600" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-orange-600 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Penyelesaian</h3>
            <ul className="text-xs text-slate-400 list-disc pl-4 space-y-0.5">
              <li>Refund jika<br/>gagal</li>
              <li>Penyaluran<br/>jika berhasil</li>
            </ul>
          </div>

          {/* Box 6 (Row 2) */}
          <div className="relative bg-slate-900/80 border-2 border-amber-400 rounded-lg p-5 flex flex-col justify-center min-h-[160px] shadow-lg ml-0 lg:ml-4 mt-0 lg:mt-4">
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center lg:hidden">
               <ChevronRight className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 items-center justify-center z-10">
               <ChevronRight className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm mb-2">Monitoring<br/>Real-Time<br/>oleh Kemenhaj</h3>
          </div>

        </div>
      </section>

      {/* Directory Whitelist Section */}
      <section className="theme-card/40 border border-white/10 rounded-2xl p-8">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight theme-title">Direktori Penyelenggara Resmi (Whitelist)</h2>
            <p className="text-xs theme-body">Pastikan biro travel Anda terdaftar dan terakreditasi resmi oleh Kementerian Haji untuk menghindari penipuan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whitelist.map((biro, i) => (
              <Card key={i} className="theme-card border border-white/10 rounded-2xl flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm theme-title mb-1">{biro.name}</h4>
                      <p className="text-[10px] font-mono theme-body">Izin: {biro.id}</p>
                    </div>
                    <span className="inline-flex items-center rounded bg-[var(--theme-primary)]/30 border border-[var(--theme-primary)]/30 px-2 py-0.5 text-[10px] font-bold text-[var(--theme-primary)]">
                      {biro.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs theme-body">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Akreditasi {biro.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs theme-body">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{biro.status} Kemenhaj</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-[10px] font-bold  hover: theme-body"
                    onClick={() => setSelectedBiro(biro)}
                  >
                    LIHAT DETAIL
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              className="text-[var(--theme-primary)] hover: text-[10px] font-bold hover: tracking-wider"
              onClick={() => navigate('/direktori')}
            >
              LIHAT SELURUH DIREKTORI &rarr;
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">Tentang portal</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight theme-title">Apa itu SISKOPATUH?</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 theme-body">SISKOPATUH merupakan sistem komputerisasi pengelolaan terpadu yang mendukung penyelenggaraan umrah dan haji khusus melalui layanan yang terintegrasi, transparan, dan mudah diakses.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3"><Network className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><h3 className="text-sm font-bold theme-title">Terintegrasi</h3><p className="mt-1 text-xs leading-5 theme-body">Data dan layanan dirangkum dalam satu portal.</p></div></div>
            <div className="flex gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><h3 className="text-sm font-bold theme-title">Transparan</h3><p className="mt-1 text-xs leading-5 theme-body">Informasi layanan disajikan lebih mudah dipahami.</p></div></div>
            <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><h3 className="text-sm font-bold theme-title">Aman</h3><p className="mt-1 text-xs leading-5 theme-body">Mendukung pemantauan proses dan dokumen jemaah.</p></div></div>
            <div className="flex gap-3"><Gauge className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><h3 className="text-sm font-bold theme-title">Efisien</h3><p className="mt-1 text-xs leading-5 theme-body">Akses informasi penting tanpa proses yang berbelit.</p></div></div>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-950/30 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Untuk publik</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">Mulai dari layanan yang Anda perlukan</h2>
          <p className="mt-4 text-sm leading-7 text-emerald-50/75">Gunakan akses resmi SISKOPATUH untuk memeriksa informasi, memahami panduan, atau masuk ke portal sesuai peran Anda.</p>
          <Link to="/login" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200">Masuk ke SISKOPATUH <LogIn className="h-4 w-4" /></Link>
        </div>
      </section>

      {/* FAQ / Help Desk Section */}
      <section className="mb-12">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight theme-title flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-500" />
            Pusat Bantuan & FAQ
          </h2>
          <p className="text-xs theme-body">Pertanyaan umum terkait Sistem Escrow, Persyaratan Visa, dan Layanan Aduan Terpadu.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Jemaah */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
              <span className="bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Untuk Jemaah</span>
            </div>
            
            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Bagaimana cara kerja sistem Escrow untuk uang saya?</h4>
                <p className="text-xs theme-body leading-relaxed">Uang Anda disetorkan ke Virtual Account yang dikelola BPKH/Kemenhaj. Dana tidak akan diserahkan ke pihak Travel hingga tiket dan visa Anda resmi terbit. Hal ini menjamin keamanan dana dari risiko penyalahgunaan.</p>
              </CardContent>
            </Card>

            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Apa saja syarat utama pengurusan Visa?</h4>
                <p className="text-xs theme-body leading-relaxed">Persyaratan wajib meliputi: Paspor aktif minimal 6 bulan sebelum keberangkatan, rekam biometrik, dan bukti vaksinasi yang dipersyaratkan oleh Pemerintah Arab Saudi. Sistem terintegrasi dengan Imigrasi.</p>
              </CardContent>
            </Card>

            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Bagaimana jika Penyelenggara gagal memberangkatkan saya?</h4>
                <p className="text-xs theme-body leading-relaxed">Anda dapat melaporkan langsung melalui menu "Aduan" di Dasbor Anda. Karena dana Anda ditahan aman di Escrow, Kemenhaj dapat memfasilitasi proses refund 100% atau pemindahan ke Penyelenggara lain.</p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ PPIU */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Untuk Penyelenggara (PPIU/PIHK)</span>
            </div>

            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Kapan dana Escrow bisa kami cairkan?</h4>
                <p className="text-xs theme-body leading-relaxed">Pencairan dilakukan bertahap (Milestone-based). Termin 1 (DP) cair setelah kontrak akomodasi terverifikasi, Termin 2 (Operasional) saat tiket & visa terbit, dan Termin 3 (Settlement) setelah kepulangan Jemaah.</p>
              </CardContent>
            </Card>

            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Mengapa saya tidak bisa menambah kuota paket?</h4>
                <p className="text-xs theme-body leading-relaxed">Sistem menerapkan fitur Atomic Locking (Proof of Capacity). Anda diwajibkan untuk mengunggah PNR (bukti blok seat maskapai) terlebih dahulu. Kapasitas maksimum jemaah akan dikunci otomatis sesuai jumlah seat PNR.</p>
              </CardContent>
            </Card>

            <Card className="theme-card border-white/10 shadow-xl">
              <CardContent className="p-5 space-y-2">
                <h4 className="text-sm font-bold theme-title">Bagaimana cara menangani Aduan agar SLA tidak turun?</h4>
                <p className="text-xs theme-body leading-relaxed">Tiap notifikasi aduan Jemaah akan masuk ke Dashboard EWS Kemenhaj. Anda wajib memberikan tanggapan resmi maksimal dalam waktu 1x24 jam untuk menghindari penalti penurunan Indeks Kepatuhan Akreditasi Anda.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Biro Detail Modal */}
      {selectedBiro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="theme-card border border-white/10 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded bg-[var(--theme-primary)]/30 border border-[var(--theme-primary)]/30 px-2 py-0.5 text-[10px] font-bold text-[var(--theme-primary)]">
                    {selectedBiro.type}
                  </span>
                  <span className="text-[10px] font-mono theme-body">Izin Kemenhaj: {selectedBiro.id}</span>
                </div>
                <h3 className="text-xl font-bold theme-title leading-tight">{selectedBiro.name}</h3>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-900/20 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
                  <div className="text-[10px] theme-body font-bold uppercase tracking-wider mb-1">Akreditasi</div>
                  <div className="text-sm font-medium text-[var(--theme-primary)] flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    {selectedBiro.rating}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
                  <div className="text-[10px] theme-body font-bold uppercase tracking-wider mb-1">Status Kemenhaj</div>
                  <div className="text-sm font-medium theme-body flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {selectedBiro.status}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
                  <div className="text-[10px] theme-body font-bold uppercase tracking-wider mb-1">Kapasitas Maksimal</div>
                  <div className="text-sm font-medium theme-body">{selectedBiro.quota}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-white/10">
                  <div className="text-[10px] theme-body font-bold uppercase tracking-wider mb-1">Beroperasi Sejak</div>
                  <div className="text-sm font-medium theme-body">{selectedBiro.since}</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[10px] theme-body font-bold uppercase tracking-wider border-b border-white/10 pb-2">Informasi Kontak</div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 theme-body mt-0.5 shrink-0" />
                  <div className="text-sm theme-body">{selectedBiro.address}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 theme-body shrink-0" />
                  <div className="text-sm theme-body">{selectedBiro.phone}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 theme-body shrink-0" />
                  <div className="text-sm theme-body">{selectedBiro.email}</div>
                </div>
              </div>
              
              <div className="bg-[var(--theme-primary)]/10 border border-emerald-500/20 rounded-lg p-3 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <p className="text-xs text-[var(--theme-primary)]/90 leading-relaxed">
                  Penyelenggara ini telah diverifikasi dan memiliki izin resmi yang masih berlaku dari Kementerian Haji RI. Aman untuk digunakan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-slate-950/50">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedBiro(null)}
                className="theme-body hover:theme-title"
              >
                Tutup
              </Button>
              <Button 
                className="theme-primary-bg theme-button-text hover:opacity-90 font-bold"
                onClick={() => navigate('/login')}
              >
                Daftar Paket via Biro Ini
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

