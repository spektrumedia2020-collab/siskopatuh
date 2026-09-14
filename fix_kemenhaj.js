import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Direktori.tsx';
let content = readFileSync(file, 'utf-8');

const search = `        setBiroList(data);`;

const insert = `        // Ensure Kemenhaj is in the list
        const kemenhajExists = data.some((b: any) => b.name && b.name.includes("Kemenhaj"));
        if (!kemenhajExists) {
          const kemenhajData = {
            name: "Kemenhaj (Haji Reguler)",
            type: "Pemerintah (Haji Reguler)",
            rating: "A",
            status: "Terakreditasi",
            quota: 220000,
            since: 1945,
            address: "Jl. Lapangan Banteng Barat No. 3-4, Jakarta Pusat",
            phone: "021-3811654",
            email: "haji@kemenag.go.id"
          };
          const { addDoc } = await import("firebase/firestore");
          const docRef = await addDoc(collection(db, "direktori"), kemenhajData);
          data.unshift({ id: docRef.id, ...kemenhajData });
        }

        setBiroList(data);`;

if (content.includes(search)) {
    content = content.replace(search, insert);
    writeFileSync(file, content);
    console.log("Direktori updated to include Kemenhaj");
} else {
    console.log("Could not find the target code in Direktori.tsx");
}

