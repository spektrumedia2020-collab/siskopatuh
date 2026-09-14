const fs = require('fs');
const path = require('path');
const pLayout = path.resolve('src/layouts/DashboardLayout.tsx');
let layoutContent = fs.readFileSync(pLayout, 'utf8');
layoutContent = layoutContent.replace(
  '{ icon: ClipboardCheck, label: "Kesiapan Keberangkatan", href: "/penyelenggara/operasional" }',
  '{ icon: ClipboardCheck, label: "Operasional & Pelaporan", href: "/penyelenggara/operasional" }'
);
fs.writeFileSync(pLayout, layoutContent, 'utf8');

const pDash = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let dashContent = fs.readFileSync(pDash, 'utf8');
dashContent = dashContent.replace(
  '<h2 className="text-xl font-bold text-white">Manajemen Keberangkatan (Progres Operasional)</h2>',
  '<h2 className="text-xl font-bold text-white">Operasional & Pelaporan Jemaah</h2>'
);
dashContent = dashContent.replace(
  '<p className="text-sm text-slate-400 mt-1">Lengkapi update status operasional paket layanan Anda (Visa, Tiket, dan Hotel) agar dapat dipantau oleh Jemaah dan Kemenhaj.</p>',
  '<p className="text-sm text-slate-400 mt-1">Perbarui status operasional paket (Visa/Tiket/Hotel), serta wajib melaporkan <b>Keberangkatan</b> & <b>Kepulangan</b> jemaah maksimal 1x24 jam (KMHU No.2/2026).</p>'
);
fs.writeFileSync(pDash, dashContent, 'utf8');
