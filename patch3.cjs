const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `{activeTab === 'aduan' && (
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">`;

const replacement = `{activeTab === 'aduan' && (
        <div className="space-y-6">
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">`;

const targetEnd = `        </div>
      )}`;

const replacementEnd = `        </div>
        </div>
      )}`;

content = content.replace(target, replacement);
content = content.replace(targetEnd, replacementEnd);
fs.writeFileSync(p, content, 'utf8');
