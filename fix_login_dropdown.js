import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Login.tsx';
let content = readFileSync(file, 'utf-8');

// 1. Add state for the agency list
const stateRegex = /const \[direktoriList, setDirektoriList\] = useState<any\[\]>\(\[\]\);/;
const stateReplace = `const [direktoriList, setDirektoriList] = useState<any[]>([]);
  const [agenList, setAgenList] = useState<any[]>([]);

  useEffect(() => {
    const fetchAgen = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const snap = await getDocs(collection(db, 'direktori'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => doc.data().name);
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
        }
      } catch (e) {
        console.error("Failed fetching agencies", e);
      }
    };
    fetchAgen();
  }, []);`;
  
if (content.match(stateRegex)) {
    content = content.replace(stateRegex, stateReplace);
}

// 2. Replace hardcoded dropdown options with dynamic map
const dropdownRegex = /<option value="" disabled>Pilih Travel\.\.\.<\/option>[\s\S]*?<option value="PT\. Cahaya Raudhah">PT\. Cahaya Raudhah<\/option>/;
const dropdownReplace = `<option value="" disabled>Pilih Travel...</option>
                        {agenList.map((agen, idx) => (
                           <option key={idx} value={agen}>{agen}</option>
                        ))}`;
                        
if (content.match(dropdownRegex)) {
    content = content.replace(dropdownRegex, dropdownReplace);
}

writeFileSync(file, content);
console.log("Login dropdown updated");
