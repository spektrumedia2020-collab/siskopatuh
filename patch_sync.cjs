const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const targetSync = `  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {`;

const replacementSync = `  const handleSync = async () => {
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

    setTimeout(() => {`;

if (content.includes(targetSync)) {
  content = content.replace(targetSync, replacementSync);
  console.log("Patched handleSync");
} else {
  console.log("Could not find handleSync");
}

const targetReturn = `  return (
    <div className="space-y-6 max-w-6xl mx-auto">`;

const replacementReturn = `  // Computed Alerts
  const missingTicketPkgs = packages.filter(p => !p.buktiTiketPP);
  const unsyncedJemaahCount = seededJemaahsData.filter(j => !j.isSynced).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">`;

if (content.includes(targetReturn)) {
  content = content.replace(targetReturn, replacementReturn);
  console.log("Patched Return block");
} else {
  console.log("Could not find Return block");
}

fs.writeFileSync(dashboardPath, content, 'utf8');
