import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Wrap start
content = content.replace("{activeTab === 'manifes' && (\n        <Card>", "{activeTab === 'manifes' && (\n        <div className=\"space-y-6 animate-in fade-in\">\n        <Card>");

// Wrap end (the one with the import modal following it)
const endSearch = `          </CardContent>
        </Card>
      )}`;

const endReplace = `          </CardContent>
        </Card>
        </div>
      )}`;
      
if (content.includes(endSearch)) {
    content = content.replace(endSearch, endReplace);
    writeFileSync(file, content);
    console.log("Wrapper fixed");
} else {
    console.log("Could not find end wrap marker!");
}
