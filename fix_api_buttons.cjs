const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /<Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800">Salin<\/Button>/,
  \`<Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => {
    navigator.clipboard.writeText("sk_live_siskopatuh_9x8f7a6b5c4d3e2f1a0");
    setToastMessage({title: "Berhasil", desc: "Live API Key disalin ke clipboard.", type: "success"});
    setTimeout(() => setToastMessage(null), 3000);
  }}>Salin</Button>\`
);

c = c.replace(
  /<Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800">Salin<\/Button>/,
  \`<Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => {
    navigator.clipboard.writeText("sk_test_siskopatuh_1q2w3e4r5t6y7u8i9o0");
    setToastMessage({title: "Berhasil", desc: "Sandbox API Key disalin ke clipboard.", type: "success"});
    setTimeout(() => setToastMessage(null), 3000);
  }}>Salin</Button>\`
);

c = c.replace(
  /<Button variant="outline" size="sm" className="h-8 border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300">Regenerate<\/Button>/,
  \`<Button variant="outline" size="sm" className="h-8 border-rose-900 text-rose-400 hover:bg-rose-950 hover:text-rose-300" onClick={() => {
    if(confirm("Apakah Anda yakin ingin melakukan Regenerate API Key? Key yang lama akan langsung tidak berlaku.")) {
      setToastMessage({title: "Key Diperbarui", desc: "API Key berhasil di-regenerate. Silakan perbarui sistem internal Anda.", type: "success"});
      setTimeout(() => setToastMessage(null), 4000);
    }
  }}>Regenerate</Button>\`
);

c = c.replace(
  /<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200">\s*Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" \/>\s*<\/Button>/,
  \`<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
    setToastMessage({title: "Membuka Dokumentasi", desc: "Anda akan dialihkan ke halaman Swagger UI...", type: "success"});
    setTimeout(() => setToastMessage(null), 3000);
  }}>
    Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" />
  </Button>\`
);

c = c.replace(
  /<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200">\s*Download Postman Collection\s*<\/Button>/,
  \`<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
    setToastMessage({title: "Mengunduh File", desc: "File siskopatuh-v2-api.postman_collection.json sedang diunduh.", type: "success"});
    setTimeout(() => setToastMessage(null), 3000);
  }}>
    Download Postman Collection
  </Button>\`
);

fs.writeFileSync(p, c, 'utf8');
