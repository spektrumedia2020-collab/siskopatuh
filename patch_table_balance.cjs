const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `<tbody className="divide-y divide-slate-800 text-slate-300">
                  {savingsData?.transactions?.map((tx: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3">{tx.date?.toDate ? tx.date.toDate().toLocaleDateString('id-ID') : new Date().toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3">{tx.description}</td>
                      <td className="px-4 py-3 text-right capitalize">{tx.type}</td>
                      <td className={\`px-4 py-3 text-right font-medium \${tx.type === 'deposit' ? 'text-white' : 'text-emerald-400'}\`}>
                        + Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">Rp {tx.balanceAfter.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>`;

const replacement = `<tbody className="divide-y divide-slate-800 text-slate-300">
                  {(() => {
                    let runningBalance = 0;
                    return savingsData?.transactions?.map((tx: any, i: number) => {
                      if (tx.type?.includes('deposit')) {
                        runningBalance += Number(tx.amount) || 0;
                      }
                      return (
                        <tr key={i}>
                          <td className="px-4 py-3">{tx.date?.toDate ? tx.date.toDate().toLocaleDateString('id-ID') : new Date(tx.date).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-3">{tx.description}</td>
                          <td className="px-4 py-3 text-right capitalize">{tx.type}</td>
                          <td className={\`px-4 py-3 text-right font-medium \${tx.type?.includes('deposit') ? 'text-emerald-400' : 'text-white'}\`}>
                            + Rp {Number(tx.amount).toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-white">Rp {runningBalance.toLocaleString('id-ID')}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>`;

if (content.indexOf('<tbody className="divide-y divide-slate-800 text-slate-300">') !== -1) {
  // Use replace with a regular expression since whitespace might differ slightly
  const startIndex = content.indexOf('<tbody className="divide-y divide-slate-800 text-slate-300">');
  const endIndex = content.indexOf('</tbody>', startIndex) + '</tbody>'.length;
  
  if (startIndex !== -1 && endIndex !== -1) {
     const before = content.substring(0, startIndex);
     const after = content.substring(endIndex);
     content = before + replacement + after;
     fs.writeFileSync(p, content, 'utf8');
     console.log("Patched table running balance.");
  }
} else {
  console.log("Could not find table body.");
}
