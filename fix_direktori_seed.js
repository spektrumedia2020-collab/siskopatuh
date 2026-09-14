import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Direktori.tsx';
let content = readFileSync(file, 'utf-8');

const oldList = `const DAFTAR_PIHK = [
            "PT. Hanania (PIHK)",
            "PT. Surya Citra Madani",
            "PT. Hidayah Amanah Jemaah",
            "PT. Masy'aril Haram Tour",
            "PT. Gaido Azza Darussalam",
            "PT. Nurul Muflihun Al-Baroqah",
            "PT. Al-Dawood Barokah Utama",
            "PT. JGRUP Amanah Wisata",
            "PT. Bina Wisata",
            "PT. NRA Tour & Travel",
            "PT. Patuna Mekar Jaya",
          ];`;

const newList = `const DAFTAR_PIHK = [
            "PT. Khazanah Tamma Internasional",
            "PT. Mabrur Travel Umroh",
            "PT. Hanania",
            "PT. Surya Citra Madani",
            "PT. Hidayah Amanah Jemaah",
            "PT. Masy'aril Haram Tour",
            "PT. Gaido Azza Darussalam",
            "PT. Nurul Muflihun Al-Baroqah",
            "PT. Cahaya Raudhah",
            "PT. Al-Dawood Barokah Utama",
            "PT. JGRUP Amanah Wisata",
            "PT. Bina Wisata",
            "PT. NRA Tour & Travel",
            "PT. Patuna Mekar Jaya",
          ];`;

content = content.replace(oldList, newList);
writeFileSync(file, content);
console.log("Direktori.tsx updated");
