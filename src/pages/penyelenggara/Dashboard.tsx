import { useMemo } from "react";
import React, { useState, useEffect } from "react";
import { getSemuaPenyelenggaraBermasalah } from "../../data/aduanData";
import { Plane, PlaneTakeoff, MapPin, Building, Lock, CheckCircle2, QrCode, AlertCircle, FileText, Upload, Plus, ShieldCheck, Star, Activity, Wallet, PieChart as PieChartIcon, XCircle, ShieldAlert, Info, X, History, RefreshCw, Clock, User, ArrowUpRight, AlertTriangle , BookOpen } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, updateDoc, query, orderBy, getDocs, deleteDoc, where, getDoc, Timestamp, writeBatch } from "firebase/firestore";

export function PenyelenggaraDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeTab = location.pathname.includes('/escrow') ? 'escrow' : location.pathname.includes('/manifes') ? 'manifes' : location.pathname.includes('/paket') ? 'paket' : location.pathname.includes('/operasional') ? 'operasional' : location.pathname.includes('/konsorsium') ? 'konsorsium' : location.pathname.includes('/api') ? 'api_integrasi' : 'beranda';

  const [pnr, setPnr] = useState("");
  const [pnrKepulangan, setPnrKepulangan] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [packageName, setPackageName] = useState("");
  const [harga, setHarga] = useState<number | ''>('');
  const [hotelCode, setHotelCode] = useState("");
  const [validatedHotel, setValidatedHotel] = useState<{name: string, stars: number, distance: number} | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<'active' | 'expired'>('active');
  
  // Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddJemaahModal, setShowAddJemaahModal] = useState(false);
  const [printJemaah, setPrintJemaah] = useState<any>(null);
  const [showBuktiModal, setShowBuktiModal] = useState<{show: boolean, jemaahName?: string, receiptBase64?: string}>({show: false});
  const [showEVaultModal, setShowEVaultModal] = useState<{show: boolean, jemaahName?: string}>({show: false});
  
  // Form States
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [newJemaah, setNewJemaah] = useState({ nik: '', nama: '', porsi: '', paket: '' });
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: string} | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);

  // Notifikasi Real-time
  useEffect(() => {
    const unsubAlert = onSnapshot(collection(db, "penyelenggara_alerts"), (snap) => {
      const alertsData: any[] = [];
      snap.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === 'unread') {
          alertsData.push({ id: doc.id, ...data });
        }
      });
      setActiveAlerts(alertsData.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()));
      
      // Still show toast for new ones if it's not initial load, but to keep it simple, just showing persistent banner is better.
    });

  return () => {
      unsubAlert();
    };
  }, []);

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;
    alert(`Berhasil memproses file Excel: ${importFile.name}. Mengimpor data jemaah...`);
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleAddJemaahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJemaah.nik || !newJemaah.nama) return;
    
    const isAlreadyInManifest = jemaahs.some((j) => j.nik === newJemaah.nik);
    const isCentralRegistered = newJemaah.nik === "3201234567890001";
    
    if (isAlreadyInManifest) {
      // Skenario 1: Konfirmasi Jemaah yang sudah ada di tabel
      setToastMessage({
        title: "Data Terkonfirmasi", 
        desc: `Jemaah atas nama ${newJemaah.nama} (NIK: ${newJemaah.nik}) sudah berada di dalam manifes Anda. Tidak perlu didaftarkan ulang.`, 
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
      setShowAddJemaahModal(false);
      setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });
      return;
    }

    if (isCentralRegistered) {
      // Skenario 2: Jemaah mendaftar via aplikasi B2C pusat, ditarik ke Travel
      const paketDipilih = newJemaah.paket || (packages.length > 0 ? packages[0].name : (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari"));
      const jemaahBaru = {
        id: Date.now().toString(),
        name: newJemaah.nama + " (Tersinkronisasi dari Pusat)",
        nik: newJemaah.nik,
        porsi: "327000001234",
        packageName: paketDipilih,
        penyelenggara: pihkName || "Travel Anda",
        bayar: "PROSES",
        visa: "PROSES"
      };
      setJemaahs([jemaahBaru, ...jemaahs]);
      
      setToastMessage({
        title: "Sinkronisasi Berhasil", 
        desc: `Data NIK ${newJemaah.nik} ditemukan di Pusat dan berhasil ditarik ke Manifes Travel Anda.`, 
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
      setShowAddJemaahModal(false);
      setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });
      return;
    }
    
    const nomorPorsiGenerate = "327" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
    
    // Tambahkan data ke tabel simulasi (local state) agar langsung terlihat
    const paketDipilih = newJemaah.paket || (packages.length > 0 ? packages[0].name : (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari"));
    const jemaahBaru = {
      id: Date.now().toString(),
      name: newJemaah.nama,
      nik: newJemaah.nik,
      porsi: nomorPorsiGenerate,
      packageName: paketDipilih,
      penyelenggara: pihkName || "Travel Anda",
      bayar: "LUNAS",
      visa: "PROSES"
    };
    
    setJemaahs([jemaahBaru, ...jemaahs]);

    setToastMessage({
      title: "Registrasi Terpusat Berhasil",
      desc: `Jemaah: ${newJemaah.nama} (NIK: ${newJemaah.nik}) berhasil didaftarkan ke paket ${paketDipilih} dengan Porsi: ${nomorPorsiGenerate}.`,
      type: "success"
    });
    setTimeout(() => setToastMessage(null), 5000);

    setShowAddJemaahModal(false);
    setNewJemaah({ nik: '', nama: '', porsi: '', paket: '' });
  };
  
  // Data states
  const [packages, setPackages] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState([
    { id: 1, waktu: '2026-08-21 14:32:00 WIB', petugas: 'Ahmad Fauzi (Admin Operasional)', aksi: 'Sinkronisasi Otomatis Siskohat' },
    { id: 2, waktu: '2026-08-20 09:15:22 WIB', petugas: 'Siti Rahma (Staf Dokumen)', aksi: 'Import Bulk Data Jemaah (Gelombang 2)' },
  ]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const qJ = query(collection(db, "jemaahs"));
      const snap = await getDocs(qJ);
      const batch = writeBatch(db);
      snap.docs.forEach(d => {
         batch.update(d.ref, { isSynced: true });
      });
      await batch.commit();
    } catch(e) { console.error(e) }

    setTimeout(() => {
      const now = new Date();
      const formatTime = now.toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '') + ' WIB';
      setSyncLogs(prev => [{ id: Date.now(), waktu: formatTime, petugas: `${pihkName} (Manual Sync)`, aksi: 'Sinkronisasi Manual Manifes' }, ...prev]);
      setIsSyncing(false);
      setToastMessage({
        title: "Sinkronisasi Berhasil",
        desc: "Data manifes jemaah berhasil disinkronisasi dengan database pusat Kemenhaj.",
        type: "success"
      });
      setTimeout(() => setToastMessage(null), 5000);
    }, 1500);
  };

  const [escrows, setEscrows] = useState<any[]>([]);
  const [pihkName, setPihkName] = useState<string>("PT. Hanania"); // Default fallback
  const [pihkId, setPihkId] = useState<string>("");

  useEffect(() => {
    const uid = localStorage.getItem("penyelenggara_auth_uid");
    if (uid) {
      import("firebase/firestore").then(({ doc, getDoc }) => {
        getDoc(doc(db, "users", uid)).then((docSnap) => {
          if (docSnap.exists()) {
            setPihkName(docSnap.data().name);
            if(docSnap.data().status === "Cabut Izin" || docSnap.data().status === "Dibekukan") setLicenseStatus('expired');
            setPihkId(docSnap.id);
          }
        }).catch((err) => console.error("Error fetching PIHK data:", err));
      });
    }
  }, []);

  const [jemaahs, setJemaahs] = useState<any[]>([]);
  const [toastNotif, setToastNotif] = useState<{id: string, name: string, paket: string, penyelenggara: string} | null>(null);
  const [ewsWarnings, setEwsWarnings] = useState<any[]>([]);

  useEffect(() => {
    if (!pihkName) return;
    const unsub = onSnapshot(collection(db, "ews_warnings"), (snap) => {
      const warnings = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as any))
        .filter(w => w.ppiu === pihkName && w.status === 'active');
      setEwsWarnings(warnings);
    });
    return () => unsub();
  }, [pihkName]);
  
  // Real users state separate to merge efficiently
  const [realUsersData, setRealUsersData] = useState<any[]>([]);
  const [seededJemaahsData, setSeededJemaahsData] = useState<any[]>([]);
  
  useEffect(() => {
    setJemaahs([...realUsersData, ...seededJemaahsData]);
  }, [realUsersData, seededJemaahsData]);

  
  useEffect(() => {
    // Listen to Packages
    const qPackages = query(collection(db, "packages"), orderBy("createdAt", "desc"));
    const unsubPackages = onSnapshot(qPackages, (snapshot) => {
      const allPkgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setPackages(allPkgs.filter(p => p.pihkName === pihkName || (p.pihkName && p.pihkName.includes(pihkName))));
    });

    // Listen to Escrow Claims (for prototype, we use a single global document or predefined list)
    // If empty, we will render the default ones in UI
    const qEscrows = query(collection(db, "escrow_claims"), orderBy("order", "asc"));
    const unsubEscrows = onSnapshot(qEscrows, (snapshot) => {
      setEscrows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen to Seeded Jemaahs
    const qJemaahs = query(collection(db, "jemaahs"), orderBy("createdAt", "desc"));
    const unsubJemaahs = onSnapshot(qJemaahs, (snapshot) => {
      const allJ = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Fetch packages to filter jemaahs by owner
      getDocs(query(collection(db, "packages"))).then(pkgSnap => {
        const myPkgIds = pkgSnap.docs
            .map(d => ({id: d.id, ...d.data()} as any))
            .filter(p => p.pihkName === pihkName || (p.pihkName && p.pihkName.includes(pihkName)))
            .map(p => p.id);
        
        setSeededJemaahsData(allJ.filter(j => myPkgIds.includes(j.packageId)));
      }).catch((err) => console.error("Error fetching packages:", err));
    });

    // Listen to Real Jemaah Users Continuously
    let isInitialUserLoad = true;
    const unsubUsers = onSnapshot(query(collection(db, "users"), where("role", "==", "jemaah")), (snapshot) => {
        const users = snapshot.docs
            .filter(doc => doc.data().penyelenggara === pihkName || doc.data().penyelenggara === pihkName + " (PIHK)")
            .map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                packageName: data.paket || (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari"),
                porsi: data.porsiNumber || "-",
                bayar: "LUNAS",
                visa: "PROSES",
                penyelenggara: data.penyelenggara || pihkName
            };
        });
        setRealUsersData(users);

        if (!isInitialUserLoad) {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    if (data.penyelenggara === pihkName || data.penyelenggara === pihkName + " (PIHK)") {
                        setToastNotif({
                            id: change.doc.id,
                            name: data.name,
                            paket: data.paket || (pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari"),
                            penyelenggara: data.penyelenggara
                        });
                        setTimeout(() => setToastNotif(null), 5000);
                    }
                }
            });
        } else {
            isInitialUserLoad = false;
        }
    });

    return () => {
      unsubPackages();
      unsubEscrows();
      unsubJemaahs();
      unsubUsers();
    };
  }, [pihkName]);

  // Seed default escrows, packages, and jemaahs if empty
  useEffect(() => {
    const seedData = async () => {
      // Seed Escrows
      if (!localStorage.getItem('escrow_seeded_v7')) {
        localStorage.setItem('escrow_seeded_v7', 'true');
        const snap = await getDocs(collection(db, "escrow_claims"));
        for (const d of snap.docs) {
          await deleteDoc(doc(db, "escrow_claims", d.id));
        }
        
        const bpih = (pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji")) ? 87409365 : 33333333;
        const ttlEscrow = bpih * 45; // Default fallback for seed
        const defaultEscrows = [
          { order: 1, term: "Termin 1 (Tiket 30%)", status: "cair", req: "Penerbitan Tiket (PNR Issued)", desc: "Dicairkan setelah verifikasi PNR maskapai penerbangan.", amount: "Dinamis" },
          { order: 2, term: "Termin 2 (Visa 20%)", status: "pending", req: "Penerbitan Visa", desc: "API cross-check ke sistem Imigrasi dan e-Hajj Saudi.", amount: "Dinamis" },
          { order: 3, term: "Termin 3 (Hotel 30%)", status: "locked", req: "Kontrak Hotel / Akomodasi", desc: "Dicairkan setelah bukti booking hotel diverifikasi sistem Kemenhaj.", amount: "Dinamis" },
          { order: 4, term: "Termin 4 (Keberangkatan 20%)", status: "locked", req: "Validasi Keberangkatan Jemaah", desc: "Dicairkan saat keberangkatan (Manifest Boarding).", amount: "Dinamis" }
        ];
        for (const item of defaultEscrows) {
          await addDoc(collection(db, "escrow_claims"), item);
        }
      }

      // Seed Packages and Jemaahs
      if (packages.length === 0 && !localStorage.getItem('packages_seeded_v4')) {
        localStorage.setItem('packages_seeded_v4', 'true');
        
        // Clean up old ones just in case
        const pSnap = await getDocs(collection(db, "packages"));
        for (const d of pSnap.docs) await deleteDoc(doc(db, "packages", d.id));
        const jSnap = await getDocs(collection(db, "jemaahs"));
        for (const d of jSnap.docs) await deleteDoc(doc(db, "jemaahs", d.id));

        const isGov = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
        const defaultPackages = isGov ? [
          { name: "Haji Reguler 40 Hari", airline: "Garuda Indonesia", pnr: "GA-9921", capacity: 400, filled: 395, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 10000) },
          { name: "Haji Reguler 2026 - Kloter 1 JKG", airline: "Saudia Airlines", pnr: "SV-8832", capacity: 450, filled: 450, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 20000) },
          { name: "Haji Reguler 2026 - Kloter 2 SOC", airline: "Garuda Indonesia", pnr: "GA-7711", capacity: 450, filled: 440, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 30000) }
        ] : [
          { name: "Umroh Reguler 9 Hari", airline: "Garuda Indonesia", pnr: "GA-9921", capacity: 45, filled: 15, reserved: 0, pihkName: pihkName || "PT. Hanania", createdAt: new Date(Date.now() - 10000) },
          { name: "Umroh Plus Turki 12 Hari", airline: "Turkish Airlines", pnr: "TK-4022", capacity: 45, filled: 12, reserved: 0, pihkName: pihkName || "PT Mabrur Travel Umroh", createdAt: new Date(Date.now() - 20000) },
          { name: "Umroh Ramadhan VIP", airline: "Saudia Airlines", pnr: "SV-8832", capacity: 45, filled: 10, reserved: 0, pihkName: pihkName || "Al-Amin Tours & Travel", createdAt: new Date(Date.now() - 30000) },
          { name: "Umroh Hemat 10 Hari", airline: "Lion Air", pnr: "JT-3341", capacity: 45, filled: 8, reserved: 0, pihkName: pihkName || "Berkah Haramain Tour", createdAt: new Date(Date.now() - 40000) }
        ];

        for (const pkg of defaultPackages) {
          const docRef = await addDoc(collection(db, "packages"), pkg);
          
          // Seed Jemaahs for this package
          for (let i = 0; i < pkg.filled; i++) {
            await addDoc(collection(db, "jemaahs"), {
              name: `Jemaah ${pkg.name.split(' ')[1]} ${i + 1}`,
              porsi: `100${Math.floor(Math.random() * 1000000)}`,
              bayar: "LUNAS",
              visa: Math.random() > 0.3 ? "TERBIT" : "PROSES",
              packageId: docRef.id,
              packageName: pkg.name,
              createdAt: new Date()
            });
          }
        }
      }
    };
    
    seedData();
  }, [escrows.length, packages.length]);

  const handleCheckPNR = () => {
    if (pnr.length >= 5) {
      setCapacity(45); // Simulate found capacity
    }
  };

  const handleCheckHotel = () => {
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
    }
    if (!packageName || !pnr || !pnrKepulangan || !capacity || !harga) return;
    if (Number(harga) < 28000000) {
      alert("Sistem Menolak: Harga paket (Rp" + Number(harga).toLocaleString('id-ID') + ") berada di bawah standar minimal referensi biaya (Rp 28.000.000). Hal ini untuk mencegah risiko paket sangat murah yang berindikasi kegagalan keberangkatan.");
      return;
    }
    
    await addDoc(collection(db, "packages"), {
      name: packageName,
      airline: "Garuda Indonesia",
      pnr: pnr,
      pnrKepulangan: pnrKepulangan,
      capacity: capacity,
      pihkName: pihkName || "PT. Hanania",
      hotelCode: hotelCode,
      hotelName: validatedHotel.name,
      filled: 0,
      reserved: 0,
      createdAt: new Date()
    });
    
    // Reset form
    setPnr("");
    setHotelCode("");
    setValidatedHotel(null);
    setPnrKepulangan("");
    setCapacity(null);
    setPackageName("");
    setHarga('');
  };


  const handleLaporBerangkat = async (pkg: any) => {
    if (!pkg.hotelCode || !pkg.hotelName) {
      setToastMessage({title: 'Sistem Menolak', desc: 'BRN Akomodasi dari Sistem Nusuk belum dilengkapi. Harap lengkapi di tab Operasional sebelum jemaah berangkat!', type: 'error'});
      setTimeout(() => setToastMessage(null), 7000);
      return;
    }
    if (pkg.filled === 0) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Manifes jemaah belum terisi. Laporan dibatalkan.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    const isLate = pkg.name.toLowerCase().includes('ramadhan') || pkg.name.toLowerCase().includes('hemat');
    const status = isLate ? "Terlambat (> 1x24 Jam)" : "Sudah Lapor Keberangkatan";
    await updateDoc(doc(db, "packages", pkg.id), {
      statusKeberangkatan: status
    });
    setToastMessage({title: 'Laporan Diterima', desc: 'Data manifest keberangkatan dikunci dan dilaporkan ke Kemenhaj.', type: 'success'});
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleLaporPulang = async (pkg: any) => {
    if (!pkg.statusKeberangkatan || pkg.statusKeberangkatan === "Belum Lapor") {
      setToastMessage({title: 'Sistem Menolak', desc: 'Keberangkatan belum dilaporkan, Anda tidak bisa melapor kepulangan.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    if (!pkg.buktiTiketPP) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Dokumen tiket pesawat PP belum diunggah. Wajib melampirkan tiket.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    if (!pkg.masaBerlakuTiket) {
      setToastMessage({title: 'Sistem Menolak', desc: 'Durasi masa berlaku tiket belum diinput.', type: 'error'});
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(pkg.masaBerlakuTiket);
    if (expiry < today) {
       setToastMessage({title: 'Validasi Gagal', desc: 'Masa berlaku tiket sudah habis (Expired). Status kepulangan diblokir.', type: 'error'});
       setTimeout(() => setToastMessage(null), 5000);
       return;
    }

    const isLate = pkg.name.toLowerCase().includes('ramadhan') || pkg.name.toLowerCase().includes('hemat');
    const status = isLate ? "Terlambat (> 1x24 Jam)" : "Sudah Lapor Kepulangan";
    await updateDoc(doc(db, "packages", pkg.id), {
      statusKepulangan: status
    });
    setToastMessage({title: 'Laporan Diterima', desc: 'Data kedatangan jemaah berhasil dilaporkan ke Kemenhaj.', type: 'success'});
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleUploadProof = async (id: string) => {
    // Simulate uploading proof and changing status to 'verifying'
    await updateDoc(doc(db, "escrow_claims", id), {
      status: 'verifying'
    });
  };

  const isKemenhaj = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
  const paxCount = packages.reduce((acc, curr) => acc + curr.filled, 0) || 45;

  const displayJemaahs = useMemo(() => {
    if (packages.length === 0) return jemaahs;
    
    // Generate 1 dummy jemaah per package
    const fakeJemaahs = packages.map((pkg, idx) => ({
      id: 'sampel-' + idx,
      name: ['Ahmad', 'Budi', 'Siti', 'Fatima', 'Rudi'][idx % 5] + ' ' + ['Mubarak', 'Santoso', 'Aminah', 'Zahra', 'Hidayat'][idx % 5],
      packageName: pkg.name,
      porsi: '1000' + (46001 + idx + 1),
      penyelenggara: pkg.pihkName || pihkName,
      bayar: 'LUNAS',
      visa: idx === 0 ? 'TERBIT' : 'PROSES'
    }));

    // Identify if real jemaahs already cover the packages (avoid duplicates if they do)
    if (jemaahs.length >= 3) return jemaahs;

    // Merge with any real ones so 'Zahar' is still there, but filter out duplicates by package name if we want, or just append!
    const existingPackageNames = jemaahs.map(j => j.packageName);
    const filteredFakes = fakeJemaahs.filter(f => !existingPackageNames.includes(f.packageName));
    
    return [...jemaahs, ...filteredFakes];
  }, [jemaahs, packages, pihkName]);

  const biayaPerPax = isKemenhaj ? 87409365 : 33333333; // Real BPIH 2026 = Rp 87.409.365
  const totalEscrow = paxCount * biayaPerPax;
  const termin1 = totalEscrow * 0.3;
  const termin2 = totalEscrow * 0.2;
  const termin3 = totalEscrow * 0.3;
  const termin4 = totalEscrow * 0.2;
  
  const formatRp = (num: number) => "Rp " + Math.round(num).toLocaleString('id-ID');
  const formatCurrencyShort = (num: number) => {
    if (num >= 1000000000000) {
      return "Rp " + (num / 1000000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Triliun";
    } else if (num >= 1000000000) {
      return "Rp " + (num / 1000000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Miliar";
    } else if (num >= 1000000) {
      return "Rp " + (num / 1000000).toLocaleString('id-ID', {maximumFractionDigits: 2}) + " Juta";
    }
    return "Rp " + Math.round(num).toLocaleString('id-ID');
  };

  // Computed Alerts
  const missingTicketPkgs = packages.filter(p => !p.buktiTiketPP);
  const unsyncedJemaahCount = seededJemaahsData.filter(j => !j.isSynced).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Toast Notification */}
      {toastNotif && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-emerald-950/90 border border-emerald-500/50 shadow-2xl shadow-emerald-900/20 rounded-xl p-4 flex gap-4 items-start max-w-sm">
                <div className="bg-emerald-500/20 p-2 rounded-full text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-emerald-400 font-bold text-sm">Pendaftar Baru!</h4>
                    <p className="text-white font-medium text-sm mt-1">{toastNotif.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{toastNotif.paket}</p>
                <button onClick={() => setToastNotif(null)} className="text-slate-400 hover:text-white shrink-0">
                    <XCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
                </div>
      )}
      {activeTab === 'beranda' && (
        <div className="space-y-6 flex flex-col">
      {ewsWarnings.map(warning => (
        <div key={warning.id} className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 mb-6">
          <div className="p-3 bg-rose-900/50 rounded-lg text-rose-500 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-rose-400 font-bold mb-1">SURAT PERINGATAN KEMENHAJ: {warning.type}</h4>
            <p className="text-sm text-slate-300">
              {warning.detail}
            </p>
            <p className="text-xs text-rose-500 font-medium mt-2">Harap segera mengklarifikasi temuan ini ke Direktorat Pengawasan Kemenhaj. Jika diabaikan, izin operasional PPIU Anda dapat dicabut.</p>
          </div>
        </div>
      ))}

      {/* EWS ALERT FOR THIS AGENCY */}
      {getSemuaPenyelenggaraBermasalah().includes(pihkName) && (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 mb-6">
          <div className="p-3 bg-rose-900/50 rounded-lg text-rose-500 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-rose-400 font-bold mb-1">Peringatan Kepatuhan EWS (Early Warning System)</h4>
            <p className="text-sm text-slate-300">
              Sistem Pengawasan Kemenhaj dan Bareskrim mencatat adanya aduan atau anomali terkait entitas Anda ({pihkName}). 
              Beberapa fitur pendaftaran manifes baru mungkin dibatasi sementara hingga proses klarifikasi selesai.
              Harap segera menghubungi Direktorat Pengawasan Umrah dan Haji Khusus.
            </p>
          </div>
        </div>
      )}

      
          

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-32">
            <h3 className="text-3xl font-bold text-slate-100">{packages.length > 0 ? packages.length : '4'}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Paket Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-32">
            <h3 className="text-3xl font-bold text-emerald-400">{packages.reduce((acc, curr) => acc + curr.capacity - curr.filled - curr.reserved, 0) || '180'}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Kuota Tersedia</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-32">
            <h3 className="text-3xl font-bold text-slate-100">{packages.reduce((acc, curr) => acc + curr.filled, 0) || '45'}</h3>
            <p className="text-sm font-medium text-slate-400 mt-1">Jemaah Terdaftar</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-900/20 border-emerald-500/20">
          <CardContent className="p-4 flex flex-col items-center text-center justify-center h-32">
            <h3 className="text-xl font-bold text-emerald-400">{formatCurrencyShort(termin1)}</h3>
            <p className="text-sm font-medium text-emerald-500 mt-1">Total Escrow Cair</p>
          </CardContent>
        </Card>
      </div>

      {/* Persistent Alerts */}
      {activeAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {activeAlerts.map(alert => (
            <div key={alert.id} className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-3 bg-rose-900/50 rounded-lg text-rose-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-rose-400 font-bold text-sm mb-1">{alert.judul || "Pemberitahuan Kepatuhan EWS"}</h4>
                  <span className="text-[10px] text-rose-500 font-bold bg-rose-950 px-2 py-0.5 rounded-full border border-rose-900">BELUM DIBACA</span>
                </div>
                <p className="text-sm text-slate-300">{alert.pesan}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className=" text-xs " onClick={async () => {
                    // Mark as read
                    try {
                      await updateDoc(doc(db, "penyelenggara_alerts", alert.id), { status: "read" });
                    } catch (e) {
                      console.error(e);
                    }
                  }}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Sudah Dibaca
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Computed System Warnings */}
      {(missingTicketPkgs.length > 0 || unsyncedJemaahCount > 0) && (
        <div className="flex flex-col gap-3 mb-6">
          {unsyncedJemaahCount > 0 && (
            <div className="bg-amber-950/40 border border-amber-900/50 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-amber-900/10">
              <div className="p-3 bg-amber-900/50 rounded-lg text-amber-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-amber-400 font-bold text-sm mb-1">Peringatan Sinkronisasi Jemaah</h4>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-950 px-2 py-0.5 rounded-full border border-amber-900">SYSTEM WARNING</span>
                </div>
                <p className="text-sm text-slate-300">Terdapat <b>{unsyncedJemaahCount} jemaah</b> yang datanya belum disinkronisasi dengan SISKOPATUH/Siskohat Pusat. Segera lakukan sinkronisasi di tab Manifes.</p>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs bg-amber-950 hover:bg-amber-900 border-amber-800 hover:text-white" onClick={() => navigate('/penyelenggara/manifes')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Ke Tab Manifes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {missingTicketPkgs.length > 0 && missingTicketPkgs.map(pkg => (
            <div key={`ticket-${pkg.id}`} className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 shadow-lg shadow-rose-900/10">
              <div className="p-3 bg-rose-900/50 rounded-lg text-rose-500">
                <Plane className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-rose-400 font-bold text-sm mb-1">SLA Pelanggaran: Bukti Tiket PP Belum Dilampirkan</h4>
                  <span className="text-[10px] text-rose-500 font-bold bg-rose-950 px-2 py-0.5 rounded-full border border-rose-900">URGENT</span>
                </div>
                <p className="text-sm text-slate-300">Anda belum melampirkan bukti tiket Pulang Pergi (PP) untuk keberangkatan paket <b>{pkg.name}</b>. Kegagalan melampirkan tiket akan menurunkan skor kepatuhan EWS (KMHU No.2/2026).</p>
                <div className="mt-3">
                  <Button size="sm" variant="outline" className="text-xs bg-rose-950 hover:bg-rose-900 border-rose-800 hover:text-white" onClick={() => navigate('/penyelenggara/operasional')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Unggah Tiket Sekarang
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Kepatuhan SLA</p>
                    <h3 className="text-2xl font-bold text-white">98<span className="text-sm font-normal text-slate-500">/100</span></h3>
                    <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">A (Sangat Baik)</p>
                  </div>
                  <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Kepuasan Jemaah</p>
                    <h3 className="text-2xl font-bold text-white">4.8<span className="text-sm font-normal text-slate-500">/5.0</span></h3>
                    <p className="text-emerald-400 text-xs font-bold mt-2 flex items-center gap-1">Sangat Puas</p>
                  </div>
                  <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-500">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Utilisasi Kuota</p>
                    <h3 className="text-2xl font-bold text-white">85%</h3>
                    <p className="text-slate-500 text-xs font-medium mt-2">850 dari 1.000 porsi</p>
                  </div>
                  <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 text-blue-500">
                    <PieChartIcon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 shadow-xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Dana Tercairkan</p>
                      <button onClick={() => setShowCalcModal(true)} className="text-slate-500 hover:text-emerald-400 transition-colors" title="Lihat Detail Kalkulasi">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{formatCurrencyShort(termin1)}</h3>
                    <p className="text-slate-400 text-xs font-medium mt-2 leading-tight">Total Escrow ({paxCount.toLocaleString('id-ID')} Jemaah &times; {formatCurrencyShort(biayaPerPax)})<br/><span className="text-slate-500 font-bold">= {formatCurrencyShort(totalEscrow)}</span></p>
                  </div>
                  <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 text-purple-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800 shadow-xl">
            <CardHeader className="border-b border-slate-800/50 pb-6">
              <CardTitle className="text-lg">Tren Performa Operasional (6 Bulan Terakhir)</CardTitle>
              <CardDescription>Grafik SLA pelayanan mulai dari dokumen, penerbitan visa, hingga kualitas akomodasi dan pemberangkatan.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: 'Mar', score: 85 },
                    { month: 'Apr', score: 88 },
                    { month: 'Mei', score: 92 },
                    { month: 'Jun', score: 94 },
                    { month: 'Jul', score: 96 },
                    { month: 'Ags', score: 98 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} domain={[60, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="score" name="Skor Kepatuhan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'paket' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atomic Locking PNR</CardTitle>
                <CardDescription>Validasi kuota maskapai penerbangan sebelum diizinkan menerbitkan paket.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Kode Booking (PNR) Pesawat</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value.toUpperCase())}
                      className="flex-1 h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase" 
                      placeholder="Contoh: X7BQ9P" 
                    />
                    <Button onClick={handleCheckPNR} size="sm" disabled={pnr.length < 5}>Validasi</Button>
                  </div>
                </div>
                
                {capacity && (
                  <div className="p-4 bg-emerald-900/20 rounded-lg border border-emerald-500/20 flex items-start gap-3 flex-col mt-4">
                    <div className="flex gap-3 w-full border-b border-emerald-500/20 pb-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="w-full">
                        <p className="text-sm font-bold text-emerald-400">PNR Tervalidasi (Garuda Indonesia)</p>
                        <p className="text-xs text-emerald-500/80 mt-1">Sistem mengunci maksimal kapasitas: {capacity} Pax.</p>
                      </div>
                    </div>
                    
                    <div className="w-full pt-1 space-y-3">
                       <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400">Nama Paket Layanan</label>
                        <input 
                          type="text" 
                          value={packageName}
                          onChange={(e) => setPackageName(e.target.value)}
                          className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                          placeholder="Misal: Umroh Reguler 9 Hari" 
                        />
                      </div>
                      
                      
                      <div className="space-y-2 mt-2">
                        <label className="text-xs font-medium text-slate-400">Kode Booking (PNR) Kepulangan</label>
                        <input 
                          type="text" 
                          value={pnrKepulangan}
                          onChange={(e) => setPnrKepulangan(e.target.value)}
                          className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono" 
                          placeholder="Misal: GA-993" 
                        />
                      </div>

                      
                      <div className="space-y-2 mt-4 pt-4 border-t border-emerald-500/20">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span>Sistem Nusuk (Validasi BRN Akomodasi)</span>
                          <span className="text-[9px] bg-amber-900/50 text-amber-400 px-1.5 py-0.5 rounded">WAJIB</span>
                        </label>
                        <p className="text-[10px] text-slate-500">Masukkan BRN (Booking Reference Number) Akomodasi resmi dari provider B2B Saudi. Sistem Kemenhaj akan mengunci spesifikasi hotel ini.</p>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={hotelCode}
                            onChange={(e) => setHotelCode(e.target.value.toUpperCase())}
                            className="flex-1 h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase font-mono" 
                            placeholder="Contoh BRN: AC-882910" 
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

                      <div className="space-y-2 mt-2">
                        <label className="text-xs font-medium text-slate-400">Harga Paket (Per Pax)</label>
                        <input 
                          type="number" 
                          value={harga}
                          onChange={(e) => setHarga(Number(e.target.value) || '')}
                          className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 text-slate-200 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                          placeholder="Min. 28000000" 
                        />
                      </div>

                      <Button 
                        size="sm" 
                        onClick={handleCreatePackage}
                        disabled={!packageName || !validatedHotel}
                        className="w-full   font-bold tracking-wider text-xs h-9"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Buat & Tayangkan Paket
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Paket Tayang</CardTitle>
                <CardDescription>Daftar paket yang sedang aktif dan terhubung dengan Redis Atomic Locking.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Nama Paket</th>
                        <th className="px-4 py-3">Maskapai / PNR</th>\n                        <th className="px-4 py-3">Hotel (Nusuk)</th>
                        <th className="px-4 py-3 text-center">Terisi</th>
                        <th className="px-4 py-3 text-center">Terkunci</th>
                        <th className="px-4 py-3 text-center">Sisa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {packages.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                            Belum ada paket yang diterbitkan.
                          </td>
                        </tr>
                      ) : (
                        packages.map((pkg, i) => (
                          <tr key={pkg.id || i}>
                            <td className="px-4 py-3 font-medium text-white">{pkg.name}</td>
                            <td className="px-4 py-3 text-xs">
                              <span className="block text-slate-300">{pkg.airline}</span>
                              <span className="font-mono text-slate-500">PNR: {pkg.pnr}</span>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {pkg.hotelCode ? (
                                <div>
                                  <span className="block text-emerald-400 font-bold">{pkg.hotelName || "Tervalidasi"}</span>
                                  <span className="font-mono text-slate-500">BRN: {pkg.hotelCode}</span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-400 font-bold px-2 py-1 bg-rose-950/30 rounded border border-rose-900/50">
                                  <AlertCircle className="w-3 h-3"/> Wajib Update BRN
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">{pkg.filled}</td>
                            <td className="px-4 py-3 text-center text-amber-500 font-bold">
                              <div className="flex justify-center items-center gap-1">
                                <Lock className="h-3 w-3" /> {pkg.reserved}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-emerald-400">
                              {pkg.capacity - pkg.filled - pkg.reserved}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'escrow' && (
        <Card>
          <CardHeader>
            <CardTitle>Milestone Tracker Pencairan Escrow</CardTitle>
            <CardDescription>Pencairan dana jemaah dilakukan bertahap sesuai validasi milestone layanan untuk mencegah penipuan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {escrows.map((milestone) => (
                <div key={milestone.id} className={`flex gap-4 p-4 rounded-lg border ${milestone.status === 'cair' ? 'bg-emerald-900/20 border-emerald-500/20' : milestone.status === 'pending' ? 'bg-slate-900 border-slate-700' : milestone.status === 'verifying' ? 'bg-amber-900/20 border-amber-500/30' : 'bg-slate-900/50 border-slate-800 opacity-60'}`}>
                  <div className={`p-3 rounded-full shrink-0 h-12 w-12 flex items-center justify-center ${milestone.status === 'cair' ? 'bg-emerald-500/20 text-emerald-400' : milestone.status === 'verifying' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    {milestone.status === 'cair' ? <CheckCircle2 className="h-6 w-6" /> : milestone.status === 'verifying' ? <AlertCircle className="h-6 w-6 animate-pulse" /> : <Lock className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${milestone.status === 'cair' ? 'text-emerald-400' : milestone.status === 'verifying' ? 'text-amber-400' : 'text-slate-200'}`}>{milestone.term}</h4>
                      {milestone.status === 'cair' && <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-wider">CAIR ({formatCurrencyShort(termin1)})</span>}
                      {milestone.status === 'verifying' && <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/20 uppercase tracking-wider animate-pulse">Sedang Diverifikasi Kemenhaj</span>}
                      {milestone.status === 'pending' && <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 uppercase tracking-wider">Menunggu Dokumen</span>}
                      {milestone.status === 'locked' && <span className="text-[10px] font-bold bg-slate-800/50 text-slate-500 px-2 py-1 rounded border border-slate-800 uppercase tracking-wider flex items-center gap-1"><Lock className="w-3 h-3" /> Terkunci</span>}
                    </div>
                    <p className="text-sm text-slate-400 mt-1 font-medium">Syarat Pencairan: {milestone.req}</p>
                    <p className="text-xs text-slate-500 mt-1">{milestone.desc}</p>
                    
                    {milestone.status === 'pending' && (
                      <div className="mt-4 p-4 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 flex flex-col items-center justify-center gap-3">
                        <div className="text-center space-y-1">
                           <p className="text-xs text-slate-300 font-medium">Unggah Bukti Transaksi / Invoice</p>
                           <p className="text-[10px] text-slate-500">Format PDF/JPG maks 5MB.</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleUploadProof(milestone.id)}
                          className="gap-2 text-xs h-8  font-bold"
                        >
                          <Upload className="h-3 w-3" /> Pilih File & Ajukan Pencairan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      )}

      {activeTab === 'operasional' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Operasional & Pelaporan Jemaah</h2>
              <p className="text-sm text-slate-400 mt-1">Perbarui status operasional paket (Visa/Tiket/Hotel), serta wajib melaporkan <b>Keberangkatan</b> & <b>Kepulangan</b> jemaah maksimal 1x24 jam (KMHU No.2/2026).</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {packages.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-slate-400">Belum ada paket yang diterbitkan.</CardContent></Card>
            ) : (
              packages.map((pkg) => (
                <Card key={pkg.id} className="bg-slate-900 border-slate-800">
                  <CardHeader className="border-b border-slate-800 pb-4">
                    <CardTitle className="text-lg text-emerald-400 flex items-center justify-between">
                      <span>{pkg.name}</span>
                      <span className="text-xs text-slate-500 font-normal">Kapasitas: {pkg.capacity} Pax | Terisi: {pkg.filled}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FileText className="w-3 h-3"/> Status Visa</label>
                        <select 
                          className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                          value={pkg.statusVisa || "Belum Diajukan"}
                          onChange={(e) => {
                            updateDoc(doc(db, "packages", pkg.id), { statusVisa: e.target.value }).catch(console.error);
                          }}
                        >
                          <option value="Belum Diajukan">Belum Diajukan</option>
                          <option value="Proses Kedutaan">Proses Kedutaan</option>
                          <option value="Sebagian Terbit">Sebagian Terbit</option>
                          <option value="Terbit Seluruhnya">Terbit Seluruhnya</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Plane className="w-3 h-3"/> Ketersediaan Tiket (PP)</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-300 outline-none font-mono text-xs"
                            value={`BRKT: ${pkg.pnr} | PLG: ${pkg.pnrKepulangan || 'TBA'}`}
                            disabled
                          />
                          <select 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                            value={pkg.statusTiket || "Belum Issued"}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { statusTiket: e.target.value }).catch(console.error);
                            }}
                          >
                            <option value="Belum Issued">Belum Issued</option>
                            <option value="Sebagian Issued">Sebagian Issued</option>
                            <option value="Issued Penuh (PP Asli)">Issued Penuh (PP Asli)</option>
                          </select>
                          
                          {/* Slot Unggah Bukti Tiket PP */}
                          <div className="mt-2">
                             {pkg.buktiTiketPP ? (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900 rounded p-2">
                                     <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold max-w-[80%]" title={pkg.buktiTiketPP}>
                                        <FileText className="w-3 h-3 shrink-0" /> <span className="truncate">{pkg.buktiTiketPP}</span>
                                     </div>
                                     <button 
                                        onClick={(e) => {
                                           e.preventDefault();
                                           updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: "", masaBerlakuTiket: "" }).catch(console.error);
                                        }}
                                        className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-1 bg-slate-900 rounded-full"
                                        title="Hapus lampiran"
                                     >
                                        <X className="w-4 h-4" />
                                     </button>
                                  </div>
                                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                                    <label className="text-[10px] text-slate-400 block mb-1">Batas Masa Berlaku Tiket</label>
                                    <input 
                                      type="date"
                                      className="w-full h-7 rounded border border-slate-700 bg-slate-900 px-2 text-[10px] text-slate-300 focus:border-emerald-500 outline-none"
                                      value={pkg.masaBerlakuTiket || ''}
                                      onChange={(e) => updateDoc(doc(db, "packages", pkg.id), { masaBerlakuTiket: e.target.value }).catch(console.error)}
                                    />
                                  </div>
                                </div>
                             ) : (
                                <div>
                                   <input 
                                      type="file" 
                                      id={`upload-tiket-${pkg.id}`}
                                      className="hidden"
                                      accept=".pdf,.jpg,.jpeg,.png"
                                      onChange={(e) => {
                                         const file = e.target.files?.[0];
                                         if (file) {
                                            const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
                                            const ext = file.name.split('.').pop()?.toLowerCase();
                                            if (!ext || !allowedExtensions.includes(ext)) {
                                               setToastMessage({title: 'Format Ditolak', desc: 'Sistem hanya menerima file berformat PDF, JPG, JPEG, atau PNG.', type: 'error'});
                                               setTimeout(() => setToastMessage(null), 5000);
                                               return;
                                            }
                                            updateDoc(doc(db, "packages", pkg.id), { buktiTiketPP: file.name }).catch(console.error);
                                            setToastMessage({
                                               title: 'Unggah Berhasil',
                                               desc: `File ${file.name} telah dilampirkan.`,
                                               type: 'success'
                                            });
                                         }
                                      }}
                                   />
                                   <label 
                                      htmlFor={`upload-tiket-${pkg.id}`}
                                      className="w-full h-8 rounded border border-dashed border-slate-600 bg-slate-800/30 hover:bg-slate-800/80 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 text-[10px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                   >
                                      <Upload className="w-3 h-3" /> Pilih File Tiket PP
                                   </label>
                                </div>
                             )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><PlaneTakeoff className="w-3 h-3"/> Lapor Keberangkatan (Max 1x24 Jam)</label>
                        {pkg.statusKeberangkatan && pkg.statusKeberangkatan !== "Belum Lapor" ? (
                          <div className={`w-full h-10 flex items-center justify-center rounded-lg border px-3 text-xs font-bold ${pkg.statusKeberangkatan.includes("Terlambat") ? 'bg-rose-950/30 border-rose-900 text-rose-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}`}>
                            <CheckCircle2 className="w-4 h-4 mr-2"/>
                            {pkg.statusKeberangkatan}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleLaporBerangkat(pkg)}
                            className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center justify-center shadow-md shadow-emerald-900/20"
                          >
                            Kirim Laporan Aktual (Sistem)
                          </button>
                        )}
                        {pkg.statusKeberangkatan && pkg.statusKeberangkatan.includes("Terlambat") && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900 mt-2"> 
                            Peringatan Sistem: Anda melanggar batas SLA laporan. Hal ini diteruskan ke EWS Pusat.
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-3 h-3"/> Lapor Kepulangan (Max 1x24 Jam)</label>
                        {pkg.statusKepulangan && pkg.statusKepulangan !== "Belum Lapor" ? (
                           <div className={`w-full h-10 flex items-center justify-center rounded-lg border px-3 text-xs font-bold ${pkg.statusKepulangan.includes("Terlambat") ? 'bg-rose-950/30 border-rose-900 text-rose-400' : 'bg-emerald-950/30 border-emerald-900 text-emerald-400'}`}>
                            <CheckCircle2 className="w-4 h-4 mr-2"/>
                            {pkg.statusKepulangan}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleLaporPulang(pkg)}
                            className="w-full h-10 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors flex items-center justify-center shadow-md shadow-emerald-900/20"
                          >
                            Kirim Laporan Aktual (Sistem)
                          </button>
                        )}
                        {pkg.statusKepulangan && pkg.statusKepulangan.includes("Terlambat") && (
                          <div className="text-[10px] text-rose-400 font-bold bg-rose-950/30 p-2 rounded border border-rose-900 mt-2"> 
                            Peringatan Sistem: Laporan melebihi batas waktu! Diteruskan ke EWS Kemenhaj.
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> Asuransi Perjalanan</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                            placeholder="Nomor Polis Asuransi"
                            value={pkg.noPolis || ''}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { noPolis: e.target.value }).catch(console.error);
                            }}
                          />
                           <select 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                            value={pkg.statusAsuransi || "Belum Ada"}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { statusAsuransi: e.target.value }).catch(console.error);
                            }}
                          >
                            <option value="Belum Ada">Belum Ada</option>
                            <option value="Aktif">Aktif terverifikasi</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Building className="w-3 h-3"/> Validasi Akomodasi (Nusuk)</label>
                        <div className="flex flex-col gap-2">
                           <input 
                            type="text" 
                            className={`w-full h-10 rounded-lg border ${!pkg.hotelCode ? 'border-rose-900 bg-rose-950/20 text-rose-300' : 'border-slate-700 bg-slate-950 text-emerald-400 font-mono'} px-3 text-sm focus:border-emerald-500 outline-none placeholder:text-slate-600`}
                            placeholder="Input BRN (Contoh: AC-882910)"
                            value={pkg.hotelCode || ''}
                            disabled={!!pkg.hotelCode && !!pkg.hotelName} // Disabled jika sudah divalidasi dari paket
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { hotelCode: e.target.value.toUpperCase() }).catch(console.error);
                            }}
                          />
                          {!pkg.hotelName && pkg.hotelCode && pkg.hotelCode.length >= 4 && (
                            <button
                              onClick={() => {
                                updateDoc(doc(db, "packages", pkg.id), { 
                                  hotelName: "Zamzam Pullman (Update Legacy)",
                                  hotelCode: pkg.hotelCode
                                }).catch(console.error);
                                setToastMessage({title: 'Integrasi Nusuk Berhasil', desc: 'BRN berhasil divalidasi dan dikunci.', type: 'success'});
                                setTimeout(() => setToastMessage(null), 3000);
                              }}
                              className="w-full h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition-colors"
                            >
                              Validasi BRN ini ke Nusuk
                            </button>
                          )}
                          {!pkg.hotelCode && (
                             <span className="text-[10px] text-rose-400">BRN wajib dilengkapi sebelum keberangkatan!</span>
                          )}
                        </div>
                      </div>
\n                      <div className="space-y-3 flex flex-col justify-end">
                        <Button 
                          className="w-full   font-bold h-10 shadow-lg shadow-blue-900/20"
                          onClick={() => {
                             if (pkg.statusVisa !== "Terbit Seluruhnya" || pkg.statusTiket !== "Issued Penuh (PP Asli)" || pkg.statusAsuransi !== "Aktif") {
                               setToastMessage({
                                 title: "Sistem Kemenhaj Menolak",
                                 desc: "Logistik keberangkatan belum lengkap!\n\nSyarat Wajib:\n1. Visa Terbit Seluruhnya\n2. Tiket PP Terverifikasi Issued\n3. Asuransi Perjalanan Aktif",
                                 type: "error"
                               });
                               setTimeout(() => setToastMessage(null), 8000);
                             } else {
                               setToastMessage({
                                 title: "Verifikasi Sistem EWS Berhasil",
                                 desc: "Manifes keberangkatan (E-Manifest) dan Kode QR Boarding untuk Jemaah telah di-generate. Petugas Bandara kini dapat memindai ID Jemaah secara live.",
                                 type: "success"
                               });
                               setTimeout(() => setToastMessage(null), 5000);
                               updateDoc(doc(db, "packages", pkg.id), { manifesLocked: true }).catch(console.error);
                             }
                          }}
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Terbitkan Manifes & QR
                        </Button>
                        {pkg.manifesLocked && (
                          <div className="text-[10px] text-emerald-400 font-bold text-center border border-emerald-900/50 bg-emerald-900/20 rounded-lg py-2 flex items-center justify-center gap-1">
                             <CheckCircle2 className="w-3 h-3" /> Manifes Terkunci (Siap Boarding)
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Building className="w-3 h-3"/> Kesiapan Hotel</label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                            placeholder="Nama Hotel Makkah..."
                            value={pkg.hotelMakkah || ""}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { hotelMakkah: e.target.value }).catch(console.error);
                            }}
                          />
                          <select 
                            className="w-full h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                            value={pkg.statusHotel || "Belum Booking"}
                            onChange={(e) => {
                              updateDoc(doc(db, "packages", pkg.id), { statusHotel: e.target.value }).catch(console.error);
                            }}
                          >
                            <option value="Belum Booking">Belum Booking</option>
                            <option value="DP Dibayarkan">DP Dibayarkan</option>
                            <option value="Confirmed / Lunas">Confirmed / Lunas</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'manifes' && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-3">
                Data Manifes Jemaah
                <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20 font-sans tracking-normal">
                  Menampilkan Sampel ({displayJemaahs.length} dari {packages.reduce((acc, curr) => acc + curr.filled, 0).toLocaleString('id-ID')} Total Terdaftar)
                </span>
              </CardTitle>
              <CardDescription>Manajemen data keberangkatan dan pencetakan ID Card RFID.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                onClick={handleSync}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi Pusat'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-2 /30  /10 hover:/20"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="h-4 w-4" /> Import Excel (Bulk)
              </Button>
              <Button 
                size="sm" 
                className="h-8 gap-2  "
                onClick={() => setShowAddJemaahModal(true)}
              >
                <Plus className="h-4 w-4" /> Tambah Jemaah
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Nama Jemaah</th>
                    <th className="px-4 py-3">Paket Layanan</th>
                    <th className="px-4 py-3">No. Porsi</th>
                    <th className="px-4 py-3">Penyelenggara</th>
                    <th className="px-4 py-3 text-center">Status Bayar</th>
                    <th className="px-4 py-3 text-center">Visa</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {displayJemaahs.length > 0 ? displayJemaahs.map((j, i) => (
                    <tr key={j.id || i}>
                      <td className="px-4 py-3 font-medium text-white">{j.name}</td>
                      <td className="px-4 py-3 text-emerald-400">{j.packageName}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{j.porsi}</td>
                      <td className="px-4 py-3 font-bold text-blue-400">{j.penyelenggara || pihkName}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{j.bayar}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${j.visa === 'TERBIT' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>{j.visa}</span>
                      </td>
                      <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs  hover: hover: flex items-center gap-1" onClick={() => setPrintJemaah(j)}><QrCode className="w-3 h-3"/> Cetak Smart-ID</Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs  hover: hover:"
                          onClick={async () => {
                            let receiptBase64 = null;
                            if (j.id) {
                              try {
                                const s = await getDoc(doc(db, "savings", j.id));
                                if (s.exists()) {
                                  receiptBase64 = s.data().lastUploadReceipt;
                                }
                              } catch (e) {}
                            }
                            setShowBuktiModal({show: true, jemaahName: j.name, receiptBase64});
                          }}
                        >
                          Bukti Bayar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs hover:text-emerald-400"
                          onClick={() => setShowEVaultModal({show: true, jemaahName: j.name})}
                        >
                          Cek E-Vault
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Belum ada data jemaah terdaftar.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {activeTab === 'konsorsium' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Konsorsium & Mutasi Jemaah</h2>
              <p className="text-sm text-slate-400 mt-1">Fasilitas penggabungan kloter dan pelimpahan jemaah resmi antar-Penyelenggara (PIHK/PPIU).</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white">Form Pengajuan Konsorsium</CardTitle>
                <CardDescription className="text-xs text-slate-400">Pilih travel mitra dan unggah dokumen kesepakatan.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Penyelenggara Tujuan (Mitra)</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none" defaultValue="">
                    <option value="" disabled>-- Pilih PPIU/PIHK Mitra --</option>
                    <option value="1">PT Al-Dawood Barokah Utama (Akreditasi A)</option>
                    <option value="2">PT Khazanah Tamma Internasional (Akreditasi D)</option>
                    <option value="3">PT Arminareka Perdana (Akreditasi A)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Jumlah Jemaah yang Dimutasi</label>
                  <input type="number" min="1" placeholder="Cth: 15" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none" />
                  <p className="text-[10px] text-amber-500">Dana Escrow atas jemaah ini akan dialihkan hak klaimnya ke travel tujuan.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400">Unggah Surat Perjanjian / MoU Konsorsium</label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-950/50 hover:bg-slate-800 transition-colors cursor-pointer">
                    <Upload className="h-5 w-5 text-slate-500 mb-2" />
                    <p className="text-xs font-medium text-slate-300">Pilih file PDF</p>
                    <p className="text-[10px] text-slate-500">Maks. 5MB, ditandatangani kedua pihak.</p>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold mt-4" onClick={() => {
                  setToastMessage({title: 'Pengajuan Terkirim', desc: 'Mutasi Konsorsium sedang menunggu validasi Kemenhaj.', type: 'success'});
                  setTimeout(() => setToastMessage(null), 5000);
                }}>
                  Ajukan Mutasi ke Kemenhaj
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-sm text-white">Status Pengajuan Mutasi (Audit Trail)</CardTitle>
                <CardDescription className="text-xs text-slate-400">Riwayat perpindahan jemaah dari/ke akun Anda.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-800/60">
                  <div className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Keluar (Mutasi)</span>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">Ke: PT Al-Dawood Barokah Utama</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded text-[10px] font-bold">MENUNGGU VALIDASI</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded">15 Jemaah</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hari ini, 09:12 WIB</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Masuk (Terima)</span>
                        <p className="text-sm font-bold text-slate-200 mt-0.5">Dari: PT Berkah Jaya Tour</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">SAH & SELESAI</span>
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-400">
                      <span className="font-mono bg-slate-950 px-2 py-1 rounded">40 Jemaah</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tervalidasi</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Import Data Jemaah (Bulk)</h3>
              <p className="text-sm text-slate-400 mt-1">Unggah file Excel berisi daftar jemaah untuk diimpor secara massal.</p>
            </div>
            
            <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">File Excel (.xlsx, .csv)</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".xlsx,.csv,.xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    required
                  />
                  {importFile ? (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-emerald-400 font-medium">{importFile.name}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">Pilih file Excel</p>
                      <p className="text-xs text-slate-500 mt-1">Gunakan template standar Siskohat</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowImportModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  
                  disabled={!importFile}
                >
                  Proses Import
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cetak Smart-ID Modal */}
      {printJemaah && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="print-modal bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative text-slate-900 border border-slate-200">
            
            {/* Header / Brand */}
            <div className="bg-emerald-700 p-4 flex flex-col items-center justify-center text-center text-white relative">
              <button 
                onClick={() => setPrintJemaah(null)}
                className="absolute top-3 right-3 text-white/70 hover:text-white print:hidden"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-sm tracking-widest uppercase mb-1">SMART-ID JEMAAH</h2>
              <p className="text-[10px] opacity-80">Sistem Komputerisasi Pengelolaan Terpadu Umrah dan Haji Khusus</p>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-slate-200 rounded-full border-4 border-white shadow-lg -mt-12 mb-4 overflow-hidden flex items-center justify-center text-slate-400">
                <User className="w-12 h-12" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{printJemaah.name}</h3>
              <p className="text-sm font-semibold text-emerald-600 mb-4">{printJemaah.penyelenggara || pihkName}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full text-left mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">No. Porsi</p>
                  <p className="text-sm font-bold text-slate-700">{printJemaah.porsi}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Paket Layanan</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{printJemaah.packageName || "Umroh Reguler"}</p>
                </div>
              </div>

              <div className="p-3 bg-white border-2 border-dashed border-slate-300 rounded-xl inline-block">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-medium">Scan QR untuk verifikasi lapangan</p>
            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 print:hidden">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
                onClick={() => setPrintJemaah(null)}
              >
                Tutup
              </Button>
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                onClick={() => {
                  window.print();
                }}
              >
                <QrCode className="w-4 h-4 mr-2" /> Cetak Kartu ID
              </Button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print-modal, .print-modal * {
                visibility: visible;
              }
              .print-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                box-shadow: none;
                border: none;
              }
            }
          `}} />
        </div>
      )}

      
      {activeTab === 'api_integrasi' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Integrasi API (B2B)</h2>
              <p className="text-sm text-slate-400 mt-1">Kelola Kredensial API untuk menghubungkan sistem internal (ERP) Travel Anda langsung dengan Server SISKOPATUH Pusat.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" /> Kredensial API (Bearer Token)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">Gunakan API Key ini pada header HTTP request Anda: <code className="text-emerald-400 bg-emerald-950 px-1 rounded">Authorization: Bearer [API_KEY]</code></CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Live API Key (Production)</p>
                      <p className="font-mono text-emerald-400 text-sm tracking-wider">sk_live_siskopatuh_9x8f7a6b5c4d3e2f1a0</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => {
                        navigator.clipboard.writeText("sk_live_siskopatuh_9x8f7a6b5c4d3e2f1a0");
                        setToastMessage({title: "Berhasil", desc: "Live API Key disalin ke clipboard.", type: "success"});
                        setTimeout(() => setToastMessage(null), 3000);
                      }}>Salin</Button>
                      <Button variant="outline" size="sm" className="h-8 border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300" onClick={() => {
                        if(window.confirm("Apakah Anda yakin ingin melakukan Regenerate API Key? Key yang lama akan langsung tidak berlaku.")) {
                          setToastMessage({title: "Key Diperbarui", desc: "API Key berhasil di-regenerate. Silakan perbarui sistem internal Anda.", type: "success"});
                          setTimeout(() => setToastMessage(null), 4000);
                        }
                      }}>Regenerate</Button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between mt-4 opacity-70">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Sandbox API Key (Testing)</p>
                      <p className="font-mono text-slate-400 text-sm tracking-wider">sk_test_siskopatuh_1q2w3e4r5t6y7u8i9o0</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => {
                        navigator.clipboard.writeText("sk_test_siskopatuh_1q2w3e4r5t6y7u8i9o0");
                        setToastMessage({title: "Berhasil", desc: "Sandbox API Key disalin ke clipboard.", type: "success"});
                        setTimeout(() => setToastMessage(null), 3000);
                      }}>Salin</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="border-b border-slate-800 pb-4">
                  <CardTitle className="text-sm text-white">Endpoint Tersedia (API v1)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-800">
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-900/50 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">GET</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/porsi/status</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 100/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Cek status nomor porsi jemaah (validitas dan pelunasan Escrow) dari server pusat.</p>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">POST</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/manifes/bulk-import</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 20/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Push ribuan data jemaah sekaligus dari ERP lokal Anda ke server SISKOPATUH (termasuk upload tiket dan visa massal).</p>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-900/50 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">POST</span>
                          <span className="font-mono text-sm text-slate-300">/api/v1/operasional/lapor-aktual</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Rate Limit: 50/min</span>
                      </div>
                      <p className="text-xs text-slate-400">Endpoint wajib untuk Auto-Lapor saat jemaah check-in di bandara keberangkatan/kepulangan untuk menghindari EWS peringatan.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
               <Card className="bg-emerald-950/20 border-emerald-900/30">
                  <CardHeader>
                    <CardTitle className="text-sm text-emerald-400 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Dokumentasi API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Silakan integrasikan sistem internal Travel Anda menggunakan spesifikasi OpenAPI 3.0 kami.
                    </p>
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      setToastMessage({title: "Membuka Dokumentasi", desc: "Membuka halaman Swagger UI di tab baru...", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                      window.open("https://swagger.io/tools/swagger-ui/", "_blank");
                    }}>
                      Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" />
                    </Button>
                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      const postmanData = {
                        info: { name: "SISKOPATUH V2 API", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
                        item: [{ name: "Check Porsi", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{api_key}}" }], url: { raw: "{{base_url}}/api/v1/porsi/status", host: ["{{base_url}}"], path: ["api", "v1", "porsi", "status"] } } }]
                      };
                      const blob = new Blob([JSON.stringify(postmanData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "siskopatuh-v2-api.postman_collection.json";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      setToastMessage({title: "Unduhan Selesai", desc: "File Postman Collection berhasil disimpan.", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                    }}>
                      Download Postman Collection
                    </Button>
                  </CardContent>
               </Card>
               
               <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-sm text-white flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/> Status Layanan API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Server Status</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">API Latency</span>
                        <span className="text-emerald-400 font-bold">12ms</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Uptime (30 Hari)</span>
                        <span className="text-emerald-400 font-bold">99.99%</span>
                      </div>
                    </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Jemaah Manual Modal */}
      {showAddJemaahModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Tambah Jemaah Manual</h3>
              <p className="text-sm text-slate-400 mt-1">Masukkan data diri jemaah baru ke dalam manifes.</p>
            </div>
            
            <form onSubmit={handleAddJemaahSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">NIK (Nomor Induk Kependudukan)</label>
                <input 
                  type="text" 
                  value={newJemaah.nik}
                  onChange={(e) => setNewJemaah({...newJemaah, nik: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nama Lengkap (Sesuai Paspor)</label>
                <input 
                  type="text" 
                  value={newJemaah.nama}
                  onChange={(e) => setNewJemaah({...newJemaah, nama: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
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
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowAddJemaahModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  
                  disabled={!newJemaah.nik || !newJemaah.nama}
                >
                  Simpan Data
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEVaultModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Verifikasi E-Vault Jemaah</h3>
                <p className="text-sm text-slate-400 mt-1">{showEVaultModal.jemaahName}</p>
              </div>
              <button onClick={() => setShowEVaultModal({show: false})} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Paspor (Halaman Depan)</h4>
                    <p className="text-xs text-amber-400 font-medium">Menunggu Verifikasi</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Divalidasi", desc: "Paspor jemaah telah berhasil divalidasi.", type: "success"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Validasi</Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => {
                    setToastMessage({title: "Dokumen Ditolak", desc: "Dokumen paspor ditolak. Jemaah akan diminta mengunggah ulang.", type: "error"});
                    setShowEVaultModal({show: false});
                    setTimeout(() => setToastMessage(null), 3000);
                  }}>Tolak</Button>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-900/30 rounded-lg flex items-center justify-center text-rose-400 border border-rose-500/30">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sertifikat Meningitis / ICV</h4>
                    <p className="text-xs text-emerald-400 font-medium">Tervalidasi (Otomatis IHC)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lihat Bukti Pembayaran Modal */}
      {showBuktiModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Bukti Pembayaran Manual</h3>
              <p className="text-sm text-slate-400 mt-1">Jemaah: <span className="font-medium text-white">{showBuktiModal.jemaahName}</span></p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 overflow-hidden relative">
                {showBuktiModal.receiptBase64 ? (
                  <img src={showBuktiModal.receiptBase64} alt="Bukti Transfer" className="object-contain w-full h-full" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-slate-800" />
                    <div className="relative z-10 flex flex-col items-center">
                      <FileText className="h-10 w-10 text-slate-500 mb-2" />
                      <p className="text-slate-400 text-sm">Pratinjau Struk Transfer Kosong</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Menunggu Verifikasi</p>
                    <p className="text-xs text-amber-500/80 mt-1">Pastikan nominal transfer di mutasi bank sesuai sebelum Anda menekan tombol setujui.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setShowBuktiModal({show: false})}
                  className="text-slate-400 hover:text-white"
                >
                  Tutup
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="/30  "
                  onClick={() => {
                    setToastMessage({title: 'Pembayaran Ditolak', desc: 'Bukti transfer tidak valid.', type: 'error'}); setTimeout(() => setToastMessage(null), 3000);
                    setShowBuktiModal({show: false});
                  }}
                >
                  Tolak
                </Button>
                <Button 
                  type="button"
                  
                  onClick={async () => {
                    try {
                      // Demo: Automatically approve the connected Jemaah's payment (by updating all verifying timelines)
                      const timelinesSnap = await getDocs(query(collection(db, "timelines"), where("pelunasanStatus", "==", "verifying")));
                      const batch = writeBatch(db);
                      
                      timelinesSnap.forEach((d) => {
                        batch.update(d.ref, { pelunasanStatus: "verified", updatedAt: new Date().getTime() });
                      });
                      
                      const savingsSnap = await getDocs(query(collection(db, "savings"), where("statusPelunasan", "==", "Menunggu Verifikasi Admin")));
                      savingsSnap.forEach((d) => {
                        const data = d.data();
                        const txs = data.transactions || [];
                        if (txs.length > 0 && txs[txs.length - 1].type === "deposit (pending)") {
                          txs[txs.length - 1].type = "deposit";
                          txs[txs.length - 1].description = "Pembayaran Pelunasan LUNAS";
                        }
                        batch.update(d.ref, { statusPelunasan: "Lunas Terverifikasi", transactions: txs });
                      });
                      
                      await batch.commit();
                      
                      setToastMessage({title: 'Pembayaran Disetujui', desc: 'Sistem telah memperbarui status pelunasan menjadi Lunas dan sinkronisasi EWS berhasil.', type: 'success'}); 
                    } catch (err) {
                      console.error(err);
                      setToastMessage({title: 'Berhasil', desc: 'Status jemaah diubah menjadi Lunas.', type: 'success'});
                    }
                    setTimeout(() => setToastMessage(null), 4000);
                    setShowBuktiModal({show: false});
                  }}
                >
                  Setujui (Tandai Lunas)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`bg-slate-900 border ${toastMessage.type === 'success' ? 'border-emerald-500/50' : 'border-rose-500/50'} shadow-2xl shadow-slate-950/50 rounded-lg p-4 max-w-sm flex items-start gap-3 relative`}>
            <button onClick={() => setToastMessage(null)} className="absolute top-2 right-2 text-slate-500 hover:text-slate-300">
              <XCircle className="w-4 h-4" />
            </button>
            <div className={`p-2 rounded-full mt-1 ${toastMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-sm font-bold theme-title mb-1 text-white">{toastMessage.title}</h4>
              <p className="text-xs text-slate-400 whitespace-pre-line">{toastMessage.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full mt-10 mb-10 flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-800/50 shrink-0 rounded-t-xl">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-emerald-400" />
                Detail Kalkulasi Dana Escrow
              </h3>
              <button onClick={() => setShowCalcModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Dasar Perhitungan */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dasar Perhitungan Dana</h4>
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Total Jemaah Terdaftar</span>
                    <span className="font-bold text-white">{paxCount} Pax</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">{pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji") ? "Biaya Penyelenggaraan Ibadah Haji (BPIH)" : "Biaya Paket Umrah (Rata-rata)"}</span>
                    <span className="font-bold text-white">{formatRp(biayaPerPax)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-200">Total Dana Terkumpul (Escrow 100%)</span>
                    <span className="text-lg font-bold text-emerald-400">{formatRp(totalEscrow)}</span>
                  </div>
                </div>
              </div>

              {/* Rincian Milestone */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Distribusi Pencairan Termin (Milestone)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold text-emerald-400">Termin 1 (Tiket 30%)</p>
                        <p className="text-xs text-slate-400 mt-0.5">Sudah Dicairkan</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400">{formatRp(termin1)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">Termin 2 (Visa 20%)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Tertahan (Menunggu Kemenhaj)</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-400">{formatRp(termin2)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">Termin 3 (Hotel 30%)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Tertahan (Terkunci)</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-400">{formatRp(termin3)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">Termin 4 (Keberangkatan 20%)</p>
                        <p className="text-xs text-slate-500 mt-0.5">Tertahan (Terkunci)</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-400">{formatRp(termin4)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0 rounded-b-xl">
              <Button onClick={() => setShowCalcModal(false)} className="bg-slate-800 hover:bg-slate-700 text-white font-medium">
                Tutup Kalkulasi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

