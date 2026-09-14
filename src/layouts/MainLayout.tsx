import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Building2, Home, Landmark, Users, LogIn, Download, BookOpen, Menu, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { defaultPdfBase64 } from "../lib/defaultPdf";

export function MainLayout() {
  const location = useLocation();
  const { logoUrl } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownloadPanduan = async () => {
    try {
      const docRef = doc(db, "app_settings", "panduan_dokumen");
      const docSnap = await getDoc(docRef);
      
      let base64ToDownload = defaultPdfBase64;
      let filename = "Panduan_SISKOPATUH_V2.pdf";
      
      if (docSnap.exists() && docSnap.data().base64Data) {
        base64ToDownload = docSnap.data().base64Data;
        filename = docSnap.data().fileName || filename;
      }
      
      // Convert base64 to Blob for more reliable downloading in browsers
      const response = await fetch(base64ToDownload);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      
    } catch (e) {
      console.error("Download error:", e);
      // Fallback
      const a = document.createElement("a");
      a.href = defaultPdfBase64;
      a.download = "Panduan_SISKOPATUH_V2.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen flex min-w-0 flex-col overflow-x-hidden font-sans theme-container">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur transition-all duration-300">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 min-h-20 py-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-10 max-w-[96px] object-contain drop-shadow-md sm:max-h-12 sm:max-w-[110px]" />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--theme-primary)] rounded-xl flex items-center justify-center font-bold text-xl sm:text-2xl theme-button-text shadow-lg">K</div>
            )}
            <Link to="/" className="min-w-0 font-bold text-base sm:text-xl tracking-tight flex flex-col justify-center theme-title">
              <span className="truncate">SISKOPATUH V.2</span>
              <span className="hidden lg:block text-xs font-normal opacity-80 mt-0.5 tracking-normal">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Beranda</Link>
            <Link to="/cek-porsi" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/cek-porsi' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Cek Porsi</Link>
            <Link to="/direktori" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/direktori' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Direktori Penyelenggara</Link>
            <Link to="/panduan" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/panduan' ? 'text-emerald-400' : 'text-emerald-500/70 hover:text-emerald-400'} transition-colors flex items-center gap-1.5 ml-2`}>
              <BookOpen className="w-4 h-4" /> BACA PANDUAN
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" aria-label="Buka navigasi" aria-expanded={mobileMenuOpen} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 theme-title lg:hidden" onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wider uppercase theme-button-text shadow-lg hover:opacity-90 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">SSO LOGIN</span>
            </Link>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-white/10 bg-slate-950/95 px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold theme-title">Beranda</Link>
              <Link to="/cek-porsi" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold theme-title">Cek Porsi</Link>
              <Link to="/direktori" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold theme-title">Direktori Penyelenggara</Link>
              <Link to="/panduan" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold text-emerald-400">Baca Panduan</Link>
            </div>
          </nav>
        )}
      </header>

      <main className="min-w-0 flex-1 container mx-auto max-w-7xl bg-slate-950 px-3 py-4 sm:px-4 sm:py-6">
        <Outlet />
      </main>
      
      <footer className="border-t border-white/10 bg-slate-950 py-6 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col gap-5 text-xs theme-body">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="font-bold theme-title">SISKOPATUH V.2</div>
              <div className="mt-1 max-w-sm leading-5 opacity-70">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</div>
            </div>
            <nav aria-label="Navigasi footer" className="flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/" className="hover:text-emerald-400">Beranda</Link>
              <Link to="/cek-porsi" className="hover:text-emerald-400">Cek Porsi</Link>
              <Link to="/direktori" className="hover:text-emerald-400">Direktori</Link>
              <Link to="/panduan" className="hover:text-emerald-400">Panduan</Link>
            </nav>
          </div>
          <div className="border-t border-white/10 pt-4 text-[10px] opacity-60">KEMENTERIAN HAJI DAN UMRAH REPUBLIK INDONESIA © 2026</div>
        </div>
      </footer>
    </div>
  );
}
