import React, { useState } from "react";
import { TemaSettings } from "./TemaSettings";
import { HeroSettings } from "./HeroSettings";
import { TwinCardSettings } from "./TwinCardSettings";
import { KomponenSettings } from "./KomponenSettings";
import { Box } from "lucide-react";
import { Palette, MonitorPlay, LayoutTemplate } from "lucide-react";

export function DesainPortal() {
  const [activeTab, setActiveTab] = useState<'tema' | 'hero' | 'twincard' | 'komponen'>('tema');

  return (
    <div className="flex flex-col flex-grow h-full">
      <div className="flex space-x-2 border-b border-slate-800 pb-0">
        <button 
          onClick={() => setActiveTab('tema')}
          className={`px-4 py-3 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'tema' ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <Palette className="w-4 h-4" /> Pengaturan Tema
        </button>
        <button 
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'hero' ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <MonitorPlay className="w-4 h-4" /> Pengaturan Hero Banner
        </button>
        <button 
          onClick={() => setActiveTab('twincard')}
          className={`px-4 py-3 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'twincard' ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <LayoutTemplate className="w-4 h-4" /> Pengaturan Banner Info
        </button>
        <button 
          onClick={() => setActiveTab('komponen')}
          className={`px-4 py-3 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === 'komponen' ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
        >
          <Box className="w-4 h-4" /> Pengaturan Komponen
        </button>
      </div>

      <div className="bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl rounded-tr-2xl p-6 flex-grow">
        {activeTab === 'tema' && <TemaSettings />}
        {activeTab === 'hero' && <HeroSettings />}
        {activeTab === 'twincard' && <TwinCardSettings />}
        {activeTab === 'komponen' && <KomponenSettings />}
      </div>
    </div>
  );
}
