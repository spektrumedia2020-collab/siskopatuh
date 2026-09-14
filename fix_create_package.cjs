const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /capacity: capacity,\s*pihkName: pihkName \|\| "PT\. Hanania",/,
  'capacity: capacity,\n      pihkName: pihkName || "PT. Hanania",\n      hotelCode: hotelCode,\n      hotelName: validatedHotel.name,'
);

fs.writeFileSync(p, c, 'utf8');
