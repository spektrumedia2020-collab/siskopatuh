import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `<h2 className="text-xl font-bold text-white">Data Manifes Jemaah</h2>`;
const replace = `<div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white">Data Manifes Jemaah</h2>
                  <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                    Menampilkan {jemaahs.length} dari {packages.reduce((acc, curr) => acc + curr.filled, 0).toLocaleString('id-ID')} Entri Aktif
                  </span>
                </div>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    writeFileSync(file, content);
    console.log("Updated manifest table title!");
}
