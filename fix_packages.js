import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

const search = `        const defaultPackages = [
          { name: pihkName?.includes("Kemenhaj") ? "Haji Reguler 40 Hari" : "Umroh Reguler 9 Hari", airline: "Garuda Indonesia", pnr: "GA-9921", capacity: 45, filled: 15, reserved: 0, pihkName: pihkName || "PT. Hanania", createdAt: new Date(Date.now() - 10000) },
          { name: "Umroh Plus Turki 12 Hari", airline: "Turkish Airlines", pnr: "TK-4022", capacity: 45, filled: 12, reserved: 0, pihkName: pihkName || "PT Mabrur Travel Umroh", createdAt: new Date(Date.now() - 20000) },
          { name: "Umroh Ramadhan VIP", airline: "Saudia Airlines", pnr: "SV-8832", capacity: 45, filled: 10, reserved: 0, pihkName: pihkName || "Al-Amin Tours & Travel", createdAt: new Date(Date.now() - 30000) },
          { name: "Umroh Hemat 10 Hari", airline: "Lion Air", pnr: "JT-3341", capacity: 45, filled: 8, reserved: 0, pihkName: pihkName || "Berkah Haramain Tour", createdAt: new Date(Date.now() - 40000) }
        ];`;

const replace = `        const isGov = pihkName?.includes("Kemenhaj") || pihkName?.includes("Haji");
        const defaultPackages = isGov ? [
          { name: "Haji Reguler 40 Hari", airline: "Garuda Indonesia", pnr: "GA-9921", capacity: 400, filled: 395, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 10000) },
          { name: "Haji Reguler 2026 - Kloter 1 JKG", airline: "Saudia Airlines", pnr: "SV-8832", capacity: 450, filled: 450, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 20000) },
          { name: "Haji Reguler 2026 - Kloter 2 SOC", airline: "Garuda Indonesia", pnr: "GA-7711", capacity: 450, filled: 440, reserved: 0, pihkName: pihkName, createdAt: new Date(Date.now() - 30000) }
        ] : [
          { name: "Umroh Reguler 9 Hari", airline: "Garuda Indonesia", pnr: "GA-9921", capacity: 45, filled: 15, reserved: 0, pihkName: pihkName || "PT. Hanania", createdAt: new Date(Date.now() - 10000) },
          { name: "Umroh Plus Turki 12 Hari", airline: "Turkish Airlines", pnr: "TK-4022", capacity: 45, filled: 12, reserved: 0, pihkName: pihkName || "PT Mabrur Travel Umroh", createdAt: new Date(Date.now() - 20000) },
          { name: "Umroh Ramadhan VIP", airline: "Saudia Airlines", pnr: "SV-8832", capacity: 45, filled: 10, reserved: 0, pihkName: pihkName || "Al-Amin Tours & Travel", createdAt: new Date(Date.now() - 30000) },
          { name: "Umroh Hemat 10 Hari", airline: "Lion Air", pnr: "JT-3341", capacity: 45, filled: 8, reserved: 0, pihkName: pihkName || "Berkah Haramain Tour", createdAt: new Date(Date.now() - 40000) }
        ];`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    writeFileSync(file, content);
    console.log("Updated default packages based on Kemenhaj!");
} else {
    console.log("Could not find the target code in Dashboard.tsx");
}
