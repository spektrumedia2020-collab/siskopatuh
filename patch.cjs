const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `      // Listen to Timelines
      const unsubTimelines = onSnapshot(doc(db, "timelines", uid), (doc) => {
        setTimelineData(doc.data());
      });
      
      setLoading(false);
    
      return () => {
        unsubUser();
        if (typeof unsubPackage === "function") unsubPackage();
        unsubSavings();
        unsubDocs();
        unsubTimelines();
      };`;
      
const replacement = `      // Listen to Timelines
      const unsubTimelines = onSnapshot(doc(db, "timelines", uid), (doc) => {
        setTimelineData(doc.data());
      });
      
      // Listen to Aduan
      const qAduan = query(collection(db, "aduan"), where("userId", "==", uid));
      const unsubAduan = onSnapshot(qAduan, (snap) => {
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setMyAduanList(list);
      });
      
      setLoading(false);
    
      return () => {
        unsubUser();
        if (typeof unsubPackage === "function") unsubPackage();
        unsubSavings();
        unsubDocs();
        unsubTimelines();
        unsubAduan();
      };`;

content = content.replace(target, replacement);
fs.writeFileSync(p, content, 'utf8');
