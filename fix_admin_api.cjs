const fs = require('fs');
const path = require('path');
const p = path.resolve('src/layouts/DashboardLayout.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/import \{ \n  LogOut,/g, 'import { \n  LogOut, Webhook,');
c = c.replace(/{ icon: Network, label: "Ledger Mutasi Jemaah", href: "\/admin\/ledger" },/g, '{ icon: Network, label: "Ledger Mutasi Jemaah", href: "/admin/ledger" },\n  { icon: Webhook, label: "Integrasi Lintas Instansi", href: "/admin/integrasi" },');

fs.writeFileSync(p, c, 'utf8');
