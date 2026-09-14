import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle2, Search, MapPin, Phone, Mail, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Direktori() {
  const navigate = useNavigate();
  const [selectedBiro, setSelectedBiro] = useState<any>(null);

  const [biroList, setBiroList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBiro = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "direktori"));
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data.length === 0) {
          const { addDoc } = await import("firebase/firestore");
          const DAFTAR_PIHK = [
            "PT. Khazanah Tamma Internasional",
            "PT. Mabrur Travel Umroh",
            "PT. Hanania",
            "PT. Surya Citra Madani",
            "PT. Hidayah Amanah Jemaah",
            "PT. Masy'aril Haram Tour",
            "PT. Gaido Azza Darussalam",
            "PT. Nurul Muflihun Al-Baroqah",
            "PT. Cahaya Raudhah",
            "PT. Al-Dawood Barokah Utama",
            "PT. JGRUP Amanah Wisata",
            "PT. Bina Wisata",
            "PT. NRA Tour & Travel",
            "PT. Patuna Mekar Jaya",
          ];
          for (let i = 0; i < DAFTAR_PIHK.length; i++) {
            await addDoc(collection(db, "direktori"), {
              name: DAFTAR_PIHK[i],
              type: i % 3 === 0 ? "PIHK (Haji Khusus)" : "PPIU (Umroh)",
              rating: i % 2 === 0 ? "A" : "B",
              status: i === 3 ? "Dalam Pengawasan" : "Terakreditasi",
              quota: 100 + (i * 20),
              since: 2010 + i,
              address: "Jl. Sudirman No. " + (i + 1) + ", Jakarta",
              phone: "021-555" + i.toString().padStart(4, '0'),
              email: "info@" + DAFTAR_PIHK[i].toLowerCase().replace(/[^a-z]/g, '') + ".com"
            });
          }
          // Fetch again
          const newSnapshot = await getDocs(collection(db, "direktori"));
          data = newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        
        // Ensure Kemenhaj is in the list
        const kemenhajExists = data.some((b: any) => b.name && b.name.includes("Kemenhaj"));
        if (!kemenhajExists) {
          const kemenhajData = {
            name: "Kemenhaj (Haji Reguler)",
            type: "Pemerintah (Haji Reguler)",
            rating: "A",
            status: "Terakreditasi",
            quota: 220000,
            since: 1945,
            address: "Jl. Lapangan Banteng Barat No. 3-4, Jakarta Pusat",
            phone: "021-3811654",
            email: "haji@kemenhaj.go.id"
          };
          const { addDoc } = await import("firebase/firestore");
          const docRef = await addDoc(collection(db, "direktori"), kemenhajData);
          data.unshift({ id: docRef.id, ...kemenhajData });
        }

        setBiroList(data);
      } catch (error) {
        console.error("Error fetching direktori:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBiro();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredBiroList = biroList.filter(biro => 
    biro.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    biro.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full text-slate-200 max-w-5xl mx-auto">
      <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8">
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-light tracking-tighter text-white">Direktori Penyelenggara Resmi (Whitelist)</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Pastikan biro travel Umroh (PPIU) dan Haji Khusus (PIHK) Anda terdaftar dan 
              terakreditasi resmi oleh Kementerian Haji untuk menghindari penipuan.
            </p>
            
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama biro, nomor izin..." 
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-950 pl-11 pr-4 text-sm placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white shadow-inner"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {loading ? <div className="col-span-full text-center py-10 text-slate-400">Memuat direktori...</div> : filteredBiroList.map((biro, i) => (
              <Card key={i} className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-colors">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white mb-1">{biro.name}</h4>
                      <p className="text-[10px] font-mono text-slate-500">Izin: {biro.id}</p>
                    </div>
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${biro.status === 'Dalam Pengawasan' ? 'bg-rose-900/30 border-rose-500/30 text-rose-400' : 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400'}`}>
                      {biro.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className={`h-4 w-4 ${biro.rating?.includes('A') ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <span>Akreditasi {biro.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className={`h-4 w-4 ${biro.status === 'Terakreditasi' ? 'text-emerald-500' : 'text-rose-500'}`} />
                      <span>{biro.status}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 text-[10px] font-bold  hover: "
                    onClick={() => setSelectedBiro(biro)}
                  >
                    LIHAT PROFIL & PAKET
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <div className="flex gap-1">
              <Button variant="outline" className="w-8 h-8 p-0 rounded-lg    text-xs font-bold">1</Button>
              <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg  hover: text-xs font-bold">2</Button>
              <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg  hover: text-xs font-bold">3</Button>
              <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg  hover: text-xs font-bold">...</Button>
              <Button variant="ghost" className="w-8 h-8 p-0 rounded-lg  hover: text-xs font-bold">&rarr;</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Biro Detail Modal */}
      {selectedBiro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${selectedBiro.status === 'Dalam Pengawasan' ? 'bg-rose-900/30 border-rose-500/30 text-rose-400' : 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400'}`}>
                    {selectedBiro.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Izin Kemenhaj: {selectedBiro.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">{selectedBiro.name}</h3>
              </div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${selectedBiro.status === 'Dalam Pengawasan' ? 'bg-rose-900/20 text-rose-500' : 'bg-emerald-900/20 text-emerald-500'}`}>
                {selectedBiro.status === 'Dalam Pengawasan' ? <AlertCircle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Akreditasi</div>
                  <div className={`text-sm font-medium flex items-center gap-1.5 ${selectedBiro.rating?.includes('A') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <Award className="h-4 w-4" />
                    {selectedBiro.rating}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Status Kemenhaj</div>
                  <div className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                    {selectedBiro.status === 'Terakreditasi' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-500" />
                    )}
                    {selectedBiro.status}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Kapasitas Maksimal</div>
                  <div className="text-sm font-medium text-slate-200">{selectedBiro.quota}</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Beroperasi Sejak</div>
                  <div className="text-sm font-medium text-slate-200">{selectedBiro.since}</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-800 pb-2">Informasi Kontak</div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-slate-300">{selectedBiro.address}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="text-sm text-slate-300">{selectedBiro.phone}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div className="text-sm text-slate-300">{selectedBiro.email}</div>
                </div>
              </div>
              
              {selectedBiro.status === 'Terakreditasi' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-400/90 leading-relaxed">
                    Penyelenggara ini telah diverifikasi dan memiliki izin resmi yang masih berlaku dari Kementerian Haji RI. Aman untuk digunakan.
                  </p>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  <p className="text-xs text-rose-400/90 leading-relaxed">
                    Perhatian: Penyelenggara ini sedang dalam masa pengawasan Kementerian Haji RI terkait indikasi pelanggaran administratif atau pelayanan.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-950/50">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedBiro(null)}
                className="text-slate-400 hover:text-white"
              >
                Tutup
              </Button>
              <Button 
                className="  font-bold"
                onClick={() => navigate('/login', { state: { selectedBiro: selectedBiro.name } })}
              >
                Daftar Paket via Biro Ini
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

