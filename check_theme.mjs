import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
import { readFileSync } from "fs";

const configPath = "firebase-applet-config.json";
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const app = initializeApp(config);
const db = initializeFirestore(app, { experimentalForceLongPolling: true }, "ai-studio-portalinfosistem-a938b2d7-f250-4897-abde-e17eefa6067b");

async function run() {
    try {
        const themeDoc = await getDoc(doc(db, "settings", "theme"));
        if (themeDoc.exists()) {
            console.log(themeDoc.data());
        } else {
            console.log("No theme document.");
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
run();
