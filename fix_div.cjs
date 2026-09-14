const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const regex = /<\/CardContent>\n\s*<\/Card>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/g;
const replacement = \`</CardContent>
              </Card>
        </div>
      )}\`;

content = content.replace(regex, replacement);
fs.writeFileSync(p, content, 'utf8');
