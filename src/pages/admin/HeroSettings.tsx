import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Image as ImageIcon, MonitorPlay, Upload } from "lucide-react";
import { compressImage } from "../../lib/utils";

export function HeroSettings() {
  const { heroSettings, setHeroSettings } = useTheme();
  
  const [formData, setFormData] = useState(heroSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file, 1200, 0.6);
        setFormData(prev => ({ ...prev, backgroundImageUrl: compressedBase64 }));
        setSaved(false);
      } catch (err) {
        console.error("Error compressing image:", err);
        alert("Gagal memproses gambar.");
      }
    }
  };

  const handleSave = () => {
    setHeroSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight theme-title">Pengaturan Hero Banner</h2>
        <p className="text-sm theme-body opacity-80">
          Sesuaikan teks dan gambar latar belakang untuk banner utama di halaman beranda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Form */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg theme-title flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--theme-primary)]" />
              Konten Hero Banner
            </CardTitle>
            <CardDescription className="theme-body opacity-70">
              Perubahan akan langsung diterapkan pada halaman publik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold theme-title">Judul Utama (Title)</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Pusat Kendali Operasional Haji & Umroh"
                className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-sm theme-body focus:border-[var(--theme-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold theme-title">Sub-judul (Subtitle)</label>
              <textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Contoh: Platform terpadu Kementerian Haji..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm theme-body focus:border-[var(--theme-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold theme-title">Gambar Latar Belakang (Upload dari Perangkat)</label>
              <p className="text-xs theme-body opacity-70 mb-2">
                Direkomendasikan gambar dengan resolusi <strong>1200x400 pixel</strong> (maksimal 2MB).
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors border border-slate-700 w-full sm:w-auto">
                  <Upload className="w-4 h-4" />
                  Pilih File Gambar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {formData.backgroundImageUrl && (
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, backgroundImageUrl: '' }));
                      setSaved(false);
                    }}
                    className="text-rose-400 hover:text-rose-300 border-slate-800 bg-slate-950 hover:bg-rose-500/10 w-full sm:w-auto"
                  >
                    Hapus Gambar
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Button 
                onClick={handleSave} 
                className="bg-[var(--theme-primary)] theme-button-text font-bold hover:opacity-90 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saved ? 'Tersimpan!' : 'Simpan Perubahan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Preview Panel */}
        <Card className="bg-slate-900 border-slate-800">
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
            {/* The actual preview box rendering the hero */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a]">
              <section 
                className="theme-card bg-opacity-50 relative overflow-hidden min-h-[300px] flex flex-col justify-center p-6 lg:p-8"
                style={formData.backgroundImageUrl ? {
                  backgroundImage: `url(${formData.backgroundImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: 'transparent'
                } : {}}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--theme-primary)] to-transparent pointer-events-none"></div>
                
                {formData.backgroundImageUrl && (
                  <div className="absolute inset-0 bg-slate-900/60 pointer-events-none"></div>
                )}

                <div className="relative z-10 w-full max-w-2xl">
                  {formData.title && (
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-md mb-2">
                      {formData.title}
                    </h1>
                  )}
                  {formData.subtitle && (
                    <p className="text-xs md:text-sm text-slate-200 drop-shadow-md leading-relaxed line-clamp-3">
                      {formData.subtitle}
                    </p>
                  )}
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
