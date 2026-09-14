const fs = require('fs');
const path = require('path');
const p = path.resolve('src/pages/jemaah/Dashboard.tsx');
let content = fs.readFileSync(p, 'utf8');

const target = `{
                  title: "Visa & Tiket (Proof of Capacity)",
                  description: "Proses penerbitan visa dan tiket pesawat oleh Penyelenggara.",
                  status: timelineData?.pelunasanStatus === 'verified' ? "current" : "pending",
                  date: "Menunggu",
                },
                {
                  title: "Keberangkatan",
                  description: "Keberangkatan menuju Tanah Suci sesuai jadwal kloter/manifest.",
                  status: "pending",
                  date: "Menunggu",
                }`;

const replacement = `{
                  title: "Visa & Tiket (Proof of Capacity)",
                  description: "Proses penerbitan visa dan tiket pesawat oleh Penyelenggara.",
                  status: (myPackage?.statusVisa === 'Terbit Seluruhnya') ? "completed" : (timelineData?.pelunasanStatus === 'verified' ? "current" : "pending"),
                  date: (myPackage?.statusVisa === 'Terbit Seluruhnya') ? "Terkonfirmasi" : "Menunggu",
                },
                {
                  title: "Keberangkatan",
                  description: "Keberangkatan menuju Tanah Suci sesuai jadwal kloter/manifest.",
                  status: myPackage?.statusKeberangkatan?.includes('Sudah') ? "completed" : ((myPackage?.statusVisa === 'Terbit Seluruhnya') ? "current" : "pending"),
                  date: myPackage?.statusKeberangkatan?.includes('Sudah') ? "Sudah Diberangkatkan" : "Menunggu",
                },
                {
                  title: "Kepulangan",
                  description: "Kedatangan kembali di Tanah Air dengan selamat.",
                  status: myPackage?.statusKepulangan?.includes('Sudah') ? "completed" : (myPackage?.statusKeberangkatan?.includes('Sudah') ? "current" : "pending"),
                  date: myPackage?.statusKepulangan?.includes('Sudah') ? "Tiba di Tanah Air" : "Menunggu"
                }`;

content = content.replace(target, replacement);

fs.writeFileSync(p, content, 'utf8');
