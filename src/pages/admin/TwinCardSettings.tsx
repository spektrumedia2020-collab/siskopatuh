import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, MonitorPlay, Upload, LayoutTemplate } from "lucide-react";
import { compressImage } from "../../lib/utils";

export function TwinCardSettings() {
  const { twinCardSettings, setTwinCardSettings } = useTheme();
  
  const [formData, setFormData] = useState(twinCardSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (cardKey: 'leftCard' | 'rightCard', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [cardKey]: {
        ...prev[cardKey],
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleImageUpload = async (cardKey: 'leftCard' | 'rightCard', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file, 800, 0.6);
        handleChange(cardKey, 'imageUrl', compressedBase64);
      } catch (err) {
        console.error("Error compressing image:", err);
        alert("Gagal memproses gambar.");
      }
    }
  };

  const handleSave = () => {
    setTwinCardSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderCardEditor = (cardKey: 'leftCard' | 'rightCard', label: string) => (
    <div className="space-y-4 p-4 border border-slate-800 rounded-xl bg-slate-950/50">
      <h3 className="font-bold theme-title border-b border-slate-800 pb-2">{label}</h3>
      
      <div className="space-y-2">
        <label className="text-xs font-bold theme-title">Judul Card</label>
        <input
          type="text"
          value={formData[cardKey].title}
          onChange={(e) => handleChange(cardKey, 'title', e.target.value)}
          placeholder="Contoh: Info Terkini"
          className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-sm theme-body focus:border-[var(--theme-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold theme-title">Deskripsi Singkat</label>
        <textarea
          value={formData[cardKey].description}
          onChange={(e) => handleChange(cardKey, 'description', e.target.value)}
          placeholder="Deskripsi untuk card ini..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm theme-body focus:border-[var(--theme-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold theme-title">Gambar Latar (Upload dari Perangkat)</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors border border-slate-700 w-full sm:w-auto">
            <Upload className="w-4 h-4" />
            Pilih File
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(cardKey, e)}
              className="hidden"
            />
          </label>
          
          {formData[cardKey].imageUrl && (
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => handleChange(cardKey, 'imageUrl', '')}
              className="text-rose-400 hover:text-rose-300 border-slate-800 bg-slate-950 hover:bg-rose-500/10 w-full sm:w-auto text-xs h-8"
            >
              Hapus Gambar
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight theme-title">Pengaturan Banner Tambahan (Twin Cards)</h2>
        <p className="text-sm theme-body opacity-80">
          Sesuaikan dua kotak banner (rasio 1:2) di bawah Hero Banner.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Form */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg theme-title flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-[var(--theme-primary)]" />
              Konten Banner
            </CardTitle>
            <CardDescription className="theme-body opacity-70">
              Pengaturan kotak persegi (kiri) dan kotak panjang (kanan).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {renderCardEditor('leftCard', 'Kotak Kiri (Rasio 1/3)')}
            {renderCardEditor('rightCard', 'Kotak Kanan (Rasio 2/3)')}

            <div className="pt-4 border-t border-slate-800">
              <Button 
                onClick={handleSave} 
                className="bg-[var(--theme-primary)] theme-button-text font-bold hover:opacity-90 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Save className="w-4 h-4" />
                {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview Panel */}
        <Card className="bg-slate-900 border-slate-800 xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg theme-title flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-emerald-500" />
              Live Preview
            </CardTitle>
            <CardDescription className="theme-body opacity-70">
              Tampilan banner saat ini pada halaman Publik.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] p-4">
              
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Card (1/3) */}
                <Card className="theme-card border-white/10 shadow-xl col-span-1 overflow-hidden relative min-h-[250px] flex flex-col justify-end p-6">
                  {formData.leftCard.imageUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${formData.leftCard.imageUrl})` }}
                    />
                  )}
                  {/* Dim overlay */}
                  {(formData.leftCard.imageUrl || formData.leftCard.title) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none"></div>
                  )}
                  
                  <div className="relative z-10 mt-auto">
                    {formData.leftCard.title && (
                      <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                        {formData.leftCard.title}
                      </h3>
                    )}
                    {formData.leftCard.description && (
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {formData.leftCard.description}
                      </p>
                    )}
                  </div>
                </Card>

                {/* Right Card (2/3) */}
                <Card className="theme-card border-white/10 shadow-xl col-span-1 lg:col-span-2 overflow-hidden relative min-h-[250px] flex flex-col justify-end p-6 lg:p-8">
                  {formData.rightCard.imageUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${formData.rightCard.imageUrl})` }}
                    />
                  )}
                  {/* Dim overlay */}
                  {(formData.rightCard.imageUrl || formData.rightCard.title) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none"></div>
                  )}

                  <div className="relative z-10 mt-auto max-w-xl">
                    {formData.rightCard.title && (
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                        {formData.rightCard.title}
                      </h3>
                    )}
                    {formData.rightCard.description && (
                      <p className="text-sm lg:text-base text-slate-300 line-clamp-3">
                        {formData.rightCard.description}
                      </p>
                    )}
                  </div>
                </Card>
              </section>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
