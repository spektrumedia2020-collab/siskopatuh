const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'const [harga, setHarga] = useState<number | \'\'>(\'\');',
  `const [harga, setHarga] = useState<number | ''>('');
  const [hotelCode, setHotelCode] = useState("");
  const [validatedHotel, setValidatedHotel] = useState<{name: string, stars: number, distance: number} | null>(null);`
);

c = c.replace(
  /const handleCreatePackage = async \(\) => {/,
  `const handleCheckHotel = () => {
    if (hotelCode.length >= 4) {
      if (hotelCode === 'MELATI') {
        alert("Validasi API Nusuk GAGAL: Hotel ini berstatus Bintang 2 dan masuk dalam daftar pantauan. Harap pilih hotel minimal Bintang 3.");
        return;
      }
      setValidatedHotel({
        name: "Zamzam Pullman Makkah",
        stars: 5,
        distance: 50
      });
    }
  };

  const handleCreatePackage = async () => {
    if (!validatedHotel) {
      alert("Harap validasi kode booking hotel ke sistem Nusuk terlebih dahulu.");
      return;
    }`
);

const hotelFormHTML = `
                      <div className="space-y-2 mt-4 pt-4 border-t border-emerald-500/20">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>Sistem Nusuk (Arab Saudi)</span>
                          <span className="text-[9px] bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded">WAJIB</span>
                        </label>
                        <p className="text-[10px] text-slate-500">Masukkan kode integrasi Nusuk API dari provider hotel Anda. Sistem Kemenhaj akan mengunci spesifikasi hotel ini.</p>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={hotelCode}
                            onChange={(e) => setHotelCode(e.target.value.toUpperCase())}
                            className="flex-1 h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono" 
                            placeholder="Kode Booking Nusuk" 
                          />
                          <Button onClick={handleCheckHotel} size="sm" variant="secondary" className="bg-slate-700 text-white hover:bg-slate-600" disabled={hotelCode.length < 4}>Validasi Hotel</Button>
                        </div>

                        {validatedHotel && (
                          <div className="bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-lg mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Building className="w-4 h-4 text-emerald-400" />
                              <span className="text-xs font-bold text-emerald-400">Tervalidasi API Nusuk</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <span className="block text-[10px] text-slate-500">Nama Properti</span>
                                <span className="block text-xs font-bold text-slate-300">{validatedHotel.name}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-slate-500">Klasifikasi Resmi</span>
                                <span className="block text-xs font-bold text-amber-400">{'⭐'.repeat(validatedHotel.stars)}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="block text-[10px] text-slate-500">Geofencing Parameter (Radius Jarak)</span>
                                <span className="block text-xs font-bold text-slate-300">{validatedHotel.distance} Meter dari Masjidil Haram</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-emerald-500/70 mt-2 font-mono">ID: NSK-{Math.floor(Math.random() * 1000000)} • Data dikunci oleh Kemenhaj.</p>
                          </div>
                        )}
                      </div>
`;

c = c.replace(
  /<div className="space-y-2 mt-2">\s*<label className="text-xs font-medium text-slate-400">Harga Paket \(Per Pax\)<\/label>/,
  hotelFormHTML + '\n                      <div className="space-y-2 mt-2">\n                        <label className="text-xs font-medium text-slate-400">Harga Paket (Per Pax)</label>'
);

c = c.replace(
  /disabled={!packageName}/,
  'disabled={!packageName || !validatedHotel}'
);

c = c.replace(
  'setPnr("");',
  'setPnr("");\n    setHotelCode("");\n    setValidatedHotel(null);'
);

fs.writeFileSync(p, c, 'utf8');
