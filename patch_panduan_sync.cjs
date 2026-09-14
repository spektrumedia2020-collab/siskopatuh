const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/Panduan.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `const unsub = onSnapshot(doc(db, "app_settings", "panduan_content"), (docSnap) => {`;
const replacement = `// Force sync latest default data to Firestore so CMS starts with fresh updated data
    import("firebase/firestore").then(({ setDoc }) => {
      setDoc(doc(db, "app_settings", "panduan_content"), { sections: defaultSections }, { merge: true }).catch(console.error);
    });

    const unsub = onSnapshot(doc(db, "app_settings", "panduan_content"), (docSnap) => {`;

if (content.indexOf(target) !== -1 && content.indexOf('Force sync latest') === -1) {
  content = content.replace(target, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Patched Panduan.tsx to sync DB");
} else {
  console.log("Not patched. Target missing or already patched.");
}
