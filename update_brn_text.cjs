const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /<span>Sistem Nusuk \(Arab Saudi\)<\/span>/,
  '<span>Sistem Nusuk (Validasi BRN Akomodasi)</span>'
);

c = c.replace(
  /Masukkan kode integrasi Nusuk API dari provider hotel Anda\./,
  'Masukkan BRN (Booking Reference Number) Akomodasi resmi dari provider B2B Saudi.'
);

c = c.replace(
  /placeholder="Kode Booking Nusuk"/,
  'placeholder="Contoh BRN: AC-882910"'
);

fs.writeFileSync(p, c, 'utf8');
