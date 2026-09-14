const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// 1. Add state
const stateTarget = `const [activePemohon, setActivePemohon] = useState<any>(null);`;
content = content.replace(stateTarget, stateTarget + `\n  const [searchPemohon, setSearchPemohon] = useState('');`);

// 2. Replace select
const selectTarget = `<select
              className="bg-[#0b1120] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 w-full"
              value={activePemohon?.id || ''}
              onChange={(e) => setActivePemohon(direktoriList.find(d => d.id === e.target.value) || null)}
            >
              <option value="">Pilih Pemohon...</option>
              {direktoriList.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>`;

const searchUI = `<div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Cari penyelenggara..."
                className="bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 w-full"
                value={searchPemohon}
                onChange={(e) => setSearchPemohon(e.target.value)}
              />
            </div>`;

content = content.replace(selectTarget, searchUI);

// 3. Filter the list
const mapTarget = `{direktoriList.map((item, idx) => {`;
const filteredMapTarget = `{direktoriList.filter(item => item.name?.toLowerCase().includes(searchPemohon.toLowerCase())).map((item, idx) => {`;

content = content.replace(mapTarget, filteredMapTarget);

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log('Search patch applied.');
