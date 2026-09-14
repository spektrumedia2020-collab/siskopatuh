import { Outlet, Link, useLocation } from "react-router-dom";
import { Building2, Home, Landmark, Users, LogIn, Download, BookOpen } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { defaultPdfBase64 } from "../lib/defaultPdf";

export function MainLayout() {
  const location = useLocation();
  const { logoUrl } = useTheme();

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
    <div className="min-h-screen flex flex-col font-sans theme-container">
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 theme-card backdrop-blur supports-[backdrop-filter]:bg-opacity-60 transition-all duration-300">
        <div className="container mx-auto max-w-7xl px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-16 max-w-[120px] object-contain drop-shadow-md" />
            ) : (
              <div className="w-12 h-12 bg-[var(--theme-primary)] rounded-xl flex items-center justify-center font-bold text-2xl theme-button-text shadow-lg">K</div>
            )}
            <Link to="/" className="font-bold text-xl tracking-tight flex flex-col justify-center theme-title">
              <span>SISKOPATUH V.2</span>
              <span className="text-xs font-normal opacity-80 mt-0.5 tracking-normal">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Beranda</Link>
            <Link to="/cek-porsi" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/cek-porsi' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Cek Porsi</Link>
            <Link to="/direktori" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/direktori' ? 'text-[var(--theme-primary)]' : 'opacity-70 hover:opacity-100'}`}>Direktori Penyelenggara</Link>
            <Link to="/panduan" className={`text-sm font-bold tracking-wider uppercase ${location.pathname === '/panduan' ? 'text-emerald-400' : 'text-emerald-500/70 hover:text-emerald-400'} transition-colors flex items-center gap-1.5 ml-2`}>
              <BookOpen className="w-4 h-4" /> BACA PANDUAN
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-primary)] px-5 py-2.5 text-sm font-bold tracking-wider uppercase theme-button-text shadow-lg hover:opacity-90 transition-opacity"
            >
              <LogIn className="h-4 w-4" />
              SSO LOGIN
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="border-t border-slate-800 theme-card py-6 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-2 justify-between items-center text-[10px] opacity-50 font-mono">
          <div>Portal SISKOPATUH V.2 - By: Tim IT & Apps Develop - Kemenhaj RI</div>
          <div>KEMENTERIAN HAJI DAN UMROH REPUBLIK INDONESIA © 2026</div>
        </div>
      </footer>
    </div>
  );
}
