const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

const mockOld = `           data = [
              { name: 'PT Al-Dawood Barokah Utama', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-005' },
              { name: 'PT. Gaido Azza Darussalam Indonesia', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-003' },
              { name: 'PT. Sultanah Nafisah Mandiri', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-001' },
           ];`;

const mockNew = `           data = [
              { name: 'PT Al-Dawood Barokah Utama', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-005', wilayahOperasional: 'DKI Jakarta', tingkatPelanggaran: 'Rendah', skorAudit: 95 },
              { name: 'PT. Gaido Azza Darussalam Indonesia', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-003', wilayahOperasional: 'Jawa Barat', tingkatPelanggaran: 'Sedang', skorAudit: 83 },
              { name: 'PT. Sultanah Nafisah Mandiri', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-001', wilayahOperasional: 'Jawa Timur', tingkatPelanggaran: 'Tinggi', skorAudit: 71 },
              { name: 'PT Atlas Tour', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-002', wilayahOperasional: 'Banten', tingkatPelanggaran: 'Kritis', skorAudit: 59 },
           ];`;

if (content.includes(mockOld)) {
  content = content.replace(mockOld, mockNew);
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Mock data patched!");
} else {
  console.log("Mock data not found!");
}
