import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ThemeColors {
  bg: string;
  primary: string;
  card: string;
  cardOpacity: number;
  textTitle: string;
  textBody: string;
  textButton: string;
  actionBox: string;
  buttonBg: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
}

export interface TwinCardConfig {
  title: string;
  description: string;
  imageUrl: string;
}

export interface TwinCardSettings {
  leftCard: TwinCardConfig;
  rightCard: TwinCardConfig;
}

interface ThemeContextType {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  heroSettings: HeroSettings;
  setHeroSettings: (settings: HeroSettings) => void;
  twinCardSettings: TwinCardSettings;
  setTwinCardSettings: (settings: TwinCardSettings) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultColors: ThemeColors = {
  bg: '#0f172a',
  primary: '#10b981',
  card: '#020617',
  cardOpacity: 100,
  textTitle: '#ffffff',
  textBody: '#f8fafc',
  textButton: '#ffffff',
  actionBox: '#020617',
  buttonBg: '#10b981'
};

const defaultHeroSettings: HeroSettings = {
  title: '',
  subtitle: '',
  backgroundImageUrl: ''
};

const defaultTwinCardSettings: TwinCardSettings = {
  leftCard: { title: '', description: '', imageUrl: '' },
  rightCard: { title: '', description: '', imageUrl: '' }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);
  const [colors, setColorsState] = useState<ThemeColors>(defaultColors);
  const [heroSettings, setHeroSettingsState] = useState<HeroSettings>(defaultHeroSettings);
  const [twinCardSettings, setTwinCardSettingsState] = useState<TwinCardSettings>(defaultTwinCardSettings);

  // Sync from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'theme'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logoUrl !== undefined) setLogoUrlState(data.logoUrl);
        if (data.colors) setColorsState({ ...defaultColors, ...data.colors });
        if (data.heroSettings) setHeroSettingsState({ ...defaultHeroSettings, ...data.heroSettings });
        if (data.twinCardSettings) setTwinCardSettingsState({ ...defaultTwinCardSettings, ...data.twinCardSettings });
      }
    });
    return () => unsub();
  }, []);

  const updateFirestore = async (key: string, value: any) => {
    try {
      await setDoc(doc(db, 'settings', 'theme'), { [key]: value }, { merge: true });
    } catch (e) {
      console.error("Error updating theme:", e);
    }
  };

  const setLogoUrl = (url: string | null) => { 
    setLogoUrlState(url); 
    updateFirestore('logoUrl', url); 
  };
  
  const setColors = (c: ThemeColors) => { 
    setColorsState(c); 
    updateFirestore('colors', c); 
  };
  
  const setHeroSettings = (settings: HeroSettings) => { 
    setHeroSettingsState(settings); 
    updateFirestore('heroSettings', settings); 
  };
  
  const setTwinCardSettings = (settings: TwinCardSettings) => { 
    setTwinCardSettingsState(settings); 
    updateFirestore('twinCardSettings', settings); 
  };

  return (
    <ThemeContext.Provider value={{ logoUrl, setLogoUrl, colors, setColors, heroSettings, setHeroSettings, twinCardSettings, setTwinCardSettings }}>
      <style>{`
        :root {
          --theme-bg: ${colors.bg};
          --theme-primary: ${colors.primary};
          --theme-card: ${colors.card};
          --theme-card-opacity: ${colors.cardOpacity}%;
          
          /* Calculate hex with alpha for card background */
          --theme-card-bg-alpha: color-mix(in srgb, var(--theme-card) var(--theme-card-opacity), transparent);

          --theme-text-title: ${colors.textTitle};
          --theme-text-body: ${colors.textBody};
          --theme-text-button: ${colors.textButton};
          --theme-action-box: ${colors.actionBox || "#020617"};
          --theme-button-bg: ${colors.buttonBg || colors.primary || "#10b981"};
        }
        
        .theme-container {
          background-color: var(--theme-bg);
          color: var(--theme-text-body);
          min-height: 100vh;
        }

        .theme-title {
          color: var(--theme-text-title) !important;
        }

        .theme-button-text { color: var(--theme-text-button) !important; }
        .theme-body {
          color: var(--theme-text-body) !important;
        }

        .theme-primary-text {
          color: var(--theme-primary) !important;
        }
        
        .theme-primary-bg {
          background-color: var(--theme-button-bg) !important;
          color: var(--theme-text-button) !important;
        }
        .theme-action-box {
          background-color: var(--theme-action-box) !important;
        }
        
        .theme-card {
          background-color: var(--theme-card-bg-alpha) !important;
          border-color: rgba(255,255,255,0.1) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
      <div className="theme-container font-sans">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
