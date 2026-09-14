const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const theadTarget = `<th className="p-5">Kesiapan Hotel</th>
                      <th className="p-5 text-center">Indikator</th>`;
const theadReplace = `<th className="p-5">Kesiapan Hotel</th>
                      <th className="p-5">Lapor Berangkat</th>
                      <th className="p-5">Lapor Pulang</th>
                      <th className="p-5 text-center">Indikator</th>`;
content = content.replace(theadTarget, theadReplace);

const extractionTarget = `const hotel = pkg.statusHotel || "Belum Booking";`;
const extractionReplace = `const hotel = pkg.statusHotel || "Belum Booking";
                       const brkt = pkg.statusKeberangkatan || "Belum Lapor";
                       const plg = pkg.statusKepulangan || "Belum Lapor";`;
content = content.replace(extractionTarget, extractionReplace);

const colorTarget = `const getHotelColor = (h) => {
                         if (h.includes("Confirmed") || h.includes("Lunas")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (h.includes("DP") || h.includes("Proses")) return "bg-amber-950/50 text-amber-500 border-amber-900/50";
                         return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                       };`;
const colorReplace = `const getHotelColor = (h) => {
                         if (h.includes("Confirmed") || h.includes("Lunas")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (h.includes("DP") || h.includes("Proses")) return "bg-amber-950/50 text-amber-500 border-amber-900/50";
                         return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                       };
                       const getReportColor = (r) => {
                         if (r.includes("Sudah")) return "bg-emerald-950 text-emerald-400 border-emerald-900";
                         if (r.includes("Terlambat")) return "bg-rose-950/50 text-rose-400 border-rose-900/50";
                         return "bg-slate-800 text-slate-400 border-slate-700";
                       };`;
content = content.replace(colorTarget, colorReplace);

const rowTarget = `<td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getHotelColor(hotel)}\`}>
                               {hotel}
                             </span>
                           </td>
                           <td className="p-5 text-center">`;
const rowReplace = `<td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getHotelColor(hotel)}\`}>
                               {hotel}
                             </span>
                           </td>
                           <td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getReportColor(brkt)}\`}>
                               {brkt}
                             </span>
                           </td>
                           <td className="p-5">
                             <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold border \${getReportColor(plg)}\`}>
                               {plg}
                             </span>
                           </td>
                           <td className="p-5 text-center">`;
content = content.replace(rowTarget, rowReplace);

fs.writeFileSync(p, content, 'utf8');
