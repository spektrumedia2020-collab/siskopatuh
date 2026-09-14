const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const calcCode = `  const computedBalance = savingsData?.transactions?.reduce((acc, tx) => {
    if (tx.type?.includes('deposit')) {
       return acc + (Number(tx.amount) || 0);
    }
    return acc;
  }, 0) || savingsData?.totalBalance || 0;
  
  const estimatedTotal = userData?.jenis === "Haji Reguler" ? 85000000 : (userData?.jenis === "Haji Khusus" ? 150000000 : 35000000);
  const progressPercent = Math.min(100, Math.round((computedBalance / estimatedTotal) * 100));
`;

content = content.replace(
  `const dataManfaat = [`,
  calcCode + `\n  const dataManfaat = [`
);

const target = `<CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Virtual Account H2H</p>
                <h3 className="text-2xl font-bold mt-1">
                  Rp {savingsData?.totalBalance ? savingsData.totalBalance.toLocaleString('id-ID') : '0'}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">VA: {userData.virtualAccount}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg">
                <Banknote className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-50">
              <span className="bg-emerald-500/50 px-2 py-0.5 rounded text-xs font-semibold uppercase">LUNAS</span>
              <span>Setoran Awal</span>
            </div>
          </CardContent>`;

const replacement = `<CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Dana (Virtual Account H2H)</p>
                <h3 className="text-2xl font-bold mt-1">
                  Rp {computedBalance.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">VA: {userData?.virtualAccount}</p>
              </div>
              <div className="p-2 bg-white/20 rounded-lg shrink-0">
                <Banknote className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4">
               <div className="flex justify-between text-xs text-emerald-50 mb-1">
                 <span>Progress Pelunasan</span>
                 <span>{progressPercent}%</span>
               </div>
               <div className="w-full bg-emerald-950/50 rounded-full h-1.5 border border-emerald-800/50">
                 <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: \`\${progressPercent}%\` }}></div>
               </div>
               <div className="flex justify-between items-center mt-2">
                 <p className="text-[10px] text-emerald-100">Estimasi Biaya: Rp {estimatedTotal.toLocaleString('id-ID')}</p>
                 {progressPercent >= 100 && <span className="text-[9px] font-bold bg-emerald-500 px-1.5 py-0.5 rounded text-emerald-950">LUNAS</span>}
               </div>
            </div>
          </CardContent>`;

if (content.indexOf(target) !== -1) {
   content = content.replace(target, replacement);
   fs.writeFileSync(p, content, 'utf8');
   console.log("Patched VA exactly");
} else {
   console.log("Target not found!");
}
