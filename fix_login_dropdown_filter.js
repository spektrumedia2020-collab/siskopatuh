import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Login.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Fix fetchAgen to store objects
const fetchSearch = `const list = snap.docs.map(doc => doc.data().name);
          setAgenList(list);
        } else {
          setAgenList([
            "PT. Khazanah Tamma Internasional",
            "PT. Mabrur Travel Umroh",
            "PT. Hanania",
            "PT. Masy'aril Haram Tour",
            "PT. Cahaya Raudhah",
            "PT. Surya Citra Madani"
          ]);
        }`;

const fetchReplace = `const list = snap.docs.map(doc => ({ name: doc.data().name, type: doc.data().type }));
          setAgenList(list);
        } else {
          setAgenList([
            { name: "PT. Khazanah Tamma Internasional", type: "PIHK (Haji Khusus)" },
            { name: "PT. Mabrur Travel Umroh", type: "PPIU (Umroh)" },
            { name: "PT. Hanania", type: "PIHK (Haji Khusus)" },
            { name: "PT. Masy'aril Haram Tour", type: "PIHK (Haji Khusus)" },
            { name: "PT. Cahaya Raudhah", type: "PPIU (Umroh)" },
            { name: "PT. Surya Citra Madani", type: "PPIU (Umroh)" }
          ]);
        }`;

content = content.replace(fetchSearch, fetchReplace);

// 2. Fix the dropdown rendering
const dropdownSearch = `<option value="" disabled>Pilih Travel...</option>
                        {agenList.map((agen, idx) => (
                           <option key={idx} value={agen}>{agen}</option>
                        ))}`;

const dropdownReplace = `<option value="" disabled>Pilih Travel...</option>
                        {agenList
                           .filter(agen => {
                               if (jemaahJenis === "Haji Khusus") return agen.type?.includes("PIHK");
                               if (jemaahJenis === "Umrah") return agen.type?.includes("PPIU") || agen.type?.includes("PIHK");
                               return true;
                           })
                           .map((agen, idx) => (
                             <option key={idx} value={agen.name}>{agen.name}</option>
                        ))}`;

content = content.replace(dropdownSearch, dropdownReplace);

writeFileSync(file, content);
console.log("Dropdown filter applied!");
