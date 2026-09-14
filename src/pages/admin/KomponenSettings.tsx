import React, { useState, useEffect } from "react";
import { MousePointerClick, Save, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";

export function KomponenSettings() {
  const { colors, setColors } = useTheme();
  const [localColors, setLocalColors] = useState(colors);
  
  useEffect(() => {
    setLocalColors(colors);
  }, [colors]);

  return (
    <div className="flex flex-col gap-6 flex-grow">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
          <Box className="w-4 h-4" /> Pengaturan Komponen UI Khusus
        </h3>
        
        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column: Form Controls */}
          <div className="md:col-span-7 space-y-6">
            <Card className="bg-slate-950 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm theme-title flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-emerald-500" /> Warna Khusus Komponen
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warna Latar Tombol Utama</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.buttonBg || localColors.primary || '#10b981' }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.buttonBg || localColors.primary || '#10b981'} onChange={(e) => setLocalColors({...localColors, buttonBg: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.buttonBg || localColors.primary || '#10b981'} onChange={(e) => setLocalColors({...localColors, buttonBg: e.target.value})} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Mengontrol warna tombol-tombol CTA seperti "Cek Porsi" dan "Daftar Mandiri".</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warna Kotak Informasi (Kartu Info / Kuota Nasional)</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded border border-slate-700 overflow-hidden flex-shrink-0" style={{ backgroundColor: localColors.actionBox || '#020617' }}>
                        <input type="color" className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer" value={localColors.actionBox || '#020617'} onChange={(e) => setLocalColors({...localColors, actionBox: e.target.value})} />
                      </div>
                      <input type="text" className="flex-1 h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" value={localColors.actionBox || '#020617'} onChange={(e) => setLocalColors({...localColors, actionBox: e.target.value})} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Mengontrol warna khusus bagian kartu aksi dan info kuota (agar terpisah dari warna dasar kartu standar).</p>
                  </div>
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
                <div className="border rounded-xl overflow-hidden shadow-lg p-4 space-y-4" style={{ borderColor: localColors.primary, backgroundColor: localColors.bg }}>
                  
                  <div className="p-4 rounded-xl shadow-lg border border-white/10" style={{ backgroundColor: localColors.actionBox || '#020617', color: localColors.textTitle }}>
                    <div className="text-xs font-bold mb-2">Estimasi Keberangkatan / Info Kuota Nasional</div>
                    <div className="text-[10px] mb-4 opacity-70">Kotak ini menggunakan warna Latar Kotak Informasi.</div>
                    
                    <div className="h-9 w-full rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: localColors.buttonBg || localColors.primary, color: localColors.textButton }}>
                      TOMBOL AKSI UTAMA
                    </div>
                  </div>

                </div>
                <Button className="w-full theme-primary-bg theme-button-text hover:opacity-90 mt-4 font-bold tracking-wider text-xs h-12" onClick={(e) => {
                  setColors(localColors);
                  const target = e.currentTarget;
                  target.innerHTML = '<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> TERSIMPAN GLOBAL</span>';
                  target.classList.remove('theme-primary-bg', 'hover:opacity-90');
                  target.style.opacity = '0.5';
                  setTimeout(() => {
                    target.innerHTML = '<svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> SIMPAN & TERAPKAN KOMPONEN';
                    target.classList.add('theme-primary-bg', 'hover:opacity-90'); target.style.opacity = '';
                  }, 2000);
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  SIMPAN & TERAPKAN KOMPONEN
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
