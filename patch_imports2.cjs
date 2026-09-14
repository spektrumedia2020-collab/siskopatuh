const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const importRegex = /import \{ doc, getDoc.*\} from "firebase\/firestore";/;
// Let's just find the generic import and append orderBy, limit if missing.
if (content.indexOf('orderBy, limit') === -1 && content.indexOf('import {') !== -1) {
    content = content.replace('import { doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, addDoc, query, where } from "firebase/firestore";', 
                             'import { doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, addDoc, query, where, orderBy, limit } from "firebase/firestore";');
                             
    // If it STILL didn't replace because of spacing:
    if (content.indexOf('orderBy, limit') === -1) {
        content = \`import { orderBy, limit } from "firebase/firestore";\\n\` + content;
    }
    
    fs.writeFileSync(p, content, 'utf8');
    console.log("Imports fixed");
} else {
    console.log("Imports already present");
}
