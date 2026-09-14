import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LogOut, Webhook, Menu, X, 
  LayoutDashboard, ClipboardCheck, 
  FileText, 
  CreditCard, 
  CalendarClock,
  ShieldAlert,
  PlaneTakeoff,
  Users,
  Building,
  Scan, Network, Palette,
  Activity,
  ShieldCheck,
  BookOpen,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const jemaahItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Beranda", href: "/jemaah" },
  { icon: User, label: "Profil Jemaah", href: "/jemaah/profil" },
  { icon: CreditCard, label: "Keuangan & Ledger BPKH", href: "/jemaah/keuangan" },
  { icon: FileText, label: "E-Vault & Dokumen", href: "/jemaah/dokumen" },
  { icon: CalendarClock, label: "Timeline Keberangkatan", href: "/jemaah/timeline" },
  { icon: ShieldAlert, label: "Lapor Aduan", href: "/jemaah/aduan" },
];

const penyelenggaraItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard KPI", href: "/penyelenggara" },
  { icon: PlaneTakeoff, label: "Manajemen Paket", href: "/penyelenggara/paket" },
  { icon: CreditCard, label: "Klaim Escrow", href: "/penyelenggara/escrow" },
  { icon: Users, label: "Manifes Jemaah", href: "/penyelenggara/manifes" },
  { icon: ClipboardCheck, label: "Operasional & Pelaporan", href: "/penyelenggara/operasional" },
  { icon: Network, label: "Konsorsium & Mutasi", href: "/penyelenggara/konsorsium" }, { icon: Scan, label: "Integrasi API (B2B)", href: "/penyelenggara/api" },
];

const adminItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Pantauan Kuota & Antrean", href: "/admin" },
  { icon: Building, label: "Verifikasi Penyelenggara", href: "/admin/registrasi" },
  { icon: FileText, label: "Kepatuhan Penyelenggara", href: "/admin/kepatuhan" },
  { icon: Activity, label: "Radar Kesiapan Operasional", href: "/admin/operasional" },
  { icon: ShieldAlert, label: "Early Warning System", href: "/admin/ews" },
  { icon: Users, label: "Rekap Aduan Jemaah", href: "/admin/aduan" },
  { icon: Scan, label: "Pindai Operator Lapangan", href: "/admin/scanner" },
  { icon: Network, label: "Ledger Mutasi Jemaah", href: "/admin/ledger" },
  { icon: Webhook, label: "Integrasi Lintas Instansi", href: "/admin/integrasi" },
  { icon: Palette, label: "Pengaturan Desain Portal", href: "/admin/desain" },
  { icon: BookOpen, label: "Manajemen Panduan", href: "/admin/panduan" },
  { icon: ShieldCheck, label: "Manajemen Admin", href: "/admin/manajemen-admin" },
];

