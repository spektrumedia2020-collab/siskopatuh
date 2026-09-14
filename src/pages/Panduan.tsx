import { defaultSections } from "../lib/defaultPanduanData";
import React, { useState, useEffect } from "react";
import { BookOpen, Users, Building, ShieldCheck, ChevronRight, FileText, Download, LayoutDashboard, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { defaultPdfBase64 } from "../lib/defaultPdf";

// Map string icon names to actual Lucide components
const IconMap: Record<string, React.ElementType> = {
  Users,
  Building,
  ShieldCheck,
  BookOpen,
  LayoutDashboard,
  Palette,
  FileText
};

export function Panduan() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "app_settings", "panduan_content"), (docSnap) => {
      if (!docSnap.exists() || !docSnap.data().sections || docSnap.data().sections.length < 3 || docSnap.data().sections[0].pages.length < 4) {
         // Data is old or missing, let's seed it with the new default data
         import("firebase/firestore").then(({ setDoc }) => {
            setDoc(doc(db, "app_settings", "panduan_content"), { sections: defaultSections }, { merge: true }).catch(console.error);
         });
      }

      if (docSnap.exists() && docSnap.data().sections) {
        const fetchedSections = docSnap.data().sections;
        // Fix for accidental "BAB BARU" overwrite
        if (fetchedSections.length === 1 && fetchedSections[0].title === "BAB BARU") {
          setSections(defaultSections);
        } else {
          setSections(fetchedSections);
        }
      } else {
        // Fallback to default sections if not configured in Firestore yet
        setSections(defaultSections);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

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
      
      const response = await fetch(base64ToDownload);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (e) {
      console.error("Download error:", e);
      const a = document.createElement("a");
      a.href = defaultPdfBase64;
      a.download = "Panduan_SISKOPATUH_V2.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };



  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex justify-center items-center h-64">
        <div className="text-slate-400 animate-pulse">Memuat Buku Panduan...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight theme-title flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[var(--theme-primary)]" />
            Panduan Pengguna SISKOPATUH V.2
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Dokumentasi lengkap daftar fitur, fungsi, dan langkah-langkah penggunaan aplikasi untuk seluruh tingkat pengguna.
          </p>
        </div>
        
        <button 
          onClick={handleDownloadPanduan}
          className="flex items-center gap-2 bg-[var(--theme-primary)] hover:opacity-90 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="space-y-10">
        {sections.map((section, idx) => {
          const IconComp = IconMap[section.iconName] || FileText;
          return (
            <section key={idx} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="p-2 bg-slate-800/50 rounded-lg">
                  <IconComp className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{section.title}</h2>
                  <p className="text-sm text-slate-400">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                {section.pages.map((page: any, pageIdx: number) => (
                  <Card key={pageIdx} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-emerald-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {page.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      <div>
                        <span className="font-bold text-slate-300 block mb-1">Fungsi Halaman:</span>
                        <p className="text-slate-400 leading-relaxed">{page.fungsi}</p>
                      </div>
                      
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="font-bold text-slate-300 flex items-center gap-2 mb-2">
                          Cara Mengakses Halaman:
                        </span>
                        <p className="text-slate-400 font-mono text-xs">{page.akses}</p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-300 block mb-2">Langkah-langkah Penggunaan:</span>
                        <ol className="list-decimal list-inside space-y-1.5 text-slate-400 ml-1">
                          {page.langkah.map((step: string, stepIdx: number) => (
                            <li key={stepIdx} className="pl-2">
                              <span className="text-slate-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
