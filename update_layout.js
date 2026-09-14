import { readFileSync, writeFileSync } from 'fs';

const file = 'src/layouts/DashboardLayout.tsx';
let content = readFileSync(file, 'utf-8');

content = content.replace(
  '  { icon: ClipboardCheck, label: "Kesiapan Keberangkatan", href: "/penyelenggara/operasional" },\n];',
  '  { icon: ClipboardCheck, label: "Kesiapan Keberangkatan", href: "/penyelenggara/operasional" },\n  { icon: Network, label: "Konsorsium & Mutasi", href: "/penyelenggara/konsorsium" },\n];'
);

writeFileSync(file, content);
console.log("Updated layout!");
