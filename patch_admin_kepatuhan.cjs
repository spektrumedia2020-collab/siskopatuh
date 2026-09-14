const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

// We need to add state for penyelenggara users
const stateImportTarget = `const [isSavingKuota, setIsSavingKuota] = useState(false);`;
const stateImportAddition = `
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
      
      recordAdminLog(\`Memberikan sanksi \${sanctionType} kepada \${selectedPenyelenggaraForSanction.name}\`);
      
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
`;
content = content.replace(stateImportTarget, stateImportTarget + stateImportAddition);

const tabKepatuhanTarget = `{activeTab === 'kepatuhan' && (`;
// We will replace the entire kepatuhan tab content up to the next {activeTab === '...'
// Let's find the end of it first by grabbing the content from line 816 to 855

fs.writeFileSync(p, content, 'utf8');
