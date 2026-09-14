const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDk5aQjCokx7oeDuGXrpzYnDGHVy7eE6co",
  authDomain: "gen-lang-client-0696981370.firebaseapp.com",
  projectId: "gen-lang-client-0696981370",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");

async function run() {
  await addDoc(collection(db, 'mobile_scans'), {
    rawData: "SISKOPATUH:3277013004710011:Zahar Djalle:Kashila Travel",
    timestamp: serverTimestamp(),
    lokasi: "Terminal 3 Ultimate - CGK",
    petugas: "Petugas_Satgas_01",
    statusMatch: "Match"
  });
  console.log("Mock data inserted successfully!");
}

run().catch(console.error);
