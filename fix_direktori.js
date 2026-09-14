import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/Direktori.tsx';
let content = readFileSync(file, 'utf-8');

const search = `        if (snap.empty) {
          // If empty, seed some default data`;

const insert = `        if (snap.empty) {
          // If empty, seed some default data`;

content = content.replace(search, insert);
