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
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab('tema')}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors sm:px-4 sm:py-3 ${activeTab === 'tema' ? 'bg-slate-900 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <Palette className="w-4 h-4" /> Pengaturan Tema
        </button>
        <button 
          onClick={() => setActiveTab('hero')}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors sm:px-4 sm:py-3 ${activeTab === 'hero' ? 'bg-slate-900 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <MonitorPlay className="w-4 h-4" /> Pengaturan Hero Banner
        </button>
        <button 
          onClick={() => setActiveTab('twincard')}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors sm:px-4 sm:py-3 ${activeTab === 'twincard' ? 'bg-slate-900 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <LayoutTemplate className="w-4 h-4" /> Pengaturan Banner Info
        </button>
        <button 
          onClick={() => setActiveTab('komponen')}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors sm:px-4 sm:py-3 ${activeTab === 'komponen' ? 'bg-slate-900 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
        >
          <Box className="w-4 h-4" /> Pengaturan Komponen
        </button>
      </div>

      <div className="min-w-0 flex-grow rounded-b-2xl border-x border-b border-slate-800 bg-slate-900 p-3 sm:p-6">
        {activeTab === 'tema' && <TemaSettings />}
        {activeTab === 'hero' && <HeroSettings />}
        {activeTab === 'twincard' && <TwinCardSettings />}
        {activeTab === 'komponen' && <KomponenSettings />}
      </div>
    </div>
  );
}
