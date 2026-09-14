const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetState = `const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: string} | null>(null);`;
const replacementState = `const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: string} | null>(null);
  const [mobileScans, setMobileScans] = useState<any[]>([]);`;

if (content.indexOf('mobileScans') === -1) {
  content = content.replace(targetState, replacementState);
}

const targetEffect = `    if (activeTab === 'ews') {
      const unsub = onSnapshot(collection(db, "packages"), async (snap) => {`;
const replacementEffect = `    if (activeTab === 'scanner') {
      const q = query(collection(db, "mobile_scans"), orderBy("timestamp", "desc"), limit(15));
      const unsub = onSnapshot(q, (snap) => {
        setMobileScans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
      return () => unsub();
    }
    
    if (activeTab === 'ews') {
      const unsub = onSnapshot(collection(db, "packages"), async (snap) => {`;

if (content.indexOf("if (activeTab === 'scanner')") === -1) {
  content = content.replace(targetEffect, replacementEffect);
}

const targetTableBody = `<tbody className="text-sm">
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-mono text-xs text-slate-400">08:14:22 WIB</td>
                        <td className="p-4 font-bold text-slate-300">Zahar Djalle</td>
                        <td className="p-4 text-slate-500 font-mono text-xs">3277013004710011</td>
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Match</span></td>
                      </tr>
                      <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                        <td className="p-4 font-mono text-xs text-slate-400">08:13:45 WIB</td>
                        <td className="p-4 font-bold text-slate-300">Fatimah Zahra</td>
                        <td className="p-4 text-slate-500 font-mono text-xs">3277013004710022</td>
                        <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Match</span></td>
                      </tr>
                    </tbody>`;

const replacementTableBody = `<tbody className="text-sm">
                      {mobileScans.length > 0 ? mobileScans.map((scan, i) => (
                        <tr key={scan.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/20 animate-in fade-in slide-in-from-top-2">
                          <td className="p-4 font-mono text-xs text-slate-400">
                            {scan.timestamp?.seconds ? new Date(scan.timestamp.seconds * 1000).toLocaleTimeString('id-ID') : new Date().toLocaleTimeString('id-ID')}
                          </td>
                          <td className="p-4 font-bold text-slate-300">
                            {scan.rawData?.includes(':') ? scan.rawData.split(':')[2] : (scan.rawData || 'Tidak Dikenal')}
                          </td>
                          <td className="p-4 text-slate-500 font-mono text-xs">
                             {scan.rawData?.includes(':') ? scan.rawData.split(':')[1] : (scan.rawData || '-')}
                          </td>
                          <td className="p-4"><span className="px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded text-xs flex items-center gap-1 w-max"><CheckCircle2 className="w-3 h-3"/> Match</span></td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Belum ada data pindaian hari ini dari aplikasi mobile.</td></tr>
                      )}
                    </tbody>`;

if (content.indexOf('mobileScans.length > 0') === -1) {
  content = content.replace(targetTableBody, replacementTableBody);
}

// Ensure orderBy and limit are imported
if (content.indexOf('orderBy') === -1) {
  content = content.replace(`import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";`, `import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, addDoc, orderBy, limit } from "firebase/firestore";`);
}

fs.writeFileSync(p, content, 'utf8');
console.log("Patched Admin Dashboard");
