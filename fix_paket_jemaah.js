import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const searchState = "const [newJemaah, setNewJemaah] = useState({ nik: '', nama: '', porsi: '' });";
const replaceState = "const [newJemaah, setNewJemaah] = useState({ nik: '', nama: '', porsi: '', paket: '' });";

const searchForm = `              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nomor Porsi (Opsional)</label>
                <input 
                  type="text" 
                  value={newJemaah.porsi}
                  onChange={(e) => setNewJemaah({...newJemaah, porsi: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>`;

const replaceForm = `              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nomor Porsi (Opsional)</label>
                <input 
                  type="text" 
                  value={newJemaah.porsi}
                  onChange={(e) => setNewJemaah({...newJemaah, porsi: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Pilih Paket Keberangkatan</label>
                <select 
                  value={newJemaah.paket}
                  onChange={(e) => setNewJemaah({...newJemaah, paket: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="" disabled>Pilih Paket</option>
                  {packages.map((pkg, i) => (
                    <option key={pkg.id || i} value={pkg.name}>{pkg.name} ({pkg.airline})</option>
                  ))}
                </select>
              </div>`;

const searchSubmit1 = "const paketDipilih = packages.length > 0 ? packages[0].name : \"Umroh Reguler 9 Hari\";";
const replaceSubmit1 = "const paketDipilih = newJemaah.paket || (packages.length > 0 ? packages[0].name : \"Umroh Reguler 9 Hari\");";

const searchSubmit2 = "setNewJemaah({ nik: '', nama: '', porsi: '' });";
const replaceSubmit2 = "setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });";

content = content.replace(searchState, replaceState);
content = content.replace(searchForm, replaceForm);
content = content.replace(searchSubmit1, replaceSubmit1);
// Replace multiple occurrences of setNewJemaah clearing state
content = content.split(searchSubmit2).join(replaceSubmit2);

writeFileSync(file, content);
console.log("Paket Selection integrated in Add Jemaah!");
