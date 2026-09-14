import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Login.tsx';
let content = readFileSync(file, 'utf-8');

const search = `        getDocs(collection(db, "direktori")).then(snap => {
          const list = snap.docs.map(doc => doc.data().name);
          if (list.length > 0) {
             setDirektoriList(list);
             if (!penyelenggaraName) setPenyelenggaraName(list[0]);
          }
        });`;

const insert = `        getDocs(collection(db, "direktori")).then(snap => {
          let list = snap.docs.map(doc => doc.data().name);
          if (!list.includes("Kemenhaj (Haji Reguler)")) {
             list.unshift("Kemenhaj (Haji Reguler)");
          }
          if (list.length > 0) {
             setDirektoriList(list);
             if (!penyelenggaraName) setPenyelenggaraName(list[0]);
          }
        });`;

content = content.replace(search, insert);

const search2 = `        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ name: doc.data().name, type: doc.data().type }));
          setAgenList(list);
        } else {`;

const insert2 = `        if (!snap.empty) {
          let list = snap.docs.map(doc => ({ name: doc.data().name, type: doc.data().type }));
          if (!list.find(a => a.name.includes("Kemenhaj"))) {
             list.unshift({ name: "Kemenhaj (Haji Reguler)", type: "Pemerintah (Haji Reguler)" });
          }
          setAgenList(list);
        } else {`;

content = content.replace(search2, insert2);

const search3 = `            { name: "PT. Surya Citra Madani", type: "PPIU (Umroh)" }
          ]);`;

const insert3 = `            { name: "PT. Surya Citra Madani", type: "PPIU (Umroh)" },
            { name: "Kemenhaj (Haji Reguler)", type: "Pemerintah (Haji Reguler)" }
          ]);`;

content = content.replace(search3, insert3);

writeFileSync(file, content);
console.log("Login updated to include Kemenhaj");
