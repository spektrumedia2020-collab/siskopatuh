import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Save, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { defaultSections } from "../../lib/defaultPanduanData";

export function ManajemenPanduan() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "app_settings", "panduan_content");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().sections) {
          const fetchedSections = docSnap.data().sections;
          if (fetchedSections.length === 1 && fetchedSections[0].title === "BAB BARU") {
            setSections(defaultSections);
            // Automatically restore the default data to Firestore
            await setDoc(docRef, { sections: defaultSections, updatedAt: new Date().toISOString() }, { merge: true });
          } else {
            setSections(fetchedSections);
          }
        } else {
          // Default minimal structure if empty
          setSections(defaultSections);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "app_settings", "panduan_content"), {
        sections: sections,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setToastMessage({ title: "Berhasil", desc: "Data panduan berhasil diupdate.", type: "success" });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      setToastMessage({ title: "Gagal", desc: "Terjadi kesalahan.", type: "error" });
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (idx: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[idx] = { ...newSections[idx], [field]: value };
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { title: "BAB BARU", iconName: "BookOpen", description: "", pages: [] }]);
  };

  const removeSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const addPage = (secIdx: number) => {
    const newSections = [...sections];
    newSections[secIdx].pages.push({
      name: "Halaman Baru",
      fungsi: "",
      akses: "",
      langkah: ["Langkah 1"]
    });
    setSections(newSections);
  };

  const updatePage = (secIdx: number, pageIdx: number, field: string, value: any) => {
    const newSections = [...sections];
    newSections[secIdx].pages[pageIdx] = { ...newSections[secIdx].pages[pageIdx], [field]: value };
    setSections(newSections);
  };

  const removePage = (secIdx: number, pageIdx: number) => {
    const newSections = [...sections];
    newSections[secIdx].pages = newSections[secIdx].pages.filter((_, i) => i !== pageIdx);
    setSections(newSections);
  };

  const updateLangkah = (secIdx: number, pageIdx: number, stepIdx: number, value: string) => {
    const newSections = [...sections];
    newSections[secIdx].pages[pageIdx].langkah[stepIdx] = value;
    setSections(newSections);
  };

  const addLangkah = (secIdx: number, pageIdx: number) => {
    const newSections = [...sections];
    newSections[secIdx].pages[pageIdx].langkah.push("Langkah Baru");
    setSections(newSections);
  };

  const removeLangkah = (secIdx: number, pageIdx: number, stepIdx: number) => {
    const newSections = [...sections];
    newSections[secIdx].pages[pageIdx].langkah = newSections[secIdx].pages[pageIdx].langkah.filter((_, i) => i !== stepIdx);
    setSections(newSections);
  };

  if (loading) return <div className="text-slate-400">Memuat data panduan...</div>;

  return (
    <div className="flex flex-col w-full text-slate-200 pb-16">
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 text-white ${toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <h4 className="font-bold">{toastMessage.title}</h4>
          <p className="text-sm">{toastMessage.desc}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight theme-title">Manajemen Panduan Aplikasi</h1>
          <p className="text-sm text-slate-400">Atur dan update fitur panduan ("Baca Panduan") yang akan dibaca oleh publik secara real-time.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <button 
            onClick={() => setSections(defaultSections)}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-slate-700"
          >
            Reset ke Default
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-lg transition-colors hover:bg-emerald-500"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Update Halaman Panduan"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 mr-4 space-y-3">
                <input 
                  value={section.title}
                  onChange={(e) => updateSection(sIdx, "title", e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  placeholder="Judul Bab..."
                />
                <input 
                  value={section.description}
                  onChange={(e) => updateSection(sIdx, "description", e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Deskripsi singkat bab..."
                />
              </div>
              <button onClick={() => removeSection(sIdx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="pl-6 space-y-4 border-l-2 border-slate-800 mt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Daftar Halaman/Fitur</h3>
              
              {section.pages.map((page: any, pIdx: number) => (
                <div key={pIdx} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 relative group">
                  <button onClick={() => removePage(sIdx, pIdx)} className="absolute top-3 right-3 text-red-400/50 hover:text-red-400 hidden group-hover:block">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="space-y-3 pr-8">
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Nama Halaman/Fitur</label>
                      <input 
                        value={page.name}
                        onChange={(e) => updatePage(sIdx, pIdx, "name", e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Fungsi Halaman</label>
                      <textarea 
                        value={page.fungsi}
                        onChange={(e) => updatePage(sIdx, pIdx, "fungsi", e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500 min-h-[60px]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Cara Akses (Route / Navigasi)</label>
                      <input 
                        value={page.akses}
                        onChange={(e) => updatePage(sIdx, pIdx, "akses", e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-2 block">Langkah-langkah</label>
                      <div className="space-y-2">
                        {page.langkah.map((step: string, stepIdx: number) => (
                          <div key={stepIdx} className="flex gap-2 items-center">
                            <span className="text-xs font-mono text-slate-500 w-4">{stepIdx + 1}.</span>
                            <input 
                              value={step}
                              onChange={(e) => updateLangkah(sIdx, pIdx, stepIdx, e.target.value)}
                              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-emerald-500"
                            />
                            <button onClick={() => removeLangkah(sIdx, pIdx, stepIdx)} className="p-1 text-slate-500 hover:text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => addLangkah(sIdx, pIdx)}
                        className="mt-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Langkah
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => addPage(sIdx)}
                className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-sm font-bold text-slate-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/5 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Fitur / Halaman di Bab Ini
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-sm font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/5 flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> TAMBAH BAB BARU
        </button>
      </div>
    </div>
  );
}
