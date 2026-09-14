const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

if (content.indexOf('react-qr-code') === -1) {
  content = `import QRCode from 'react-qr-code';\n` + content;
}

const targetQR = `<div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full border-2 border-slate-700 flex flex-col justify-center items-center overflow-hidden">
                <User className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Halo, {userData.name}</h2>
                <div className="flex gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-xs bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50"><CreditCard className="w-3 h-3" /> Porsi: {userData.porsiNumber}</span>
                  <span className="flex items-center gap-1 font-mono text-xs bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50"><MapPin className="w-3 h-3" /> Embarkasi {userData.embarkasi || 'CGK'}</span>
                </div>
              </div>
            </div>`;

const replacementQR = `<div className="flex justify-between items-center w-full">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full border-2 border-slate-700 flex flex-col justify-center items-center overflow-hidden">
                <User className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Halo, {userData.name}</h2>
                <div className="flex gap-3 mt-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-xs bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50"><CreditCard className="w-3 h-3" /> Porsi: {userData.porsiNumber}</span>
                  <span className="flex items-center gap-1 font-mono text-xs bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50"><MapPin className="w-3 h-3" /> Embarkasi {userData.embarkasi || 'CGK'}</span>
                </div>
              </div>
            </div>
            
            {/* E-ID / QR Code untuk Boarding */}
            <div className="hidden md:flex flex-col items-center bg-white p-2 rounded-xl shadow-lg shrink-0">
               <QRCode value={\`SISKOPATUH:\${userData.porsiNumber}:\${userData.name}:\${userData.penyelenggara}\`} size={64} />
               <span className="text-[8px] font-bold text-slate-800 uppercase mt-1 tracking-widest text-center">QR Boarding</span>
            </div>
            </div>`;

if (content.indexOf('QR Boarding') === -1) {
  content = content.replace(targetQR, replacementQR);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched Jemaah Dashboard");
} else {
  console.log("Already patched");
}
