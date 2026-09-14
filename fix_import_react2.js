import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

if (!content.includes("useMemo")) {
   content = content.replace("import { useState, useEffect", "import { useState, useEffect, useMemo");
} else if (content.match(/import \{.*useState.*\} from "react"/)) {
    let match = content.match(/import \{(.*?)\} from "react"/)[1];
    if (!match.includes("useMemo")) {
        content = content.replace(match, match + ", useMemo");
    }
} else {
    content = 'import { useMemo } from "react";\n' + content;
}

writeFileSync(file, content);
console.log("Fixed useMemo");
