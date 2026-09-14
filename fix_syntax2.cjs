const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

content = content.replace(`      )}

      {activeTab === 'operasional' && (
      {activeTab === 'operasional' && (`, `      )}

      {activeTab === 'operasional' && (`);

fs.writeFileSync(dashboardPath, content, 'utf8');
console.log('Fixed duplicate operasional tab syntax.');
