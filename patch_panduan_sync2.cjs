const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/Panduan.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `// Force sync latest default data to Firestore so CMS starts with fresh updated data
    import("firebase/firestore").then(({ setDoc }) => {
      setDoc(doc(db, "app_settings", "panduan_content"), { sections: defaultSections }, { merge: true }).catch(console.error);
    });

    const unsub = onSnapshot(doc(db, "app_settings", "panduan_content"), (docSnap) => {`;

const replacement = `const unsub = onSnapshot(doc(db, "app_settings", "panduan_content"), (docSnap) => {
      if (!docSnap.exists() || !docSnap.data().sections || docSnap.data().sections.length < 3 || docSnap.data().sections[0].pages.length < 4) {
         // Data is old or missing, let's seed it with the new default data
         import("firebase/firestore").then(({ setDoc }) => {
            setDoc(doc(db, "app_settings", "panduan_content"), { sections: defaultSections }, { merge: true }).catch(console.error);
         });
      }
`;

if (content.indexOf('Force sync latest') !== -1) {
  content = content.replace(target, replacement);
  fs.writeFileSync(p, content, 'utf8');
  console.log("Fixed Panduan.tsx DB sync logic");
} else {
  console.log("Could not find the target to replace");
}
