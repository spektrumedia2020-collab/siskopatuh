const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDk5aQjCokx7oeDuGXrpzYnDGHVy7eE6co",
  authDomain: "gen-lang-client-0696981370.firebaseapp.com",
  projectId: "gen-lang-client-0696981370",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");

async function run() {
  const q = query(collection(db, 'mobile_scans'), orderBy('timestamp', 'desc'), limit(10));
  const snap = await getDocs(q);
  console.log("Found scans:", snap.size);
  snap.forEach(d => console.log(d.id, d.data()));
}

run().catch(console.error);
