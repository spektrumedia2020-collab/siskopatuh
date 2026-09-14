const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/penyelenggara/Dashboard.tsx');
let c = fs.readFileSync(p, 'utf8');

const oldSwagger = `<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      setToastMessage({title: "Membuka Dokumentasi", desc: "Anda akan dialihkan ke halaman Swagger UI...", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                    }}>
                      Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" />
                    </Button>`;

const newSwagger = `<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      setToastMessage({title: "Membuka Dokumentasi", desc: "Membuka halaman Swagger UI di tab baru...", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                      window.open("https://swagger.io/tools/swagger-ui/", "_blank");
                    }}>
                      Buka Swagger Docs <ArrowUpRight className="w-3 h-3 ml-2" />
                    </Button>`;

const oldPostman = `<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      setToastMessage({title: "Mengunduh File", desc: "File siskopatuh-v2-api.postman_collection.json sedang diunduh.", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                    }}>
                      Download Postman Collection
                    </Button>`;

const newPostman = `<Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200" onClick={() => {
                      const postmanData = {
                        info: { name: "SISKOPATUH V2 API", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
                        item: [{ name: "Check Porsi", request: { method: "GET", header: [{ key: "Authorization", value: "Bearer {{api_key}}" }], url: { raw: "{{base_url}}/api/v1/porsi/status", host: ["{{base_url}}"], path: ["api", "v1", "porsi", "status"] } } }]
                      };
                      const blob = new Blob([JSON.stringify(postmanData, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "siskopatuh-v2-api.postman_collection.json";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      setToastMessage({title: "Unduhan Selesai", desc: "File Postman Collection berhasil disimpan.", type: "success"});
                      setTimeout(() => setToastMessage(null), 3000);
                    }}>
                      Download Postman Collection
                    </Button>`;

c = c.replace(oldSwagger, newSwagger);
c = c.replace(oldPostman, newPostman);

fs.writeFileSync(p, c, 'utf8');
