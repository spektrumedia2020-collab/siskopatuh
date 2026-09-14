import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/admin/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Remove "Sistem Komando Kemenhaj" from kuota tab.
const kuotaHeaderTarget = `          {/* Header Dashboard Khusus Tab Kuota */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight theme-title">Sistem Komando Kemenhaj</h1>
              <p className="text-sm text-slate-400">Pusat pemantauan lalu lintas penyelenggaraan Ibadah Haji & Umroh Nasional.</p>
            </div>`;

if (content.includes(kuotaHeaderTarget)) {
    content = content.replace(kuotaHeaderTarget, `          {/* Header Dashboard Khusus Tab Kuota */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight theme-title">Pantauan Kuota & Antrean</h1>
              <p className="text-sm text-slate-400">Pusat statistik pendaftaran dan keberangkatan jemaah nasional.</p>
            </div>`);
} else {
    // maybe single quotes or spacing is off?
    console.log("Could not find kuota header target. Will try regex.");
    const regex1 = /<h1[^>]*>Sistem Komando Kemenhaj<\/h1>\s*<p[^>]*>Pusat pemantauan lalu lintas penyelenggaraan Ibadah Haji & Umroh Nasional\.<\/p>/;
    content = content.replace(regex1, '<h1 className="text-2xl font-bold tracking-tight theme-title">Pantauan Kuota & Antrean</h1>\n              <p className="text-sm text-slate-400">Pusat statistik pendaftaran dan keberangkatan jemaah nasional.</p>');
}

// 2. Add "Sistem Komando Kemenhaj" globally at the top.
const globalTarget = `return (
    <div className="flex flex-col w-full text-slate-200">
      {/* Global SOS Alert */}`;

const newGlobalHeader = `return (
    <div className="flex flex-col w-full text-slate-200">
      {/* Header Dashboard Global */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight theme-title">Sistem Komando Kemenhaj</h1>
        <p className="text-sm theme-text-body/70 opacity-80">Pusat pemantauan lalu lintas penyelenggaraan Ibadah Haji & Umroh Nasional.</p>
      </div>
      
      {/* Global SOS Alert */}`;

content = content.replace(globalTarget, newGlobalHeader);

writeFileSync(file, content);
console.log("Replaced headers successfully.");
