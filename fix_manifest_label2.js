import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `<CardTitle>Data Manifes Jemaah</CardTitle>`;
const replace = `<CardTitle className="flex items-center gap-3">
                Data Manifes Jemaah
                <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 font-sans tracking-normal">
                  Menampilkan Sampel ({jemaahs.length} dari {packages.reduce((acc, curr) => acc + curr.filled, 0).toLocaleString('id-ID')} Total Terdaftar)
                </span>
              </CardTitle>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    writeFileSync(file, content);
    console.log("Updated manifest table title!");
}
