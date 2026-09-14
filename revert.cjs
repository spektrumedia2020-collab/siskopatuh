const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const targetEndRevert = `          </Card>
        </div>
        </div>
      )}`;

const replacementEndRevert = `          </Card>
        </div>
      )}`;

content = content.replace(targetEndRevert, replacementEndRevert);
fs.writeFileSync(p, content, 'utf8');
