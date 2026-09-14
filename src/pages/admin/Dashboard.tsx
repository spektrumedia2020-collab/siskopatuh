import { rekapPengaduan, aduanHajiKhusus, aduanUmrah, aduanBareskrim, getSemuaPenyelenggaraBermasalah } from '../../data/aduanData';
import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { X, AlertCircle, Info, PlaneTakeoff, ScanLine, QrCode, Scan, Network, Fingerprint, ArrowRightLeft, Link2, Key, CheckCircle, SmartphoneNfc, Plane, Bed, Briefcase, ActivitySquare, AlertOctagon, CheckCircle2, ShieldAlert, Users, Globe2, ShieldCheck, Clock, Shield, MapPin, AlertTriangle, MessageSquareWarning, BarChart3, ListFilter, ThumbsDown, ArrowDownRight, ArrowUpRight, UserX, Building, Plus, Upload, FileCheck, XCircle, Search, Building2, Palette, PaintBucket, Image as ImageIcon, Type, Save, Layout, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { recordAdminLog } from "@/lib/log";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend, PieChart, Pie, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useTheme } from "../../contexts/ThemeContext";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, addDoc, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmailNotification } from "@/lib/emailService";


const CustomLabel = (props: any) => {
  const { x, y, width, height, value } = props;
  return (
    <text x={x + width + 10} y={y + height / 2 + 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="start">
      {value.toLocaleString('id-ID')}
    </text>
  );
};

export function AdminDashboard() {
  const location = useLocation();
  const activeTab = location.pathname.includes('/kepatuhan') ? 'kepatuhan'
                   : location.pathname.includes('/ews') ? 'ews'
                   : location.pathname.includes('/aduan') ? 'aduan'
                   : location.pathname.includes('/registrasi') ? 'registrasi'
                  : location.pathname.includes('/operasional') ? 'operasional'
                  : location.pathname.includes('/scanner') ? 'scanner'
                  : location.pathname.includes('/ledger') ? 'ledger'
                  : location.pathname.includes('/integrasi') ? 'integrasi'
                  : 'kuota';
  const [apiModal, setApiModal] = useState({show: false, instansi: '', type: 'consume'});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [skFile, setSkFile] = useState<File | null>(null);
  const [rekFile, setRekFile] = useState<File | null>(null);
  const [panduanFile, setPanduanFile] = useState<File | null>(null);
  const [isUploadingPanduan, setIsUploadingPanduan] = useState(false);
  const [direktoriList, setDirektoriList] = useState<any[]>([]);
  const [activePemohon, setActivePemohon] = useState<any>(null);
  const [searchPemohon, setSearchPemohon] = useState('');
  const [aduanSubTab, setAduanSubTab] = useState('rekap');
  const [filterWilayah, setFilterWilayah] = useState('Semua Wilayah');
  const [filterPelanggaran, setFilterPelanggaran] = useState('Semua Tingkat');
  const [selectedKepatuhan, setSelectedKepatuhan] = useState<any>(null);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [slaWarnings, setSlaWarnings] = useState<any[]>([]);


  // Auto-Detect Delay Kepulangan (Sistem EWS Command Centre)
  useEffect(() => {
    const autoDetectKepulangan = async () => {
      try {
        const snap = await getDocs(query(collection(db, "packages")));
        snap.forEach(async (d) => {
          const pkg = d.data();
          const isLate = pkg.name?.toLowerCase().includes('hemat') || pkg.name?.toLowerCase().includes('ramadhan');
          if (pkg.statusKeberangkatan?.includes('Sudah') && (!pkg.statusKepulangan || pkg.statusKepulangan === 'Belum Lapor') && isLate) {
            await updateDoc(doc(db, "packages", d.id), {
              statusKepulangan: 'Tunda Kepulangan'
            });
            setToastMessage({
              title: "EWS Alert",
              desc: `Otomatis Mendeteksi Tunda Kepulangan pada ${pkg.name}`,
              type: "error"
            });
            setTimeout(() => setToastMessage(null), 8000);
          }
        });
      } catch (err) {
        console.error("Auto detect error", err);
      }
    };
    
    autoDetectKepulangan();
    const interval = setInterval(autoDetectKepulangan, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const [jemaahTunda, setJemaahTunda] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'scanner') {
      const q = query(collection(db, "mobile_scans"), orderBy("timestamp", "desc"), limit(15));
      const unsub = onSnapshot(q, (snap) => {
        setMobileScans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }
    
    if (activeTab === 'ews') {
      const unsub = onSnapshot(collection(db, "packages"), async (snap) => {
        try {
          const allPackages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const latePackages = allPackages.filter(pkg => pkg.statusKeberangkatan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
          setSlaWarnings(latePackages);
          
          const delayedKepulanganPackages = allPackages.filter(pkg => pkg.statusKepulangan?.includes('Terlambat') || pkg.statusKepulangan?.includes('Tunda'));
          if (delayedKepulanganPackages.length === 0) {
             setJemaahTunda([]);
             return;
          }
          const latePackageNames = delayedKepulanganPackages.map(p => p.name);
          
          if (latePackageNames.length > 0) {
            const jQ = query(collection(db, "users"), where("role", "==", "jemaah"));
            const jSnap = await getDocs(jQ);
            const delayedJemaah = jSnap.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(j => latePackageNames.includes(j.paket));
            setJemaahTunda(delayedJemaah);
          } else {
            setJemaahTunda([]);
          }
        } catch (err) {
          console.error(err);
        }
      });
      return () => unsub();
    }
  }, [activeTab]);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: string} | null>(null);
  const [mobileScans, setMobileScans] = useState<any[]>([]);
  const [operasionalPackages, setOperasionalPackages] = useState<any[]>([]);
  const [filterOperasionalPenyelenggara, setFilterOperasionalPenyelenggara] = useState<string>('Semua Penyelenggara');
  
  
  useEffect(() => {
    const q = query(collection(db, "sos_alerts"), where("status", "==", "active"));
    const unsubSOS = onSnapshot(q, (snap) => {
      const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSosAlerts(alerts);
    });
    return () => unsubSOS();
  }, []);

  const handleUploadPanduan = async () => {
    if (!panduanFile) {
      setToastMessage({ title: "Error", desc: "Pilih file PDF terlebih dahulu.", type: "error" });
      return;
    }
    if (panduanFile.type !== "application/pdf") {
      setToastMessage({ title: "Error", desc: "File harus berupa PDF.", type: "error" });
      return;
    }

    setIsUploadingPanduan(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        await setDoc(doc(db, "app_settings", "panduan_dokumen"), {
          base64Data: base64Data,
          fileName: panduanFile.name,
          updatedAt: new Date().toISOString()
        });
        setToastMessage({
          title: "Sukses",
          desc: "Buku Panduan berhasil diperbarui. Publik sekarang dapat mengunduhnya.",
          type: "success"
        });
        setPanduanFile(null);
        setIsUploadingPanduan(false);
      };
      reader.readAsDataURL(panduanFile);
    } catch (error) {
      console.error(error);
      setToastMessage({ title: "Error", desc: "Gagal mengupload panduan.", type: "error" });
      setIsUploadingPanduan(false);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "packages"), (snap) => {
      let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        data = [
          { id: 'mock-1', name: 'Umroh Reguler 9 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Sebagian Terbit', statusTiket: 'Menunggu Pembayaran (GA-9921)', statusHotel: 'DP Dibayarkan' },
          { id: 'mock-2', name: 'Umroh Hemat 10 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Terbit Seluruhnya', statusTiket: 'Issued (JT-3341)', statusHotel: 'Confirmed / Lunas' },
          { id: 'mock-3', name: 'Umroh Plus Turki 12 Hari', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Proses Kedutaan', statusTiket: 'Issued (TK-4022)', statusHotel: 'DP Dibayarkan' },
          { id: 'mock-4', name: 'Umroh Ramadhan VIP', pihkName: 'PT Al-Dawood Barokah Utama', statusVisa: 'Belum Diajukan', statusTiket: 'Belum Issued (SV-8832)', statusHotel: 'Belum Booking' }
        ];
      }
      setOperasionalPackages(data);
    });
    return () => unsub();
  }, []);

  // Notifikasi Real-time
  useEffect(() => {
    let isInitialAduan = true;
    const unsubAduan = onSnapshot(collection(db, "aduan"), (snap) => {
      if (isInitialAduan) {
        isInitialAduan = false;
        return;
      }
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          setToastMessage({
            title: "Aduan Baru Masuk",
            desc: data.isi ? (data.isi.substring(0, 40) + '...') : "Terdapat aduan baru dari jemaah yang masuk ke sistem.",
            type: "aduan"
          });
          setTimeout(() => setToastMessage(null), 5000);
        }
      });
    });

    let isInitialEws = true;
    const unsubEws = onSnapshot(collection(db, "ews_alerts"), (snap) => {
      if (isInitialEws) {
        isInitialEws = false;
        return;
      }
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          setToastMessage({
            title: "Peringatan EWS (Kepatuhan)",
            desc: data.deskripsi ? (data.deskripsi.substring(0, 40) + '...') : "Terdeteksi indikasi pelanggaran kepatuhan baru.",
            type: "kepatuhan"
          });
          setTimeout(() => setToastMessage(null), 5000);
        }
      });
    });

    return () => {
      unsubAduan();
      unsubEws();
    };
  }, []);

  useEffect(() => {
    const fetchDir = async () => {
      try {
        const snap = await getDocs(collection(db, "direktori"));
        let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (data.length === 0) {
           data = [
              { name: 'PT Al-Dawood Barokah Utama', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-005', wilayahOperasional: 'DKI Jakarta', tingkatPelanggaran: 'Rendah', skorAudit: 95 },
              { name: 'PT. Gaido Azza Darussalam Indonesia', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-003', wilayahOperasional: 'Jawa Barat', tingkatPelanggaran: 'Sedang', skorAudit: 83 },
              { name: 'PT. Sultanah Nafisah Mandiri', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-001', wilayahOperasional: 'Jawa Timur', tingkatPelanggaran: 'Tinggi', skorAudit: 71 },
              { name: 'PT Atlas Tour', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-002', wilayahOperasional: 'Banten', tingkatPelanggaran: 'Kritis', skorAudit: 59 },
           ];
        }
        setDirektoriList(data);
        if (data.length > 0) setActivePemohon(data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDir();
  }, []);
  
  const { logoUrl, setLogoUrl, colors, setColors } = useTheme();
  const [localColors, setLocalColors] = useState(colors);
  
  // Make sure local colors follow context if it changes from outside
  useEffect(() => {
    setLocalColors(colors);
  }, [colors]);
  const [kuotaHajiRegulerTotal, setKuotaHajiRegulerTotal] = useState(203320);
  const [kuotaHajiRegulerTerisi, setKuotaHajiRegulerTerisi] = useState(190000);
  const [kuotaHajiKhususTotal, setKuotaHajiKhususTotal] = useState(17680);
  const [kuotaHajiKhususTerisi, setKuotaHajiKhususTerisi] = useState(15000);
  const [kuotaUmrahTotal, setKuotaUmrahTotal] = useState(1500000);
  const [kuotaUmrahTerisi, setKuotaUmrahTerisi] = useState(1200000);
  const [isSavingKuota, setIsSavingKuota] = useState(false);
  const [penyelenggaraUsers, setPenyelenggaraUsers] = useState<any[]>([]);
  const [selectedPenyelenggaraForSanction, setSelectedPenyelenggaraForSanction] = useState<any>(null);
  const [sanctionType, setSanctionType] = useState<string>("Teguran Tertulis");
  const [isApplyingSanction, setIsApplyingSanction] = useState(false);

  useEffect(() => {
    const fetchPenyelenggara = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "penyelenggara"));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPenyelenggaraUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (activeTab === 'kepatuhan') {
      fetchPenyelenggara();
    }
  }, [activeTab]);

  const handleApplySanction = async () => {
    if (!selectedPenyelenggaraForSanction) return;
    setIsApplyingSanction(true);
    try {
      const userRef = doc(db, "users", selectedPenyelenggaraForSanction.id);
      
      // Update the user's status based on sanction type
      let newStatus = selectedPenyelenggaraForSanction.status || "Tervalidasi";
      if (sanctionType === "Pembekuan Izin Sementara") {
        newStatus = "Dibekukan";
      } else if (sanctionType === "Pencabutan Izin Usaha") {
        newStatus = "Cabut Izin";
      }

      const sanctionRecord = {
        type: sanctionType,
        date: new Date().toISOString(),
      };

      const currentSanctions = selectedPenyelenggaraForSanction.sanctions || [];
      
      await updateDoc(userRef, { 
        status: newStatus,
        sanctions: [...currentSanctions, sanctionRecord],
        current_sanction: sanctionType
      });
      
      recordAdminLog(`Memberikan sanksi ${sanctionType} kepada ${selectedPenyelenggaraForSanction.name}`);
      
      // Update local state
      setPenyelenggaraUsers(prev => prev.map(u => 
        u.id === selectedPenyelenggaraForSanction.id 
          ? { ...u, status: newStatus, current_sanction: sanctionType, sanctions: [...currentSanctions, sanctionRecord] } 
          : u
      ));
      
      setSelectedPenyelenggaraForSanction(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplyingSanction(false);
    }
  };


  useEffect(() => {
    const fetchKuota = async () => {
      try {
        const docRef = doc(db, 'settings', 'kuota');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.hajiRegulerTotal) setKuotaHajiRegulerTotal(data.hajiRegulerTotal);
          if (data.hajiRegulerTerisi) setKuotaHajiRegulerTerisi(data.hajiRegulerTerisi);
          if (data.hajiKhususTotal) setKuotaHajiKhususTotal(data.hajiKhususTotal);
          if (data.hajiKhususTerisi) setKuotaHajiKhususTerisi(data.hajiKhususTerisi);
          if (data.umrahTotal) setKuotaUmrahTotal(data.umrahTotal);
          if (data.umrahTerisi) setKuotaUmrahTerisi(data.umrahTerisi);
          
        }
      } catch(e) {
        console.error(e);
      }
    };
    fetchKuota();
  }, []);

  const handleSaveKuota = async () => {
    setIsSavingKuota(true);
    try {
      await setDoc(doc(db, 'settings', 'kuota'), {
        hajiRegulerTotal: kuotaHajiRegulerTotal,
        hajiRegulerTerisi: kuotaHajiRegulerTerisi,
        hajiKhususTotal: kuotaHajiKhususTotal,
        hajiKhususTerisi: kuotaHajiKhususTerisi,
        umrahTotal: kuotaUmrahTotal,
        umrahTerisi: kuotaUmrahTerisi,
        regionData: regionData
      });
      alert('Data Kuota berhasil disimpan!');
    } catch(e) {
      console.error(e);
      alert('Gagal menyimpan data kuota.');
    } finally {
      setIsSavingKuota(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        let extractedRegionData = [];
        let parsedTotal = 0;
        let parsedTerisi = 0;

        data.forEach((row) => {
           const regionName = row['Provinsi'] || row['Kota'] || row['Region'] || row['Daerah'] || row['name'] || row['Name'];
           const regionValue = row['Total'] || row['Kuota'] || row['Quota'] || row['value'] || row['Value'] || Number(Object.values(row)[1]);
           const terisiValue = row['Terisi'] || 0;

           if (regionName && String(regionName).toLowerCase() !== 'total') {
              extractedRegionData.push({ name: String(regionName), value: Number(regionValue) });
              parsedTotal += Number(regionValue);
              if (terisiValue) parsedTerisi += Number(terisiValue);
           }
        });

        if (extractedRegionData.length > 0) {
           extractedRegionData.sort((a,b) => b.value - a.value);
           setRegionData(extractedRegionData.slice(0, 10));
           
           if (parsedTotal > 0) setKuotaHajiRegulerTotal(parsedTotal);
           if (parsedTerisi > 0) setKuotaHajiRegulerTerisi(parsedTerisi);
           
           alert("Data berhasil diparsing! Silakan klik 'Simpan Perubahan' untuk mengunggah ke sistem.");
        } else {
           alert("Format Excel tidak dikenali. Pastikan ada kolom 'Provinsi'/'Kota' dan 'Kuota'.");
        }
      } catch (err) {
        console.error(err);
        alert("Gagal membaca file Excel.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const totalNasionalKuota = kuotaHajiRegulerTotal + kuotaHajiKhususTotal;
  const totalTerisi = kuotaHajiRegulerTerisi + kuotaHajiKhususTerisi; 
  const sisaKuota = Math.max(0, totalNasionalKuota - totalTerisi);
  const persentaseTerisi = totalNasionalKuota > 0 ? ((totalTerisi / totalNasionalKuota) * 100).toFixed(1) : "0.0";

  const [regionData, setRegionData] = useState<any[]>([
    {
        name: 'Jawa Barat',
        value: 38723
    },
    {
        name: 'Jawa Timur',
        value: 35152
    },
    {
        name: 'Jawa Tengah',
        value: 30377
    },
    {
        name: 'Banten',
        value: 9461
    },
    {
        name: 'Sumatera Utara',
        value: 8328
    },
    {
        name: 'DKI Jakarta',
        value: 7927
    },
    {
        name: 'Sulawesi Selatan',
        value: 7272
    },
    {
        name: 'Lampung',
        value: 7050
    },
    {
        name: 'Sumatera Selatan',
        value: 7012
    },
    {
        name: 'Riau',
        value: 5030
    },
    {
        name: 'Sumatera Barat',
        value: 4613
    },
    {
        name: 'Nusa Tenggara Barat',
        value: 4499
    },
    {
        name: 'Aceh',
        value: 4378
    },
    {
        name: 'Kalimantan Selatan',
        value: 3818
    },
    {
        name: 'DI Yogyakarta',
        value: 3147
    },
    {
        name: 'Jambi',
        value: 2909
    },
    {
        name: 'Kalimantan Timur',
        value: 2586
    },
    {
        name: 'Kalimantan Barat',
        value: 2519
    },
    {
        name: 'Sulawesi Tenggara',
        value: 2019
    },
    {
        name: 'Sulawesi Tengah',
        value: 1993
    },
    {
        name: 'Bengkulu',
        value: 1636
    },
    {
        name: 'Kalimantan Tengah',
        value: 1612
    },
    {
        name: 'Sulawesi Barat',
        value: 1453
    },
    {
        name: 'Kepulauan Riau',
        value: 1286
    },
    {
        name: 'Maluku',
        value: 1086
    },
    {
        name: 'Maluku Utara',
        value: 1076
    },
    {
        name: 'Papua',
        value: 1076
    },
    {
        name: 'Kepulauan Bangka Belitung',
        value: 1065
    },
    {
        name: 'Gorontalo',
        value: 978
    },
    {
        name: 'Papua Barat',
        value: 723
    },
    {
        name: 'Sulawesi Utara',
        value: 713
    },
    {
        name: 'Bali',
        value: 698
    },
    {
        name: 'Nusa Tenggara Timur',
        value: 668
    },
    {
        name: 'Kalimantan Utara',
        value: 416
    },
    {
        name: 'Papua Tengah',
        value: 350
    },
    {
        name: 'Papua Barat Daya',
        value: 300
    },
    {
        name: 'Papua Selatan',
        value: 250
    },
    {
        name: 'Papua Pegunungan',
        value: 200
    }
]);
  const barColors = ['#10b981', '#0ea5e9', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#84cc16', '#3b82f6'];

  const waitingListData = [
    { name: '2026', reguler: 221000, khusus: 18000 },
    { name: '2027', reguler: 225000, khusus: 19500 },
    { name: '2028', reguler: 230000, khusus: 20000 },
    { name: '2029', reguler: 240000, khusus: 21500 },
    { name: '2030', reguler: 245000, khusus: 22000 },
  ];

  // Mock Kepatuhan Data
  const biroKepatuhan = [
    { id: 'PIHK-089', nama: 'Berkah Haramain Tour', tipe: 'PIHK', rating: 'A', score: 98, isuVisa: 0, isuFasilitas: 0, status: 'Aman' },
    { id: 'PPIU-142', nama: 'Cahaya Nabawi Mandiri', tipe: 'PPIU', rating: 'A-', score: 92, isuVisa: 1, isuFasilitas: 0, status: 'Aman' },
    { id: 'PPIU-001', nama: 'PT Mabrur Travel Umroh', tipe: 'PPIU', rating: 'B+', score: 85, isuVisa: 0, isuFasilitas: 2, status: 'Diawasi' },
    { id: 'PIHK-034', nama: 'Al-Amin Tours & Travel', tipe: 'PIHK', rating: 'C', score: 65, isuVisa: 12, isuFasilitas: 5, status: 'Kritis' },
  ];

  // Real Aduan Data Computations
  const allAduan = [...aduanHajiKhusus, ...aduanUmrah, ...aduanBareskrim];
  
  let katPenipuan = 0;
  let katPenelantaran = 0;
  let katRefund = 0;
  let katAdministrasi = 0;
  let katLainnya = 0;

  allAduan.forEach((a: any) => {
    const text = (a.perihal || "").toLowerCase();
    if (text.includes('tipu') || text.includes('penipuan') || text.includes('gagal') || text.includes('batal')) katPenipuan++;
    else if (text.includes('lantar') || text.includes('telantar')) katPenelantaran++;
    else if (text.includes('dana') || text.includes('refund') || text.includes('uang') || text.includes('kembali') || text.includes('tagihan') || text.includes('bayar')) katRefund++;
    else if (text.includes('izin') || text.includes('status') || text.includes('administratif')) katAdministrasi++;
    else katLainnya++;
  });

  const aduanKategoriData = [
    { name: 'Penipuan / Gagal', value: katPenipuan },
    { name: 'Penelantaran', value: katPenelantaran },
    { name: 'Tunggakan / Refund', value: katRefund },
    { name: 'Administratif', value: katAdministrasi },
    { name: 'Lainnya', value: katLainnya },
  ].filter(k => k.value > 0).sort((a,b) => b.value - a.value);

  const aduanStatusData = rekapPengaduan
    .filter(r => r.keterangan !== 'Jumlah Total')
    .map((r, i) => {
      const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#a855f7'];
      return { name: r.keterangan, value: r.total, fill: colors[i % colors.length] };
    });

  let sentimenSangatNegatif = 0;
  let sentimenNegatif = 0;
  let sentimenNetral = 0;

  allAduan.forEach((a: any) => {
    const text = (a.perihal || "").toLowerCase();
    const prog = (a.progress || "").toLowerCase();
    if (a.kategori === 'HK' || a.kategori === 'UM' || text.includes('bareskrim') || text.includes('tipu') || text.includes('pidana')) {
      sentimenSangatNegatif++;
    } else if (prog.includes('mediasi') || text.includes('lantar') || text.includes('dana') || text.includes('gagal')) {
      sentimenNegatif++;
    } else {
      sentimenNetral++;
    }
  });

  const totalSentimen = sentimenSangatNegatif + sentimenNegatif + sentimenNetral || 1;
  const persentaseSangatNegatif = Math.round((sentimenSangatNegatif / totalSentimen) * 100);

  const aduanSentimenData = [
    { name: 'Sangat Negatif', value: sentimenSangatNegatif, fill: '#f43f5e' },
    { name: 'Negatif', value: sentimenNegatif, fill: '#f59e0b' },
    { name: 'Netral', value: sentimenNetral, fill: '#3b82f6' }
  ].filter(s => s.value > 0);

  // Filter logic for Kepatuhan Penyelenggara
  const wilayahList = ['DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'Banten', 'Sumatera Utara'];
  const pelanggaranList = ['Rendah', 'Sedang', 'Tinggi', 'Kritis'];
  const processedDirektoriList = direktoriList.map((item, i) => ({
    ...item,
    wilayahOperasional: item.wilayahOperasional || wilayahList[i % wilayahList.length],
    tingkatPelanggaran: item.tingkatPelanggaran || pelanggaranList[i % pelanggaranList.length],
    skorAudit: item.skorAudit || (95 - (i * 12)),
  }));
  const filteredDirektoriList = processedDirektoriList.filter(item => {
    const matchWilayah = filterWilayah === 'Semua Wilayah' || item.wilayahOperasional === filterWilayah;
    const matchPelanggaran = filterPelanggaran === 'Semua Tingkat' || item.tingkatPelanggaran === filterPelanggaran;
    return matchWilayah && matchPelanggaran;
  });


  const uniquePenyelenggara = Array.from(new Set(operasionalPackages.map(pkg => pkg.pihkName || "Penyelenggara Terhubung"))).filter(Boolean).sort();
  const filteredOperasional = filterOperasionalPenyelenggara === 'Semua Penyelenggara' 
    ? operasionalPackages 
    : operasionalPackages.filter(p => (p.pihkName || "Penyelenggara Terhubung") === filterOperasionalPenyelenggara);

    const handleResolveSOS = async (id: string) => {
    try {
      await updateDoc(doc(db, "sos_alerts", id), { status: "resolved" });
      setToastMessage({title: "SOS Ditangani", desc: "Sinyal telah diselesaikan secara sistem.", type: "success"});
    } catch (e) {
      console.error(e);
      setToastMessage({title: "Error", desc: "Gagal memproses ke database.", type: "error"});
    }
  };

  const handleSendWarning = async (travelName: string, actionName: string) => {
    try {
      await addDoc(collection(db, "ews_warnings"), {
        ppiu: travelName,
        judul: actionName,
        status: "active",
        timestamp: new Date().toISOString()
      });
      setToastMessage({title: "Tindakan Dikirim", desc: `${actionName} telah masuk ke sistem ${travelName}`, type: "success"});
    } catch (e) {
      console.error(e);
      setToastMessage({title: "Error", desc: "Gagal mengirim tindakan EWS.", type: "error"});
    }
  };

  return (
    <div className="flex flex-col w-full text-slate-200">

      {/* Global SOS Alert */}
      {sosAlerts.length > 0 && (
        <div className="bg-red-600/90 backdrop-blur border-b border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.5)] p-4 mb-6 rounded-xl flex items-center justify-between animate-pulse sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <ShieldAlert className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-white font-black text-lg uppercase tracking-wider">DARURAT: {sosAlerts.length} Sinyal SOS Jemaah Aktif di Lapangan!</h2>
              <p className="text-red-100 text-sm">Harap segera koordinasi dengan Konsulat Jenderal RI atau pihak penerbangan terkait indikasi penelantaran.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="font-bold" onClick={() => {
              setToastMessage({
                title: "Detail Sinyal SOS Darurat",
                desc: `Jemaah: ${sosAlerts[0]?.nama || sosAlerts[0]?.jemaahName || 'Tidak diketahui'}\nLokasi: ${sosAlerts[0]?.lokasi || sosAlerts[0]?.location || 'Tidak diketahui'}\nKeterangan: ${sosAlerts[0]?.keterangan || 'N/A'}`,
                type: "error"
              });
              setTimeout(() => setToastMessage(null), 8000);
            }}>
              Lihat Detail
            </Button>
            <Button className="font-bold bg-white text-red-600 hover:bg-red-50" onClick={async () => {
              try {
                await updateDoc(doc(db, "sos_alerts", sosAlerts[0].id), { status: "resolved" });
                setToastMessage({
                  title: "Sinyal Diselesaikan",
                  desc: "Laporan SOS berhasil ditutup dan satgas telah menangani jemaah.",
                  type: "success"
                });
                setTimeout(() => setToastMessage(null), 5000);
              } catch(e) {
                console.error(e);
              }
            }}>
              Selesai & Tutup
            </Button>
          </div>
        </div>
      )}

      {/* The generic header has been moved INSIDE the kuota tab logic below so it doesn't pollute others! */}
      {activeTab === 'kuota' && (
        <div className="flex flex-col gap-4 flex-grow">

          {/* Header Dashboard Khusus Tab Kuota */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight theme-title">Pantauan Kuota & Antrean</h1>
              <p className="text-sm text-slate-400">Pusat statistik pendaftaran dan keberangkatan jemaah nasional.</p>
            </div>
            
            {/* Upload Panduan Section */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-md">
                <Upload className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Update Panduan PDF</h3>
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="file" 
                    accept=".pdf"
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 max-w-[180px]"
                    onChange={(e) => setPanduanFile(e.target.files?.[0] || null)}
                  />
                  <Button 
                    onClick={handleUploadPanduan}
                    disabled={!panduanFile || isUploadingPanduan}
                    size="sm"
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500"
                  >
                    {isUploadingPanduan ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Form Manajemen Kuota */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Manajemen Kuota Nasional
            </h3>
            
            <div className="space-y-6">
              {/* Haji Reguler */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2">Jatah Kuota Haji Reguler</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kuota</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaHajiRegulerTotal} onChange={(e) => setKuotaHajiRegulerTotal(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terisi</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaHajiRegulerTerisi} onChange={(e) => setKuotaHajiRegulerTerisi(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Haji Khusus */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Jatah Kuota Haji Khusus (Haji Plus)</span>
                  <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">Hanya via Travel PIHK</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kuota</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaHajiKhususTotal} onChange={(e) => setKuotaHajiKhususTotal(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terisi</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaHajiKhususTerisi} onChange={(e) => setKuotaHajiKhususTerisi(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Umrah */}
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50">
                <h4 className="text-sm font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2 flex justify-between">
                  <span>Target Nasional Umrah</span>
                  <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">Sepanjang Tahun</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimasi Target Kuota</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaUmrahTotal} onChange={(e) => setKuotaUmrahTotal(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi Berangkat</label>
                    <input type="number" className="w-full h-9 px-3 rounded-md bg-slate-950 border border-slate-800 text-sm focus:border-emerald-500 focus:outline-none text-white font-mono" value={kuotaUmrahTerisi} onChange={(e) => setKuotaUmrahTerisi(Number(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 border border-slate-800 rounded-xl bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                 <h4 className="text-sm font-bold theme-title mb-1">Upload Peta Sebaran Wilayah</h4>
                 <p className="text-xs text-slate-400">Punya data Excel (xlsx/csv) untuk grafik sebaran provinsi?</p>
                 <p className="text-[10px] text-slate-500 mt-1">Pastikan ada kolom bernama 'Provinsi'/'Kota' dan 'Kuota' di sheet pertama.</p>
              </div>
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-slate-700 flex items-center gap-2">
                 <Upload className="w-4 h-4" /> Pilih File Excel
                 <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSaveKuota} disabled={isSavingKuota} className="font-bold">
                <Save className="w-4 h-4 mr-2" />
                {isSavingKuota ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col h-[500px]">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Globe2 className="w-48 h-48 text-white" />
              </div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Serapan Kuota Haji Nasional 2026
                  </h3>
                  <div className="mt-4 flex gap-8">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Total Porsi Haji</p>
                      <span className="text-3xl font-light theme-title tracking-tighter">{totalNasionalKuota.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Porsi Terisi</p>
                      <span className="text-3xl font-bold text-emerald-400 tracking-tighter">{totalTerisi.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sisa Porsi (Reguler & Khusus)</p>
                  <p className="text-2xl font-bold theme-title">{sisaKuota.toLocaleString('id-ID')}</p>
                </div>
              </div>
              <div className="h-full w-full relative z-10 mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fill: '#94a3b8', fontSize: 11}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc'}} itemStyle={{color: '#ffffff', fontWeight: 'bold'}} formatter={(value) => [Number(value).toLocaleString('id-ID'), 'Total Kuota']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} label={<CustomLabel />} isAnimationActive={false}>
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#10b981' : '#334155'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
                <h3 className="text-sm font-bold theme-title mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Rasio Haji Reguler
                </h3>
                <div className="relative w-full h-full min-h-[150px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Terisi', value: kuotaHajiRegulerTerisi, fill: '#10b981' },
                        { name: 'Sisa', value: Math.max(0, kuotaHajiRegulerTotal - kuotaHajiRegulerTerisi), fill: '#334155' }
                      ]} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} stroke="none" />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold theme-title">{kuotaHajiRegulerTotal > 0 ? ((kuotaHajiRegulerTerisi / kuotaHajiRegulerTotal) * 100).toFixed(0) : "0"}%</span>
                    <span className="text-[10px] text-slate-400">Terisi</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
                <h3 className="text-sm font-bold theme-title mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400" /> Rasio Haji Khusus
                </h3>
                <div className="relative w-full h-full min-h-[150px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[
                        { name: 'Terisi (PIHK)', value: kuotaHajiKhususTerisi, fill: '#3b82f6' },
                        { name: 'Sisa (PIHK)', value: Math.max(0, kuotaHajiKhususTotal - kuotaHajiKhususTerisi), fill: '#334155' }
                      ]} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} stroke="none" />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold theme-title">{kuotaHajiKhususTotal > 0 ? ((kuotaHajiKhususTerisi / kuotaHajiKhususTotal) * 100).toFixed(0) : "0"}%</span>
                    <span className="text-[10px] text-slate-400">Terisi</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
                <h3 className="text-sm font-bold theme-title mb-4 flex items-center gap-2">
                  <PlaneTakeoff className="w-4 h-4 text-amber-400" /> Jemaah Umrah
                </h3>
                <div className="mt-2">
                   <p className="text-xs text-slate-400 mb-1">Realisasi Keberangkatan</p>
                   <span className="text-2xl font-bold text-amber-400 tracking-tighter">{kuotaUmrahTerisi.toLocaleString('id-ID')}</span>
                   <span className="text-xs text-slate-500 ml-2">/ {kuotaUmrahTotal.toLocaleString('id-ID')} (Target)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 mt-4">
                   <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${Math.min(100, (kuotaUmrahTerisi / kuotaUmrahTotal) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {activeTab === 'kepatuhan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in h-full">
          <Card className="bg-[#0b1120] border-slate-800/60 shadow-xl overflow-hidden mt-2">
            <CardHeader className="border-b border-slate-800/50 pb-4">
               <div className="flex justify-between items-center w-full">
                 <CardTitle className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> KEPATUHAN PENYELENGGARA
                 </CardTitle>
                 
                 <div className="flex gap-3 items-center">
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors w-40"
                     value={filterWilayah}
                     onChange={(e) => setFilterWilayah(e.target.value)}
                   >
                     <option value="Semua Wilayah">Semua Wilayah</option>
                     {wilayahList.map(w => (
                       <option key={w} value={w}>{w}</option>
                     ))}
                   </select>
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors w-40"
                     value={filterPelanggaran}
                     onChange={(e) => setFilterPelanggaran(e.target.value)}
                   >
                     <option value="Semua Tingkat">Semua Tingkat</option>
                     {pelanggaranList.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800/50 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-900/30">
                        <th className="p-4 font-bold">NAMA ENTITAS</th>
                        <th className="p-4 font-bold">JENIS IZIN</th>
                        <th className="p-4 font-bold text-center">WILAYAH</th>
                        <th className="p-4 font-bold text-center">PELANGGARAN</th>
                        <th className="p-4 font-bold text-center">STATUS</th>
                        <th className="p-4 font-bold text-center">SKOR</th>
                        <th className="p-4 font-bold text-center">TINDAKAN</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredDirektoriList.map((item, idx) => {
                        const getPelanggaranStyle = (tingkat: string) => {
                          if(tingkat === 'Rendah') return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50';
                          if(tingkat === 'Sedang') return 'text-blue-400 bg-blue-950/40 border-blue-900/50';
                          if(tingkat === 'Tinggi') return 'text-amber-400 bg-amber-950/40 border-amber-900/50';
                          if(tingkat === 'Kritis') return 'text-rose-400 bg-rose-950/40 border-rose-900/50';
                          return 'text-slate-400 bg-slate-900 border-slate-700';
                        };
                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-200">{item.name}</p>
                            </td>
                            <td className="p-4 text-slate-400 font-medium">
                              {item.type || 'PPIU'}
                            </td>
                            <td className="p-4 text-slate-400 text-center font-medium">
                              {item.wilayahOperasional}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 text-xs font-bold rounded border ${getPelanggaranStyle(item.tingkatPelanggaran)}`}>
                                {item.tingkatPelanggaran}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="inline-flex flex-col justify-center items-center px-3 py-1 rounded bg-amber-950/30 border border-amber-900/40">
                                <span className="text-amber-500 text-[11px] font-bold leading-tight">Dalam</span>
                                <span className="text-amber-500 text-[11px] font-bold leading-tight">Pengawasan</span>
                              </div>
                            </td>
                            <td className="p-4 text-center font-bold text-slate-300">
                              {item.skorAudit} <span className="text-slate-500 font-normal">/ 100</span>
                            </td>
                            <td className="p-4 text-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs bg-transparent border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white active:bg-slate-600 active:text-white"
                                onClick={() => setSelectedKepatuhan(item)}
                              >
                                Detail
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'registrasi' && (
        <div className="flex flex-col lg:flex-row gap-6 flex-grow animate-in fade-in h-full">
          {/* Left Panel - List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Cari penyelenggara..."
                className="bg-[#0b1120] border border-slate-800 rounded-lg pl-9 pr-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 w-full"
                value={searchPemohon}
                onChange={(e) => setSearchPemohon(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar h-[calc(100vh-250px)]">
              {direktoriList.filter(item => item.name?.toLowerCase().includes(searchPemohon.toLowerCase())).map((item, idx) => {
                const isActive = activePemohon?.id === item.id;
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setActivePemohon(item)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold text-sm ${isActive ? 'text-emerald-100' : 'text-slate-200'}`}>
                        {item.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                        item.status === 'MENUNGGU' ? 'bg-amber-950/50 text-amber-500 border-amber-900/50' :
                        item.status === 'DISETUJUI' ? 'bg-emerald-950/50 text-emerald-500 border-emerald-900/50' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {item.status?.toUpperCase() || 'MENUNGGU'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-col gap-1">
                      <span>ID: {item.id || `PIHK-00${idx+1}`}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Baru saja</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {activePemohon ? (
              <>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{activePemohon.name}</h2>
                    <p className="text-sm text-emerald-500 flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" /> Pengajuan Izin {activePemohon.type || 'PIHK'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Status Pemohon</p>
                    <p className="text-amber-400 font-bold text-sm">Verifikasi Dokumen</p>
                  </div>
                </div>

                {/* Card 1: Validasi AHU */}
                <Card className="bg-[#0b1120] border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">1</div>
                      <h3 className="font-bold text-slate-200">Validasi Status Hukum (AHU)</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 border border-slate-800 p-4 rounded-lg gap-4">
                      <div>
                        <p className="text-sm text-slate-300">Nomor Induk Berusaha (NIB): <span className="font-bold">8120004951234</span></p>
                        <p className="text-xs text-slate-500 mt-1">Integrasi API Kemenkumham diperlukan untuk memeriksa keabsahan entitas.</p>
                      </div>
                      <Button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold shrink-0">
                        VALIDASI DATA AHU
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Dokumen Fisik/Digital */}
                <Card className="bg-[#0b1120] border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">2</div>
                      <h3 className="font-bold text-slate-200">Kelengkapan Dokumen Fisik/Digital</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SK Kemenkumham Upload */}
                      <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all">
                        <Upload className="w-6 h-6 text-slate-500 mb-3" />
                        <p className="text-sm font-bold text-slate-300">SK Kemenkumham</p>
                        <p className="text-[10px] text-slate-500 mt-1">Format PDF (Maks. 5MB)</p>
                      </div>

                      {/* Bukti Rekening Upload */}
                      <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all">
                        <Upload className="w-6 h-6 text-slate-500 mb-3" />
                        <p className="text-sm font-bold text-slate-300">Bukti Rekening 1 Miliar</p>
                        <p className="text-[10px] text-slate-500 mt-1">Format PDF (Maks. 5MB)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <FileCheck className="w-12 h-12 mb-4 opacity-50" />
                <p>Pilih pemohon dari daftar di sebelah kiri untuk melihat detail.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'operasional' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <Card className="bg-[#0b1120] border-slate-800/60 shadow-xl overflow-hidden mt-2">
            <CardHeader className="border-b border-slate-800/50 pb-4">
               <div className="flex justify-between items-center w-full">
                 <CardTitle className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                   <ActivitySquare className="w-4 h-4" /> RADAR KESIAPAN OPERASIONAL
                 </CardTitle>
                 
                 <div className="flex gap-4 items-center">
                   <select
                     className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
                     value={filterOperasionalPenyelenggara}
                     onChange={(e) => setFilterOperasionalPenyelenggara(e.target.value)}
                   >
                     <option value="Semua Penyelenggara">Semua Penyelenggara</option>
                     {uniquePenyelenggara.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                   <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-400">
                     {filteredOperasional.length} Paket Layanan Dipantau
                   </div>
                 </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#0f172a] border-b border-slate-800">
                      <tr>
                        <th className="p-4 font-bold text-slate-300 w-1/3">Nama Travel / Paket</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Status Visa</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Status Tiket (PNR)</th>
                        <th className="p-4 font-bold text-slate-300 text-center">Kesiapan Hotel</th>
                        <th className="p-4 font-bold text-slate-300 text-center w-24">Indikator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredOperasional.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data paket layanan dipantau</td></tr>
                      )}
                      {filteredOperasional.map((pkg, idx) => {
                        const getVisaStyle = (status) => {
                          if(status?.includes('Terbit Seluruhnya')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('Sebagian')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          if(status?.includes('Proses')) return 'text-orange-400 border-orange-900 bg-orange-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        const getTiketStyle = (status) => {
                          if(status?.includes('Issued')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('Menunggu')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        const getHotelStyle = (status) => {
                          if(status?.includes('Lunas')) return 'text-emerald-400 border-emerald-900 bg-emerald-950/50';
                          if(status?.includes('DP')) return 'text-amber-400 border-amber-900 bg-amber-950/50';
                          return 'text-rose-400 border-rose-900 bg-rose-950/50';
                        };
                        
                        let indicatorColor = 'bg-rose-500';
                        if (pkg.statusVisa?.includes('Terbit') && pkg.statusTiket?.includes('Issued') && pkg.statusHotel?.includes('Lunas')) {
                          indicatorColor = 'bg-emerald-500';
                        } else if (pkg.statusVisa?.includes('Proses') || pkg.statusVisa?.includes('Sebagian') || pkg.statusTiket?.includes('Menunggu') || pkg.statusHotel?.includes('DP')) {
                          indicatorColor = 'bg-amber-500';
                        }

                        return (
                        <tr key={pkg.id || idx} className="hover:bg-slate-800/20 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-200 text-[15px]">{pkg.name}</p>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide">{pkg.pihkName}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1.5 text-[11px] font-medium rounded-full border ${getVisaStyle(pkg.statusVisa || 'Belum Diajukan')}`}>
                              {pkg.statusVisa || 'Belum Diajukan'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1.5 text-[11px] font-medium rounded-full border ${getTiketStyle(pkg.statusTiket || 'Belum Issued')}`}>
                              {pkg.statusTiket || 'Belum Issued (SV-8832)'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-3 py-1.5 text-[11px] font-medium rounded-full border ${getHotelStyle(pkg.statusHotel || 'Belum Booking')}`}>
                              {pkg.statusHotel || 'Belum Booking'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className={`w-2.5 h-2.5 rounded-full mx-auto ${indicatorColor} shadow-[0_0_8px_currentColor]`}></div>
                          </td>
                        </tr>
                        )})}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'aduan' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          {/* Top 3 Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: ADUAN BERDASARKAN KATEGORI */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> ADUAN BERDASARKAN KATEGORI
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Administratif', value: 5, fill: '#a855f7' },
                    { name: 'Penelantaran', value: 5, fill: '#10b981' },
                    { name: 'Tunggakan / Refund', value: 20, fill: '#3b82f6' },
                    { name: 'Penipuan / Gagal', value: 25, fill: '#f59e0b' },
                    { name: 'Lainnya', value: 80, fill: '#fb7185' },
                  ]} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {
                        [...Array(5)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#a855f7', '#10b981', '#3b82f6', '#f59e0b', '#fb7185'][index]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Card 2: STATUS PENYELESAIAN */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> STATUS PENYELESAIAN
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '', value: 60, fill: '#3b82f6' },
                    { name: 'Klarifikasi', value: 5, fill: '#f59e0b' },
                    { name: 'Mediasi', value: 20, fill: '#10b981' },
                    { name: 'Bareskrim', value: 55, fill: '#ef4444' },
                  ]} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                      {
                        [...Array(4)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#10b981', '#ef4444'][index]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Card 3: ANALISIS SENTIMEN LAPORAN */}
            <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden">
              <CardHeader className="pb-2 pt-6 px-6">
                <CardTitle className="text-emerald-500 text-[11px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4" /> ANALISIS SENTIMEN LAPORAN
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] flex justify-center items-center relative pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sangat Negatif', value: 43, fill: '#fb7185' },
                        { name: 'Negatif', value: 37, fill: '#3b82f6' },
                        { name: 'Netral', value: 20, fill: '#f59e0b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {
                        [...Array(3)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#fb7185', '#3b82f6', '#f59e0b'][index]} />
                        ))
                      }
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center pointer-events-none mt-0">
                  <span className="text-2xl font-black text-rose-400 leading-none">43%</span>
                  <span className="text-[9px] text-slate-400 text-center tracking-wider font-bold mt-1 uppercase leading-tight">SANGAT<br/>NEGATIF</span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-emerald-900/50 mt-4 px-2">
            <button 
              onClick={() => setAduanSubTab('rekap')} 
              className={`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors ${aduanSubTab === 'rekap' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}`}>
              Rekap Pengaduan
            </button>
            <button 
              onClick={() => setAduanSubTab('haji_khusus')} 
              className={`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors ${aduanSubTab === 'haji_khusus' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}`}>
              Haji Khusus
            </button>
            <button 
              onClick={() => setAduanSubTab('umrah')} 
              className={`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors ${aduanSubTab === 'umrah' ? 'text-emerald-400 bg-[#0b1120] border-t border-l border-r border-emerald-900/50' : 'text-emerald-500/70 hover:text-emerald-400'}`}>
              Umrah
            </button>
            <button 
              onClick={() => setAduanSubTab('bareskrim')} 
              className={`px-6 py-3 rounded-t-xl font-bold text-[13px] tracking-wide relative top-[1px] transition-colors ml-4 ${aduanSubTab === 'bareskrim' ? 'text-rose-400 bg-[#0b1120] border-t border-l border-r border-rose-900/50' : 'text-rose-500 hover:text-rose-400'}`}>
              Diserahkan ke Bareskrim
            </button>
          </div>

          {/* Table Details */}
          <Card className="bg-[#0b1120] border-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
             <CardContent className="p-0">
                <div className="overflow-x-auto">
                  
                  {aduanSubTab === 'rekap' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase w-1/2">KETERANGAN</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">HAJI KHUSUS</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">UMRAH</th>
                        <th className="px-8 py-5 font-bold text-slate-400 text-xs tracking-widest uppercase text-center w-1/6">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Pemanggilan Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">21</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">27</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">48</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Klarifikasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">2</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">0</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">2</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Mediasi</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">10</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">8</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">18</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Bareskrim</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">14</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">35</td>
                        <td className="px-8 py-5 text-center text-slate-400 font-medium">49</td>
                      </tr>
                      <tr className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-200">Jumlah Total</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">47</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">70</td>
                        <td className="px-8 py-5 text-center font-bold text-slate-300">117</td>
                      </tr>
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'haji_khusus' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanHajiKhusus.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{item.pihk}</td>
                          <td className="px-6 py-4 text-slate-300 text-xs">{item.perihal}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center inline-flex items-center justify-center ${item.progress.toLowerCase().includes('klarifikasi') ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {item.progress}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'umrah' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PPIU (PENYELENGGARA)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-2/5">PERIHAL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">PROGRESS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanUmrah.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{item.ppiu}</td>
                          <td className="px-6 py-4 text-slate-300 text-xs">{item.perihal}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center inline-flex items-center justify-center ${item.progress.toLowerCase().includes('klarifikasi') ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {item.progress}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}

                  {aduanSubTab === 'bareskrim' && (
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-800 bg-[#0f172a]/50 sticky top-0 z-10 backdrop-blur">
                      <tr>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">NO. REG & TGL</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase">PIHK / PPIU (TERLAPOR)</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase text-center">KAT</th>
                        <th className="px-6 py-4 font-bold text-slate-400 text-xs tracking-widest uppercase w-1/2">TINDAK LANJUT / STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {aduanBareskrim.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4"><div className="font-mono text-slate-300">{item.noReg}</div><div className="text-xs text-slate-500 mt-1">{item.tanggal}</div></td>
                          <td className="px-6 py-4 font-bold text-rose-400">{item.entitas}</td>
                          <td className="px-6 py-4 text-center"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">{item.kategori}</span></td>
                          <td className="px-6 py-4 text-slate-300 text-xs leading-relaxed"><span className="text-rose-400 font-bold">Ditangani {item.perihal.includes('Polda') ? 'Polda' : 'Bareskrim POLRI'}</span><br/><span className="text-slate-400">{item.perihal}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}
                  
                </div>
             </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'ews' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-rose-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Early Warning System (EWS)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Deteksi Dini Keterlambatan dan Anomali</p>
            </div>
          </div>
                    <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)]">
               <CardHeader className="border-b border-rose-900/30 pb-4 bg-slate-950/80">
                 <CardTitle className="text-rose-400 flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Anomali Lokasi Hotel (Geofencing)</span>
                    <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold animate-pulse">2 TRAVEL TERDETEKSI</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex gap-4 hover:bg-slate-800/30">
                      <div className="w-10 h-10 rounded bg-rose-950/50 border border-rose-900 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-200 font-bold text-sm">PT Nur Hidayah Wisata</h4>
                        <p className="text-xs text-slate-400 mt-1">Sistem GPS Jemaah mendeteksi lokasi check-in berjarak <strong className="text-rose-400">4.2 KM</strong> dari Masjidil Haram.</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px]">
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Hotel Dijanjikan</span>
                            <span className="text-emerald-400 font-bold">Zamzam Pullman (50m)</span>
                          </div>
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Hotel Aktual (GPS)</span>
                            <span className="text-rose-400 font-bold">Al-Kiswah (4.2km)</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">Tindak</Button>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-slate-900 border-amber-900/50 shadow-[0_0_20px_rgba(217,119,6,0.1)]">
               <CardHeader className="border-b border-amber-900/30 pb-4 bg-slate-950/80">
                 <CardTitle className="text-amber-400 flex justify-between items-center text-sm font-bold">
                    <span className="flex items-center gap-2"><Bed className="w-5 h-5"/> Fraud Bintang Hotel (Bait & Switch)</span>
                    <span className="text-[10px] px-2 py-1 bg-amber-950/80 text-amber-400 border border-amber-900/50 rounded-full font-bold">1 TRAVEL DIBLOKIR</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex gap-4 hover:bg-slate-800/30">
                      <div className="w-10 h-10 rounded bg-amber-950/50 border border-amber-900 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-slate-200 font-bold text-sm">PT Berkah Abadi Tour</h4>
                        <p className="text-xs text-slate-400 mt-1">Cross-check API Nusuk mendeteksi penurunan spesifikasi hotel secara diam-diam tanpa persetujuan Jemaah.</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px]">
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Brosur Paket</span>
                            <span className="text-amber-400 font-bold">⭐⭐⭐⭐⭐ (Bintang 5)</span>
                          </div>
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                          <div className="bg-slate-950 border border-slate-800 px-2 py-1 rounded">
                            <span className="text-slate-500 block">Validasi API Nusuk</span>
                            <span className="text-rose-400 font-bold">⭐⭐ (Bintang 2)</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-rose-900 text-rose-400 bg-rose-950/20">Blokir Visanya</Button>
                    </div>
                  </div>
               </CardContent>
            </Card>
          </div>
          
          <Card className="bg-slate-900 border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)] overflow-hidden flex flex-col mt-6">
            <CardHeader className="border-b border-rose-900/30 pb-4 bg-slate-950/80">
              <CardTitle className="text-rose-400 flex justify-between items-center text-sm font-bold">
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5"/> Daftar Jemaah Tunda Kepulangan (EWS)</span>
                <span className="text-[10px] px-2 py-1 bg-rose-950/80 text-rose-400 border border-rose-900/50 rounded-full font-bold">{jemaahTunda.length} Jemaah Terdampak</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Daftar manifest jemaah yang terdeteksi tertunda kepulangannya dari Arab Saudi berdasarkan perbandingan jadwal manifest (SLA).</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[400px] bg-slate-900/50">
              {jemaahTunda.length > 0 ? (
                <div className="divide-y divide-slate-800/50">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950/50 text-slate-400 font-medium border-b border-slate-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Nama Jemaah & Porsi</th>
                        <th className="px-4 py-3">Travel Penyelenggara</th>
                        <th className="px-4 py-3">Paket & Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {jemaahTunda.map((jemaah, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-200">{jemaah.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Porsi: {jemaah.porsiNumber || jemaah.porsi || '-'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-amber-400">
                            {jemaah.penyelenggara}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs">{jemaah.paket}</div>
                            <div className="inline-flex mt-1 items-center gap-1 text-[9px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-rose-900/50 font-bold uppercase">
                              <AlertTriangle className="w-3 h-3" /> Tunda Kepulangan
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button size="sm" variant="outline" className="border-rose-900/50 text-rose-400 hover:bg-rose-900 hover:text-white h-7 text-[10px] font-bold" onClick={() => setToastMessage({title: 'Investigasi', desc: 'Permintaan investigasi ditambahkan.', type: 'aduan'})}>
                              Investigasi
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/30 flex items-center justify-center mb-4 border border-emerald-900/30">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/50" />
                  </div>
                  <p className="font-bold text-slate-300 text-sm">Clear</p>
                  <p className="text-xs mt-2 text-slate-400">Tidak ada jemaah yang masuk dalam kategori Tunda Kepulangan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'scanner' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-emerald-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <ScanLine className="w-4 h-4" /> Visibilitas Operator Lapangan (Mobile Sync)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Status Perjalanan Jemaah dari Keberangkatan hingga Kepulangan.</p>
            </div>
          </div>
          <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm theme-title flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SmartphoneNfc className="w-5 h-5 text-emerald-500" /> Status Pemantauan Mobile
                    </div>
                    <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center shrink-0 border border-emerald-500/30">
                      <ScanLine className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-white font-mono">18</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Petugas Mobile Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Koneksi API (WebSocket)</span>
                      <span className="text-emerald-400 font-bold">Terhubung</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Titik Pantau Aktif</span>
                      <span className="text-slate-300 font-bold text-right">CGK Terminal 3<br/>Bandara Kertajati</span>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-4">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                          <th className="p-4 font-medium">Calon Jemaah</th>
                          <th className="p-4 font-medium">Penyelenggara & Paket</th>
                          <th className="p-4 font-medium">Pesawat</th>
                          <th className="p-4 font-medium text-center">Keberangkatan</th>
                          <th className="p-4 font-medium text-center">Kepulangan</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                        {mobileScans.length > 0 ? Object.values(mobileScans.reduce((acc, scan) => {
                          const jemaahName = scan.rawData?.includes(':') ? scan.rawData.split(':')[2] : (scan.scannedData || scan.rawData || 'Jemaah');
                          const noPorsi = scan.rawData?.includes(':') ? scan.rawData.split(':')[1] : (scan.scannedData || scan.rawData || '-');
                          // Tentukan jenis dari data scan, default ke Keberangkatan jika tidak ada untuk fallback dummy
                          const jenis = scan.jenis || 'Keberangkatan'; 
                          
                          if (!acc[noPorsi]) {
                            acc[noPorsi] = {
                              id: scan.id,
                              noPorsi,
                              jemaahName,
                              penyelenggara: scan.penyelenggara || 'PT. Khazzanah Al-Anshary',
                              paket: scan.paket || 'Paket VIP Ramadhan',
                              pesawat: scan.pesawat || 'Garuda Indonesia (GA-980)',
                              keberangkatan: null,
                              kepulangan: null
                            };
                          }
                          
                          const timeStr = scan.timestamp?.seconds ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : (typeof scan.timestamp === 'string' ? new Date(scan.timestamp).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}));
                          
                          if (jenis === 'Keberangkatan' && !acc[noPorsi].keberangkatan) {
                             acc[noPorsi].keberangkatan = timeStr;
                          } else if (jenis === 'Kepulangan' && !acc[noPorsi].kepulangan) {
                             acc[noPorsi].kepulangan = timeStr;
                          }
                          
                          return acc;
                        }, {} as Record<string, any>)).map((jemaah: any, i) => (
                          <tr key={jemaah.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                               <p className="font-bold text-slate-300">{jemaah.jemaahName}</p>
                               <p className="text-xs text-slate-500 font-mono mt-0.5">Porsi: {jemaah.noPorsi}</p>
                            </td>
                            <td className="p-4">
                               <p className="font-bold text-emerald-400 text-xs">{jemaah.penyelenggara}</p>
                               <p className="text-xs text-slate-400 mt-0.5">{jemaah.paket}</p>
                            </td>
                            <td className="p-4">
                               <div className="flex items-center gap-2">
                                  <PlaneTakeoff className="w-4 h-4 text-slate-400" />
                                  <span className="text-xs text-slate-300">{jemaah.pesawat}</span>
                               </div>
                            </td>
                            <td className="p-4 text-center">
                               {jemaah.keberangkatan ? (
                                  <div className="flex flex-col items-center">
                                    <span className="px-2.5 py-1 bg-blue-950/50 text-blue-400 border border-blue-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
                                      <ArrowUpRight className="w-3 h-3"/> Berangkat
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{jemaah.keberangkatan}</span>
                                  </div>
                               ) : (
                                  <span className="text-xs text-slate-600 italic">Menunggu...</span>
                               )}
                            </td>
                            <td className="p-4 text-center">
                               {jemaah.kepulangan ? (
                                  <div className="flex flex-col items-center">
                                    <span className="px-2.5 py-1 bg-amber-950/50 text-amber-400 border border-amber-900/50 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 mb-1">
                                      <ArrowDownRight className="w-3 h-3"/> Tiba
                                    </span>
                                    <span className="text-xs font-mono text-slate-400">{jemaah.kepulangan}</span>
                                  </div>
                               ) : (
                                  <span className="text-xs text-slate-600 italic">Belum Kembali</span>
                               )}
                            </td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">Belum ada jemaah yang terpindai.</td></tr>
                        )}
                    </tbody>
                  </table>
                  </div>
                </CardContent>
          </Card>
        </div>
      )}

      
      {activeTab === 'integrasi' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-blue-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Network className="w-4 h-4" /> Manajemen API Lintas Sektoral (G2G & B2B)
              </h3>
              <p className="text-sm text-slate-400 mt-1">Pemantauan konektivitas sistem SISKOPATUH dengan Kementerian, Lembaga Negara, dan Otoritas Luar Negeri.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ditjen Imigrasi */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-400" /> Ditjen Imigrasi (Kemenkumham)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'Ditjen Imigrasi', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk mengecek apakah paspor jemaah asli, masih berlaku, dan apakah jemaah berstatus cekal (pencegahan tangkal).</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">gRPC / TLS 1.3</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">API Latency</span>
                    <span className="text-emerald-400 font-bold">14ms</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Sync Mode</span>
                    <span className="text-blue-400 font-bold">Real-time Validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BPS BPIH */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" /> BPS BPIH (Bank Penerima Setoran)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'BPS BPIH', type: 'provide'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan agar SISKOPATUH otomatis tahu saat jemaah sudah melunasi pembayaran rekening (Escrow) tanpa perlu mutasi manual.</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">REST API (ISO 20022)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Data Transfer (24h)</span>
                    <span className="text-amber-400 font-bold">4.2 GB</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Status Rekonsiliasi</span>
                    <span className="text-emerald-400 font-bold">Sinkron (Auto)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nusuk / Saudi */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-emerald-400" /> Sistem Nusuk (KSA)
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'Sistem Nusuk', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk melacak apakah e-Visa jemaah benar-benar sudah diterbitkan secara sah oleh otoritas Saudi (MoHU KSA).</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Endpoint Protocol</span>
                    <span className="text-slate-300 font-mono">REST API (OAuth 2.0)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">API Latency</span>
                    <span className="text-amber-400 font-bold">245ms (Intl)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Visa Webhook</span>
                    <span className="text-emerald-400 font-bold">Aktif (Push)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Airlines / GDS */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-indigo-400" /> GDS Maskapai Penerbangan
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded-full border border-emerald-900 font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Connected
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700" onClick={() => setApiModal({show: true, instansi: 'GDS Maskapai', type: 'consume'})}>
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs text-slate-400 mb-4">API digunakan untuk memvalidasi apakah Kode Booking (PNR) tiket PP yang dilaporkan travel adalah tiket asli (Issued) dan bukan booking palsu/bodong.</p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Providers</span>
                    <span className="text-slate-300 font-mono">Amadeus, Sabre, SV, GA</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Validation Mode</span>
                    <span className="text-indigo-400 font-bold">Atomic Locking</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">PNR Hit Rate</span>
                    <span className="text-emerald-400 font-bold">1.2K req/hour</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}


      {activeTab === 'ledger' && (
        <div className="flex flex-col gap-6 flex-grow animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-blue-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                <Network className="w-4 h-4" /> Ledger Mutasi Jemaah
              </h3>
              <p className="text-sm text-slate-400 mt-1">Audit Trail Immutable Perpindahan Antar Penyelenggara (Konsorsium)</p>
            </div>
            <Button size="sm" className="  font-bold" onClick={() => setToastMessage({title: 'Ekspor Ledger', desc: 'Mutasi Ledger berhasil diekspor ke PDF/CSV.', type: 'success'})}>
              <ArrowDownRight className="w-4 h-4 mr-2" /> Unduh Audit Trail
            </Button>
          </div>
          
          <Card className="bg-slate-900 border-slate-800">
             <CardContent className="p-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 bg-slate-950">
                      <th className="p-4 font-medium">Timestamp & Hash Mutasi</th>
                      <th className="p-4 font-medium">Entitas Asal (Origin)</th>
                      <th className="p-4 font-medium">Aksi Konsorsium</th>
                      <th className="p-4 font-medium">Entitas Tujuan (Dest)</th>
                      <th className="p-4 font-medium">Detail Jemaah</th>
                      <th className="p-4 font-medium">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4">
                        <p className="font-mono text-xs text-slate-400">2026-08-16 09:12:00</p>
                        <p className="font-mono text-[9px] text-slate-600 mt-1">tx: 0x8f2a...c91e</p>
                      </td>
                      <td className="p-4 font-bold text-slate-300 text-xs">PT. Mabrur Travel Umroh</td>
                      <td className="p-4">
                         <div className="flex flex-col items-center justify-center">
                           <ArrowRightLeft className="w-4 h-4 text-blue-500 mb-1" />
                           <span className="text-[9px] uppercase tracking-wider text-slate-500">Gabung Kloter</span>
                         </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400 text-xs">PT Al-Dawood Barokah Utama</td>
                      <td className="p-4">
                        <p className="text-xs font-bold text-slate-200">15 Jemaah</p>
                        <p className="text-[10px] text-slate-500">Izin Kemenhaj: SK.441/2026</p>
                      </td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-950/50 text-emerald-400 border border-emerald-900 rounded text-[10px] uppercase tracking-wider font-bold"><CheckCircle2 className="w-3 h-3 inline mr-1" /> Sah & Immutable</span></td>
                    </tr>
                    
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-4">
                        <p className="font-mono text-xs text-slate-400">2026-08-15 14:30:11</p>
                        <p className="font-mono text-[9px] text-slate-600 mt-1">tx: 0x11ab...f420</p>
                      </td>
                      <td className="p-4 font-bold text-slate-300 text-xs">PT. Surya Citra Madani</td>
                      <td className="p-4">
                         <div className="flex flex-col items-center justify-center">
                           <ArrowRightLeft className="w-4 h-4 text-rose-500 mb-1" />
                           <span className="text-[9px] uppercase tracking-wider text-rose-500">Jual Beli Ilegal</span>
                         </div>
                      </td>
                      <td className="p-4 font-bold text-rose-400 text-xs">PT. Hanania</td>
                      <td className="p-4">
                        <p className="text-xs font-bold text-slate-200">45 Jemaah</p>
                        <p className="text-[10px] text-rose-500 font-bold">Tanpa Surat Persetujuan</p>
                      </td>
                      <td className="p-4"><span className="px-2 py-1 bg-rose-950/50 text-rose-400 border border-rose-900 rounded text-[10px] uppercase tracking-wider font-bold"><AlertTriangle className="w-3 h-3 inline mr-1" /> Flagged EWS</span></td>
                    </tr>
                  </tbody>
                </table>
             </CardContent>
          </Card>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`bg-slate-900 border ${toastMessage.type === 'success' ? 'border-emerald-500/50' : toastMessage.type === 'error' ? 'border-rose-500/50' : 'border-amber-500/50'} shadow-2xl shadow-slate-950/50 rounded-lg p-4 max-w-sm flex items-start gap-3 relative`}>
            <button onClick={() => setToastMessage(null)} className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity">
              <XCircle className="w-4 h-4" />
            </button>
            <div className={`p-2 rounded-full mt-1 ${toastMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : toastMessage.type === 'error' || toastMessage.type === 'aduan' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : toastMessage.type === 'error' || toastMessage.type === 'aduan' ? <ShieldAlert className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">{toastMessage.title}</h4>
              <p className="text-xs text-slate-400 whitespace-pre-line">{toastMessage.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Kepatuhan */}
      {selectedKepatuhan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                Detail Kepatuhan & Riwayat Audit
              </h3>
              <button onClick={() => setSelectedKepatuhan(null)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
               <div className="mb-6">
                  <h4 className="text-xl font-bold text-slate-200 mb-1">{selectedKepatuhan.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {selectedKepatuhan.type || 'PPIU'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedKepatuhan.wilayahOperasional}</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Skor Audit Terakhir</p>
                     <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-slate-200">{selectedKepatuhan.skorAudit}</span>
                        <span className="text-slate-500 mb-1">/ 100</span>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Status Risiko</p>
                     <span className={`px-3 py-1 text-xs font-bold rounded border ${
                        selectedKepatuhan.tingkatPelanggaran === 'Rendah' ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' :
                        selectedKepatuhan.tingkatPelanggaran === 'Sedang' ? 'text-blue-400 bg-blue-950/40 border-blue-900/50' :
                        selectedKepatuhan.tingkatPelanggaran === 'Tinggi' ? 'text-amber-400 bg-amber-950/40 border-amber-900/50' :
                        'text-rose-400 bg-rose-950/40 border-rose-900/50'
                     }`}>
                       {selectedKepatuhan.tingkatPelanggaran}
                     </span>
                  </div>
               </div>

               <div>
                 <h4 className="font-bold text-sm text-slate-300 mb-3 uppercase tracking-wider">Catatan Pelanggaran & Temuan</h4>
                 <div className="space-y-3">
                   {selectedKepatuhan.tingkatPelanggaran === 'Kritis' && (
                      <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-rose-200">Indikasi Gagal Berangkat (EWS Terpicu)</p>
                           <p className="text-xs text-rose-300/80 mt-1">Ditemukan lebih dari 50 jemaah yang melewati batas SLA keberangkatan (delay &gt; 3x24 jam). Direkomendasikan pembekuan sementara.</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: {new Date().toLocaleDateString('id-ID')}</p>
                         </div>
                      </div>
                   )}
                   {selectedKepatuhan.tingkatPelanggaran === 'Tinggi' && (
                      <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-amber-200">Pelanggaran Standar Pelayanan (SPM)</p>
                           <p className="text-xs text-amber-300/80 mt-1">Ditemukan penurunan kelas hotel sepihak tanpa pemberitahuan kepada jemaah pada paket keberangkatan bulan lalu.</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: 12 Hari Lalu</p>
                         </div>
                      </div>
                   )}
                   {(selectedKepatuhan.tingkatPelanggaran === 'Sedang' || selectedKepatuhan.tingkatPelanggaran === 'Rendah') && (
                      <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg flex items-start gap-3">
                         <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                         <div>
                           <p className="text-sm font-bold text-blue-200">Temuan Administratif Ringan</p>
                           <p className="text-xs text-blue-300/80 mt-1">Keterlambatan pelaporan data manifest jemaah ke dalam Siskopatuh (delay 1-2 hari dari ketentuan).</p>
                           <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: Bulan Lalu</p>
                         </div>
                      </div>
                   )}
                   
                   <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-start gap-3 opacity-70">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-sm font-bold text-slate-300">Audit Reguler Selesai</p>
                         <p className="text-xs text-slate-400 mt-1">Penyelenggara telah menyelesaikan audit tahunan dengan dokumen finansial tervalidasi.</p>
                         <p className="text-[10px] text-slate-500 mt-2 font-mono">Tercatat: 6 Bulan Lalu</p>
                       </div>
                   </div>
                 </div>
               </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex justify-end gap-3">
               <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => setSelectedKepatuhan(null)}>Tutup</Button>
               {(selectedKepatuhan.tingkatPelanggaran === 'Tinggi' || selectedKepatuhan.tingkatPelanggaran === 'Kritis') && (
                 <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold"><ShieldAlert className="w-4 h-4 mr-2"/> Beri Sanksi Pembekuan</Button>
               )}
            </div>
          </div>
        </div>
      )}


      {apiModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" /> Konfigurasi Kredensial API: {apiModal.instansi}
              </h3>
              <button onClick={() => setApiModal({show: false, instansi: '', type: 'consume'})} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {apiModal.type === 'consume' ? (
                <>
                  <div className="bg-blue-950/30 border border-blue-900/50 p-3 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-300">
                      Anda sedang mengatur kredensial yang diberikan oleh pihak eksternal (<strong>{apiModal.instansi}</strong>) agar server SISKOPATUH dapat menarik (consume) data dari server mereka.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Endpoint Base URL (G2G)</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" defaultValue={"https://api." + apiModal.instansi.toLowerCase().replace(/[^a-z]/g, '') + ".go.id/v1"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">Client ID / Username</label>
                        <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" defaultValue="siskopatuh_prod_client" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 mb-1.5 block">Status Koneksi</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none">
                          <option>Aktif (Production)</option>
                          <option>Sandbox (Testing)</option>
                          <option>Nonaktif</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 flex justify-between">
                        <span>Client Secret / API Key</span>
                        <span className="text-emerald-500 font-normal">Last updated: 2 hari lalu</span>
                      </label>
                      <input type="password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" defaultValue="***************************" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-amber-950/30 border border-amber-900/50 p-3 rounded-lg flex gap-3">
                    <Info className="w-5 h-5 text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-300">
                      Anda sedang membuat (generate) API Key untuk diberikan kepada tim IT <strong>{apiModal.instansi}</strong> agar sistem mereka dapat secara proaktif mengirim (push) data pelunasan jemaah ke server SISKOPATUH.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">Production API Key (Bearer Token)</label>
                      <div className="flex gap-2">
                        <input type="text" readOnly className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono select-all" defaultValue="sk_live_bps_9x8f7a6b5c4d3e2f1a0" />
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">Copy</Button>
                        <Button variant="outline" className="border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Revoke</Button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1.5">Kredensial ini memberi {apiModal.instansi} akses penuh ke endpoint <code>/api/v1/escrow/notify-payment</code></p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 mb-1.5 block">IP Whitelist (Security)</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 font-mono focus:border-emerald-500 focus:outline-none" placeholder="Contoh: 103.45.67.89, 114.56.78.90" defaultValue="103.144.22.11, 202.43.12.99" />
                      <p className="text-[10px] text-slate-500 mt-1.5">Wajib diisi! Server SISKOPATUH akan menolak request B2B jika IP Address pengirim tidak terdaftar di atas.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => setApiModal({show: false, instansi: '', type: 'consume'})}>
                Batal
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-blue-900/50 font-medium">
                  <RefreshCw className="w-4 h-4 mr-2" /> Ping Connection
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20">
                  Simpan Kredensial
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}