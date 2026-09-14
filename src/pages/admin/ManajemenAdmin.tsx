import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp, onSnapshot, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShieldCheck, UserPlus, Trash2, Edit, Save, X, Search, FileDown, Activity, UserCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { recordAdminLog } from "@/lib/log";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Admin {
  id: string;
  name: string;
  nip: string;
  role: string;
  status: string;
}

interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: any;
}

export function ManajemenAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [filterLog, setFilterLog] = useState<'harian' | 'mingguan' | 'bulanan'>('harian');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formName, setFormName] = useState("");
  const [formNip, setFormNip] = useState("");
  const [formRole, setFormRole] = useState("General Admin");

  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);


  useEffect(() => {
    // Fetch Admins
    const qAdmins = query(collection(db, "admins"));
    const unsubAdmins = onSnapshot(qAdmins, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Admin));
      setAdmins(data);
    });

    return () => unsubAdmins();
  }, []);

  useEffect(() => {
    // Calculate time filter
    const now = new Date();
    let pastDate = new Date();
    if (filterLog === 'harian') {
      pastDate.setDate(now.getDate() - 1);
    } else if (filterLog === 'mingguan') {
      pastDate.setDate(now.getDate() - 7);
    } else if (filterLog === 'bulanan') {
      pastDate.setMonth(now.getMonth() - 1);
    }

    const qLogs = query(
      collection(db, "admin_logs"),
      where("timestamp", ">=", pastDate),
      orderBy("timestamp", "desc")
    );

    const unsubLogs = onSnapshot(qLogs, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminLog));
      setLogs(data);
    });

    return () => unsubLogs();
  }, [filterLog]);

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formNip) return;

    try {
      if (isEditing) {
        const ref = doc(db, "admins", currentId);
        await updateDoc(ref, {
          name: formName,
          nip: formNip,
          role: formRole
        });
        recordAdminLog(`Memperbarui data admin: ${formName} (${formRole})`);
        setToastMessage({ title: "Admin berhasil diperbarui", type: "success" });
      } else {
        await addDoc(collection(db, "admins"), {
          name: formName,
          nip: formNip,
          role: formRole,
          status: "Aktif",
          createdAt: serverTimestamp()
        });
        recordAdminLog(`Menambahkan admin baru: ${formName} (${formRole})`);
        setToastMessage({ title: "Admin baru berhasil ditambahkan", type: "success" });
      }
      
      resetForm();
    } catch (error) {
      console.error(error);
      setToastMessage({ title: "Terjadi kesalahan", type: "error" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus admin ${name}?`)) return;
    try {
      await deleteDoc(doc(db, "admins", id));
      recordAdminLog(`Menghapus admin: ${name}`);
      setToastMessage({ title: "Admin berhasil dihapus", type: "success" });
    } catch (error) {
      setToastMessage({ title: "Gagal menghapus admin", type: "error" });
    }
  };

  const handleEdit = (admin: Admin) => {
    setIsEditing(true);
    setCurrentId(admin.id);
    setFormName(admin.name);
    setFormNip(admin.nip);
    setFormRole(admin.role);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId("");
    setFormName("");
    setFormNip("");
    setFormRole("General Admin");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Laporan Log Kegiatan Admin (${filterLog.toUpperCase()})`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 28);

    const tableColumn = ["Waktu", "Nama Admin", "Aktivitas"];
    const tableRows: any[] = [];

    logs.forEach(log => {
      const dateStr = log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('id-ID') : 'Baru saja';
      const rowData = [
        dateStr,
        log.adminName,
        log.action
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [4, 120, 87] }
    });

    doc.save(`Log_Admin_${filterLog}_${new Date().getTime()}.pdf`);
    recordAdminLog(`Mencetak Laporan Log Kegiatan (${filterLog}) ke PDF`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 pb-24 sm:p-6">
      {toastMessage && (
        <div className={`p-4 rounded-xl shadow-lg border text-sm font-bold flex justify-between items-center ${toastMessage.type === 'success' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-900' : 'bg-rose-900/50 text-rose-400 border-rose-900'}`}>
          {toastMessage.title}
          <Button onClick={() => setToastMessage(null)}><X className="w-4 h-4" /></Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black theme-title tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 theme-primary-text" />
            Manajemen Admin
          </h1>
          <p className="text-sm text-white/50 mt-1">Area khusus Super Admin untuk mengatur akses dan memantau kegiatan log General Admin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Form & Daftar Admin */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="theme-card border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold theme-title flex items-center gap-2">
                <UserPlus className="w-4 h-4 theme-primary-text" /> 
                {isEditing ? "Edit Administrator" : "Tambah Administrator Baru"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveAdmin} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Nama Lengkap</label>
                    <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm focus:outline-none focus:border-[var(--theme-primary)] text-white" placeholder="Contoh: Budi Santoso" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">NIP / ID Kredensial</label>
                    <input type="text" required value={formNip} onChange={e => setFormNip(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-black/20 px-3 text-sm focus:outline-none focus:border-[var(--theme-primary)] text-white font-mono" placeholder="1982030..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Peran (Role)</label>
                  <select value={formRole} onChange={e => setFormRole(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-slate-900 px-3 text-sm focus:outline-none focus:border-[var(--theme-primary)] text-white">
                    <option value="General Admin">General Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 text-white/70 hover:bg-white/10">Batal</Button>
                  )}
                  <Button type="submit" className=" hover:opacity-90">
                    <Save className="w-4 h-4 mr-2" /> {isEditing ? "Simpan Perubahan" : "Simpan Admin"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="theme-card border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-bold theme-title flex items-center gap-2">
                <UserCircle className="w-4 h-4 theme-primary-text" /> 
                Daftar Administrator Aktif
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20">
                      <th className="p-4 text-[10px] font-bold text-white/50 uppercase tracking-wider">Nama & NIP</th>
                      <th className="p-4 text-[10px] font-bold text-white/50 uppercase tracking-wider">Role</th>
                      <th className="p-4 text-[10px] font-bold text-white/50 uppercase tracking-wider">Status</th>
                      <th className="p-4 text-[10px] font-bold text-white/50 uppercase tracking-wider text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-sm text-white/50">Belum ada data admin</td></tr>
                    ) : (
                      admins.map(admin => (
                        <tr key={admin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-bold theme-title">{admin.name}</p>
                            <p className="text-xs text-white/50 font-mono">{admin.nip}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${admin.role === 'Super Admin' ? 'bg-amber-900/40 text-amber-400 border border-amber-900/50' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-900/50'}`}>
                              {admin.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {admin.status || 'Aktif'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button size="icon" variant="secondary" onClick={() => handleEdit(admin)} className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {admin.role !== 'Super Admin' && (
                              <Button size="icon" variant="destructive" onClick={() => handleDelete(admin.id, admin.name)} className="h-8 w-8">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
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

        {/* Kolom Kanan: Log Aktivitas */}
        <div className="space-y-6">
          <Card className="theme-card flex min-h-[320px] flex-col border-white/10 lg:h-[calc(100vh-180px)]">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold theme-title flex items-center gap-2">
                  <Activity className="w-4 h-4 theme-primary-text" /> 
                  Log Kegiatan
                </CardTitle>
                <Button size="icon" onClick={exportPDF} className="h-8 w-8  hover:opacity-90" title="Cetak PDF">
                  <FileDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-1 mt-4 p-1 bg-black/20 rounded-lg border border-white/10">
                <Button onClick={() => setFilterLog('harian')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${filterLog === 'harian' ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Harian</Button>
                <Button onClick={() => setFilterLog('mingguan')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${filterLog === 'mingguan' ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Mingguan</Button>
                <Button onClick={() => setFilterLog('bulanan')} className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-colors ${filterLog === 'bulanan' ? 'theme-primary-bg shadow-sm' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>Bulanan</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-y-auto space-y-4">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-xs">Belum ada log kegiatan.</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="relative pl-4 border-l-2 border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="absolute w-2 h-2 rounded-full theme-primary-bg -left-[5px] top-1"></div>
                    <p className="text-[10px] text-white/40 mb-1">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString('id-ID') : 'Baru saja'}</p>
                    <p className="text-xs font-bold theme-title">{log.adminName}</p>
                    <p className="text-xs text-white/70 mt-1">{log.action}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
