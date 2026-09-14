import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, MapPin, Calendar, User, Hash, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Send, XCircle } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";

export function CekPorsi() {
  const location = useLocation();
  const [porsi, setPorsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosLocation, setSosLocation] = useState("");
  const [sosDescription, setSosDescription] = useState("");
  const [sosLoading, setSosLoading] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nomor = params.get("nomor");
    if (nomor) {
      setPorsi(nomor);
    }
  }, [location.search]);

  const handleSosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosLocation || !sosDescription) return;
    setSosLoading(true);
    try {
      await addDoc(collection(db, "sos_alerts"), {
        nomorPorsi: result.nomorPorsi,
        nama: result.nama,
        lokasi: sosLocation,
        keterangan: sosDescription,
        status: "active",
        timestamp: new Date().toISOString(),
      });
      setSosSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSosLoading(false);
    }
  };

  const handleCek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!porsi || porsi.length < 10) {
      setError("Nomor porsi harus terdiri dari minimal 10 digit angka.");
      return;
    }
    
    setError("");
    setLoading(true);
    setResult(null);

    // Simulate API call to SISKOHAT
    setTimeout(() => {
      setLoading(false);
      setResult({
        nama: "ABDUL RAHMAN SALEH",
        nomorPorsi: porsi,
        provinsi: "JAWA BARAT",
        kabupaten: "KOTA BANDUNG",
        kuotaProvinsi: 38723,
        posisiPorsi: 125430,
        estimasiMasehi: 2028,
        estimasiHijriah: 1449,
      });
    }, 1500);
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-200px)] text-slate-200 py-12">
      <div className="w-full max-w-xl">
        <Card className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 pb-6 bg-slate-900/50 border-b border-slate-800">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">Cek Estimasi Keberangkatan</h3>
              <p className="text-slate-400 text-sm text-center leading-relaxed max-w-md mx-auto">
                Masukkan Nomor Porsi Anda untuk melihat estimasi tahun keberangkatan haji. 
              </p>
            </div>

            <div className="p-8">
              {!result ? (
                <form onSubmit={handleCek} className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                      <input 
                        type="number" 
                        value={porsi}
                        onChange={(e) => setPorsi(e.target.value)}
                        placeholder="Contoh: 1000283948" 
                        className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-12 pr-4 text-sm placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white transition-colors"
                      />
                    </div>
                    {error && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {error}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="  font-bold h-12 rounded-xl text-xs tracking-wider uppercase w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Memeriksa Data Siskohat...</>
                    ) : (
                      'Cek Estimasi Porsi'
                    )}
                  </Button>

                  <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-mono">
                      Peringatan: Estimasi keberangkatan dapat berubah sewaktu-waktu sesuai dengan regulasi kuota nasional dan kebijakan Pemerintah Arab Saudi.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-6 mb-6 text-center">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Estimasi Keberangkatan</p>
                    <div className="flex justify-center items-end gap-2">
                      <span className="text-4xl font-bold text-white">{result.estimasiMasehi}</span>
                      <span className="text-lg text-slate-400 mb-1">M / {result.estimasiHijriah} H</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <User className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Nama Jemaah</p>
                        <p className="text-sm font-medium text-slate-200">{result.nama}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <Hash className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Nomor Porsi</p>
                        <p className="text-sm font-medium text-slate-200">{result.nomorPorsi}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Wilayah Keberangkatan</p>
                        <p className="text-sm font-medium text-slate-200">{result.kabupaten}, {result.provinsi}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Kuota Provinsi</p>
                        <p className="text-lg font-bold text-slate-300">{result.kuotaProvinsi.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Posisi Antrean</p>
                        <p className="text-lg font-bold text-amber-400">{result.posisiPorsi.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => { setResult(null); setPorsi(""); }}
                    variant="outline"
                    className="w-full h-12 border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300 rounded-xl"
                  >
                    Cek Nomor Porsi Lainnya
                  </Button>
                  
                  <div className="mt-8 border-t border-slate-800 pt-6">
                    <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 text-center">
                       <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                       <h4 className="text-white font-bold mb-1">Darurat / Laporan Penelantaran</h4>
                       <p className="text-xs text-slate-400 mb-4">Jika Anda mengalami penelantaran di bandara atau di Arab Saudi, laporkan segera ke Satgas Kemenhaj.</p>
                       <Button onClick={() => setShowSosModal(true)} className="theme-primary-bg hover:opacity-90 w-full h-11 border-transparent shadow-lg">Lapor Darurat Sekarang</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
    {showSosModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-rose-950/30">
              <h3 className="font-bold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-rose-500" /> Form Laporan Darurat</h3>
              <button onClick={() => { setShowSosModal(false); setSosSuccess(false); }} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {sosSuccess ? (
                 <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                       <ShieldAlert className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Laporan Diterima!</h3>
                    <p className="text-sm text-slate-400 mb-6">Satgas Kemenhaj telah menerima laporan Anda dan lokasi Anda telah ditandai. Mohon tetap di lokasi yang aman, petugas kami akan segera berkoordinasi.</p>
                    <Button onClick={() => { setShowSosModal(false); setSosSuccess(false); }} className="w-full theme-primary-bg hover:opacity-90 border-transparent shadow-lg">Tutup</Button>
                 </div>
              ) : (
                 <form onSubmit={handleSosSubmit} className="space-y-4">
                    <div>
                       <label className="text-xs font-bold text-slate-400 uppercase">Jemaah Pelapor</label>
                       <p className="text-sm font-medium text-white bg-slate-950 p-3 rounded-lg border border-slate-800 mt-1">{result.nama} ({result.nomorPorsi})</p>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-400 uppercase">Lokasi Saat Ini</label>
                       <input required type="text" value={sosLocation} onChange={e => setSosLocation(e.target.value)} placeholder="Cth: Bandara Soekarno Hatta Terminal 3 / Bandara Jeddah" className="w-full mt-1 h-11 bg-slate-950 border border-slate-800 rounded-lg px-3 text-white text-sm focus:border-rose-500 outline-none" />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-400 uppercase">Keterangan / Kronologi Singkat</label>
                       <textarea required value={sosDescription} onChange={e => setSosDescription(e.target.value)} placeholder="Jelaskan kondisi Anda saat ini..." className="w-full mt-1 h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-rose-500 outline-none resize-none" />
                    </div>
                    <Button type="submit" disabled={sosLoading} className="w-full h-11   font-bold mt-2">
                       {sosLoading ? "Mengirim Laporan..." : <><Send className="w-4 h-4 mr-2" /> Kirim Laporan Darurat</>}
                    </Button>
                 </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
