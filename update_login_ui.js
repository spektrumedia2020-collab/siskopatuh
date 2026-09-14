import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Login.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Add new state for Jenis Pendaftaran
if (!content.includes('const [jemaahJenis, setJemaahJenis]')) {
    content = content.replace(
        'const [jemaahPenyelenggara, setJemaahPenyelenggara] = useState("Kemenhaj");',
        'const [jemaahPenyelenggara, setJemaahPenyelenggara] = useState("");\n  const [jemaahJenis, setJemaahJenis] = useState("Haji Reguler");'
    );
}

// 2. Add Select Fields in the Form (for !isLoginMode)
const formFieldsReplacement = `
              {!isLoginMode && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap Sesuai KTP</label>
                    <div className="relative">
                      <input
                        type="text"
                        required={!isLoginMode}
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"
                        placeholder="Contoh: Ahmad Ibrahim"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis Pendaftaran</label>
                    <select 
                      value={jemaahJenis}
                      onChange={(e) => {
                          setJemaahJenis(e.target.value);
                          if (e.target.value === "Haji Reguler") {
                              setJemaahPenyelenggara("Kemenhaj");
                          } else {
                              setJemaahPenyelenggara("");
                          }
                      }}
                      className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white"
                    >
                      <option value="Haji Reguler">Haji Reguler (Pemerintah)</option>
                      <option value="Haji Khusus">Haji Khusus (PIHK)</option>
                      <option value="Umrah">Umrah (PPIU)</option>
                    </select>
                  </div>
                  
                  {(jemaahJenis === "Haji Khusus" || jemaahJenis === "Umrah") && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Travel (PIHK/PPIU)</label>
                      <select 
                        required={!isLoginMode}
                        value={jemaahPenyelenggara}
                        onChange={(e) => setJemaahPenyelenggara(e.target.value)}
                        className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white"
                      >
                        <option value="" disabled>Pilih Travel...</option>
                        <option value="PT. Mabrur Travel Umroh">PT. Mabrur Travel Umroh</option>
                        <option value="PT. Khazanah Tamma Internasional">PT. Khazanah Tamma Internasional</option>
                        <option value="PT. Hanania">PT. Hanania</option>
                        <option value="PT. Masy'aril Haram Tour">PT. Masy'aril Haram Tour</option>
                        <option value="PT. Cahaya Raudhah">PT. Cahaya Raudhah</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
`;

const oldFormFieldsRegex = /\{\!isLoginMode && \(\s*<div className="space-y-2">\s*<label className="text-\[10px\] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap Sesuai KTP<\/label>\s*<div className="relative">\s*<input\s*type="text"\s*required=\{\!isLoginMode\}\s*value=\{demoName\}\s*onChange=\{\(e\) => setDemoName\(e\.target\.value\)\}\s*className="w-full px-3 h-10 rounded-lg border border-slate-700 bg-slate-950 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm text-white placeholder:text-slate-600"\s*placeholder="Contoh: Ahmad Ibrahim"\s*\/>\s*<\/div>\s*<\/div>\s*\)\}/;

content = content.replace(oldFormFieldsRegex, formFieldsReplacement.trim());

// 3. Update the Seed initial user data inside handleJemaahLogin
const seedRegex = /paket: jemaahPenyelenggara === "Kemenhaj" \? "Haji Reguler \(Pemerintah\)" : "Umroh Reguler 9 Hari",\s*jenis: jemaahPenyelenggara === "Kemenhaj" \? "Haji Reguler" : "Umrah\/Haji Khusus",/;
const newSeed = `paket: jemaahJenis === "Haji Reguler" ? "Haji Reguler (Kemenag)" : jemaahJenis === "Haji Khusus" ? "Haji Khusus (PIHK)" : "Umrah Reguler",
            jenis: jemaahJenis,`;

content = content.replace(seedRegex, newSeed);

writeFileSync(file, content);
console.log("Login.tsx updated");

