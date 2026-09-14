const fs = require('fs');
const path = require('path');
const p = path.resolve('src/App.tsx');
let content = fs.readFileSync(p, 'utf8');
content = `import { ErrorBoundary } from "./ErrorBoundary";\n` + content;
content = content.replace('<Router>', '<ErrorBoundary><Router>');
content = content.replace('</Router>', '</Router></ErrorBoundary>');
fs.writeFileSync(p, content, 'utf8');
