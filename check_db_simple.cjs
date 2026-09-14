const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const firebaseConfig = {
  apiKey: "AIzaSyDk5aQjCokx7oeDuGXrpzYnDGHVy7eE6co",
  authDomain: "gen-lang-client-0696981370.firebaseapp.com",
  projectId: "gen-lang-client-0696981370",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");
async function run() {
  console.log("Fetching...");
  const snap = await getDocs(collection(db, 'mobile_scans'));
  console.log("Total scans:", snap.size);
  snap.forEach(d => console.log(d.id, d.data()));
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
