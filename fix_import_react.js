import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Ensure React is imported if useMemo is used as React.useMemo, or just change it to useMemo if useMemo is imported
content = content.replace("React.useMemo", "useMemo");

// Let's also check if useMemo is in the import from 'react'
if (content.includes("import { useState, useEffect")) {
   if (!content.includes("useMemo")) {
      content = content.replace("import { useState, useEffect", "import { useState, useEffect, useMemo");
   }
}

writeFileSync(file, content);
console.log("Fixed useMemo import");