export function DashboardLayout({ role }: { role: 'jemaah' | 'penyelenggara' | 'admin' }) {
  const location = useLocation();
  const { logoUrl } = useTheme();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (role === 'jemaah') {
      const uid = localStorage.getItem("jemaah_auth_uid");
      if (uid) {
        getDoc(doc(db, "users", uid)).then((userDoc) => {
          if (userDoc.exists()) {
            setUserName(userDoc.data()?.name || "Ahmad Jemaah");
          } else {
            setUserName("Ahmad Jemaah");
          }
        }).catch((e) => {
          console.error("Failed to load user name", e);
          setUserName("Ahmad Jemaah");
        });
      } else {
         navigate('/');
      }
    } else if (role === 'penyelenggara') {
      const uid = localStorage.getItem("penyelenggara_auth_uid");
      if (uid) {
        getDoc(doc(db, "users", uid)).then((userDoc) => {
          if (userDoc.exists()) {
            setUserName(userDoc.data()?.name || "PIHK / PPIU");
          } else {
            setUserName("PIHK / PPIU");
          }
        }).catch(() => setUserName("PIHK / PPIU"));
      } else {
        navigate('/login');
      }

    } else if (role === 'admin') {
      const nip = localStorage.getItem("admin_auth_nip");
      const name = localStorage.getItem("admin_auth_name");
      const adminRole = localStorage.getItem("admin_auth_role");
      if (nip) {
        setUserName(name || "General Admin");
        // We will store role in a state or ref if needed to filter sidebar
      } else {
        setUserName("Admin Command Center");
      }
    }
  }, [role, navigate]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);


  
  const handleLogout = async () => {
    if (role === 'jemaah') {
      localStorage.removeItem("jemaah_auth_uid");
      await signOut(auth);
      navigate("/login");
    } else if (role === 'penyelenggara') {
      localStorage.removeItem("penyelenggara_auth_uid");
      navigate("/login");
    } else if (role === 'admin') {
      localStorage.removeItem("admin_auth_nip");
      localStorage.removeItem("admin_auth_name");
      localStorage.removeItem("admin_auth_role");
      navigate("/login");
    }
  };


  
  const adminRoleLocal = localStorage.getItem("admin_auth_role");
  
  const filteredAdminItems = adminRoleLocal === "Super Admin" 
    ? adminItems 
    : adminItems.filter(item => item.label !== "Manajemen Admin");

  const sidebarItems = 
    role === 'jemaah' ? jemaahItems : 
    role === 'penyelenggara' ? penyelenggaraItems : 
    filteredAdminItems;

    
  const roleTitle = 
    role === 'jemaah' ? 'Portal Calon Jemaah' : 
    role === 'penyelenggara' ? 'Workspace Penyelenggara' : 
    'Admin Command Center';

  return (
    <div className="dashboard-shell flex min-h-screen min-w-0 theme-container font-sans">
      {/* Sidebar */}
      <aside className={`sidebar-gradient fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] border-r border-emerald-300/15 flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:w-72 lg:max-w-none lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-5">
          <Link to="/" className="min-w-0 font-bold text-lg tracking-tight theme-title flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-8 max-w-[80px] object-contain drop-shadow-md" />
            ) : (
              <div className="w-8 h-8 theme-primary-bg rounded-lg flex items-center justify-center font-bold theme-title shadow-lg">K</div>
            )}
            <div className="flex flex-col justify-center leading-tight">
              <span className="truncate">SISKOPATUH V.2</span>
              <span className="hidden text-[9px] font-normal opacity-80 mt-0.5 tracking-normal sm:block">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</span>
            </div>
          </Link>
          <button type="button" aria-label="Tutup navigasi" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 theme-title lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 sm:p-5">
          <div className="mb-3 text-[10px] font-bold theme-primary-text uppercase tracking-[0.2em]">
            {roleTitle}
          </div>
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-300/15 bg-slate-950/35 px-3 py-3" title={userName || "Memuat..."}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/30">
              {userName ? userName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold theme-title">{userName || "Memuat..."}</div>
              <div className="mt-0.5 text-[10px] theme-body opacity-60">Akun aktif</div>
            </div>
          </div>
          <div className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] theme-body opacity-50">Navigasi utama</div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-sky-500 border-emerald-300/40 text-slate-950 shadow-lg shadow-emerald-950/25 ring-1 ring-emerald-300/30"
                      : "bg-slate-950/20 theme-body border-transparent hover:bg-emerald-400/10 hover:border-emerald-300/15 hover:theme-title"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <button 
            className="w-full flex items-center justify-center gap-2 text-[10px] font-bold theme-primary-bg hover:opacity-90 shadow-sm border-transparent rounded-lg py-2 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            KELUAR
          </button>
        </div>
      </aside>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Tutup menu latar"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        
        <header className="min-h-16 border-b border-slate-800 flex items-center gap-3 px-3 py-3 sm:px-6 lg:px-8 z-10 flex-shrink-0 justify-between bg-black/20">
           <div className="flex min-w-0 items-center gap-3">
             <button
               type="button"
               aria-label="Buka navigasi"
               className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 theme-title lg:hidden"
               onClick={() => setMobileMenuOpen(true)}
             >
               {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </button>
             <h1 className="truncate text-base font-bold tracking-tight theme-title leading-none sm:text-xl">
               {sidebarItems.find(i => i.href === location.pathname)?.label || 'Dashboard'}
             </h1>
           </div>
           <div className="flex shrink-0 items-center gap-2 sm:gap-3">
             {role === 'admin' && (
               <div className="bg-rose-950/30 border border-rose-900/50 px-4 py-1.5 rounded-full flex items-center gap-2 mr-2">
                 <ShieldCheck className="w-4 h-4 text-rose-500" />
                 <span className="hidden text-[10px] font-bold text-rose-300 uppercase tracking-widest xl:inline">
                   Zona Aktif: {userName} <span className="text-rose-500/50 mx-1">•</span> Role: {adminRoleLocal || 'General'}
                 </span>
               </div>
             )}
             <div className="hidden bg-black/20 px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium items-center gap-2 sm:flex">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sistem Aktif
             </div>
             <div className="hidden max-w-40 truncate text-xs font-semibold theme-title sm:block" title={userName || "Memuat..."}>
               {userName || "Memuat..."}
             </div>
             <div className="h-9 w-9 rounded-full theme-primary-bg flex items-center justify-center theme-title font-bold text-sm shadow-lg shadow-emerald-900/20">
               {userName ? userName.charAt(0).toUpperCase() : '?'}
             </div>
           </div>
        </header>

        <div className="min-w-0 flex-1 overflow-auto p-3 pb-24 sm:p-6 sm:pb-6 flex flex-col">
          <Outlet />
          
          <footer className='mt-auto w-full pt-6 flex flex-col md:flex-row gap-2 justify-between items-center text-center text-[11px] leading-4 theme-body opacity-70 sm:text-xs'> 
            <div className="w-full md:w-auto">Portal SISKOPATUH V.2</div> 
            <div className="w-full break-words md:w-auto">KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA © 2026</div> 
          </footer>
        </div>
      </main>

      
    </div>
  );
}

