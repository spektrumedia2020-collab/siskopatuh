import { readFileSync, writeFileSync } from 'fs';

const file = 'src/pages/penyelenggara/Dashboard.tsx';
let content = readFileSync(file, 'utf-8');

// Inject the useMemo for displayJemaahs
const searchInject = `const paxCount = packages.reduce((acc, curr) => acc + curr.filled, 0) || 45;`;
const replaceInject = `const paxCount = packages.reduce((acc, curr) => acc + curr.filled, 0) || 45;

  const displayJemaahs = React.useMemo(() => {
    if (packages.length === 0) return jemaahs;
    
    // Generate 1 dummy jemaah per package
    const fakeJemaahs = packages.map((pkg, idx) => ({
      id: 'sampel-' + idx,
      name: ['Ahmad', 'Budi', 'Siti', 'Fatima', 'Rudi'][idx % 5] + ' ' + ['Mubarak', 'Santoso', 'Aminah', 'Zahra', 'Hidayat'][idx % 5],
      packageName: pkg.name,
      porsi: '1000' + (46001 + idx + 1),
      penyelenggara: pkg.pihkName || pihkName,
      bayar: 'LUNAS',
      visa: idx === 0 ? 'TERBIT' : 'PROSES'
    }));

    // Identify if real jemaahs already cover the packages (avoid duplicates if they do)
    if (jemaahs.length >= 3) return jemaahs;

    // Merge with any real ones so 'Zahar' is still there, but filter out duplicates by package name if we want, or just append!
    const existingPackageNames = jemaahs.map(j => j.packageName);
    const filteredFakes = fakeJemaahs.filter(f => !existingPackageNames.includes(f.packageName));
    
    return [...jemaahs, ...filteredFakes];
  }, [jemaahs, packages, pihkName]);
`;
content = content.replace(searchInject, replaceInject);

// Replace mapping in table
const searchMap = `{jemaahs.length > 0 ? jemaahs.map((j, i) => (`;
const replaceMap = `{displayJemaahs.length > 0 ? displayJemaahs.map((j, i) => (`;
content = content.replace(searchMap, replaceMap);

// Fix title count
const searchTitle = `Menampilkan Sampel ({jemaahs.length} dari`;
const replaceTitle = `Menampilkan Sampel ({displayJemaahs.length} dari`;
content = content.replace(searchTitle, replaceTitle);

writeFileSync(file, content);
console.log("Updated manifest logic!");
