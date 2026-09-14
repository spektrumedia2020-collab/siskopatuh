import React, { useState, useEffect } from "react";
import { Palette, PaintBucket, Image as ImageIcon, Layout, Upload, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { compressImage } from "../../lib/utils";


function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0,2),16);
  var g = parseInt(hexcolor.substr(2,2),16);
  var b = parseInt(hexcolor.substr(4,2),16);
  var yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

export function TemaSettings() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { logoUrl, setLogoUrl, colors, setColors } = useTheme();
  const [localColors, setLocalColors] = useState(colors);
  
  useEffect(() => {
    setLocalColors(colors);
  }, [colors]);

  return (
    <div className="flex flex-col gap-6 flex-grow">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Pengaturan Tema & Visual Halaman
        </h3>
        
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Form Controls */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Logo & Branding */}
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm theme-title flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-500" /> Logo & Identitas Header
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Logo Utama</label>
                  <label className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block w-full ${logoFile ? 'bg-emerald-900/20 border-emerald-500/50' : 'border-slate-700 hover:bg-slate-900'}`}>
                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                      }
                    }} />
                    <Upload className={`w-6 h-6 mb-2 ${logoFile ? 'text-emerald-500' : 'text-slate-500'}`} />
                    <p className={`text-xs font-bold ${logoFile ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {logoFile ? logoFile.name : 'Pilih atau Seret Gambar Kesini'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {logoFile ? `Ukuran: ${(logoFile.size / 1024).toFixed(1)} KB` : 'Format didukung: PNG, JPG, SVG (Maks. 2MB)'}
                    </p>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Colors */}
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm theme-title flex items-center gap-2">
                  <PaintBucket className="w-4 h-4 text-emerald-500" /> Skema Warna Utama (Color Palette)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latar Belakang (Base BG)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.bg }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.bg} onChange={(e) => setLocalColors({...localColors, bg: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.bg} onChange={(e) => setLocalColors({...localColors, bg: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warna Primer (Aksen)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.primary }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.primary} onChange={(e) => setLocalColors({...localColors, primary: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.primary} onChange={(e) => setLocalColors({...localColors, primary: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latar Kotak (Card BG)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.card }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.card} onChange={(e) => setLocalColors({...localColors, card: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.card} onChange={(e) => setLocalColors({...localColors, card: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teks Judul (Title)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.textTitle }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.textTitle} onChange={(e) => setLocalColors({...localColors, textTitle: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.textTitle} onChange={(e) => setLocalColors({...localColors, textTitle: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teks Paragraf (Body)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.textBody }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.textBody} onChange={(e) => setLocalColors({...localColors, textBody: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.textBody} onChange={(e) => setLocalColors({...localColors, textBody: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warna Tombol Utama</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.buttonBg || localColors.primary }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.buttonBg || localColors.primary} onChange={(e) => setLocalColors({...localColors, buttonBg: e.target.value, textButton: getContrastYIQ(e.target.value)})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.buttonBg || localColors.primary} onChange={(e) => setLocalColors({...localColors, buttonBg: e.target.value, textButton: getContrastYIQ(e.target.value)})} />
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1">Warna teks akan disesuaikan otomatis (putih/hitam).</p>
                  </div>


                  
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                      <span>Transparansi Area Kotak (Card Opacity)</span>
                      <span className="text-emerald-400">{localColors.cardOpacity}%</span>
                    </label>
                    <input type="range" min="0" max="100" value={localColors.cardOpacity} className="w-full accent-emerald-500 mt-2" onChange={(e) => setLocalColors({...localColors, cardOpacity: parseInt(e.target.value)})} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scope Application */}
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm theme-title flex items-center gap-2">
                  <Layout className="w-4 h-4 text-emerald-500" /> Target Terapkan Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer">
                    <input type="radio" name="scope" className="accent-emerald-500 w-4 h-4" defaultChecked />
                    Semua Halaman (Global)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="radio" name="scope" className="accent-emerald-500 w-4 h-4" />
                    Halaman Publik Saja
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input type="radio" name="scope" className="accent-emerald-500 w-4 h-4" />
                    Halaman Spesifik
                  </label>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Preview & Save */}
          <div className="md:col-span-5 space-y-6">
            <Card className="bg-slate-950 border-slate-800 sticky top-6">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm theme-title">Pratinjau (Preview) Terkini</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="border rounded-xl overflow-hidden shadow-lg relative" style={{ borderColor: localColors.primary, backgroundColor: localColors.bg }}>
                  {/* Fake Header */}
                  <div className="border-b px-4 py-3 flex items-center justify-between relative z-10 backdrop-blur-sm" style={{ backgroundColor: `color-mix(in srgb, ${localColors.card} ${localColors.cardOpacity}%, transparent)`, borderColor: `${localColors.primary}40` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: `${localColors.primary}20` }}>
                        <ImageIcon className="w-3 h-3" style={{ color: localColors.primary }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase" style={{ color: localColors.textTitle }}>Sistem Portal (Judul)</span>
                    </div>
                    <div className="h-3 w-16 rounded-full border" style={{ backgroundColor: `${localColors.primary}10`, borderColor: `${localColors.primary}30` }}></div>
                  </div>
                  
                  {/* Fake Content */}
                  <div className="p-4 space-y-3 relative z-10">
                    <div className="text-[10px]" style={{ color: localColors.textBody }}>Teks isi (Body Text) akan terlihat seperti ini. Mengikuti warna yang Anda tentukan.</div>
                    <div className="h-10 w-full rounded-lg border flex items-center justify-center text-[10px] font-bold backdrop-blur-sm" style={{ backgroundColor: `color-mix(in srgb, ${localColors.card} ${localColors.cardOpacity}%, transparent)`, borderColor: `${localColors.primary}20`, color: localColors.primary }}>
                      KOMPONEN KARTU KONTEN
                    </div>
                    <div className="h-10 w-full rounded-lg flex items-center justify-center text-[10px] font-bold mt-4 shadow-lg" style={{ backgroundColor: localColors.primary, color: localColors.textButton }}>
                      TOMBOL AKSI (BUTTON)
                    </div>
                    

                  </div>
                </div>

                <Button className="w-full theme-primary-bg theme-button-text hover:opacity-90 mt-4 font-bold tracking-wider text-xs h-12" onClick={async (e) => {
                  const target = e.currentTarget;
                  // UPDATE CONTEXT
                  setColors(localColors);
                  
                  if (logoFile) {
                    try {
                      const compressedBase64 = await compressImage(logoFile, 400, 0.8);
                      setLogoUrl(compressedBase64);
                    } catch (err) {
                      console.error("Error compressing logo:", err);
                    }
                  }
                  
                  // VISUAL FEEDBACK
                  target.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> TERSIMPAN GLOBAL</span>';
                  target.classList.remove('theme-primary-bg', 'hover:opacity-90');
                  target.style.opacity = '0.5';
                  setTimeout(() => {
                    target.innerHTML = '<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> SIMPAN & TERAPKAN TEMA';
                    target.classList.add('theme-primary-bg', 'hover:opacity-90'); target.style.opacity = '';
                  }, 2000);
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  SIMPAN & TERAPKAN TEMA
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
