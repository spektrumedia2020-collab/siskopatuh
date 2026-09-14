const fs = require('fs');
const path = require('path');
const dashboardPath = path.resolve('src/pages/admin/Dashboard.tsx');
let content = fs.readFileSync(dashboardPath, 'utf8');

// Patch UI
const uiStart = "{activeTab === 'registrasi' && (";
const uiEnd = `      )}

      {activeTab === 'operasional' && (`;

if (content.includes(uiStart) && content.includes(uiEnd)) {
  const before = content.substring(0, content.indexOf(uiStart));
  const after = content.substring(content.indexOf(uiEnd) + 9); // keep newline
  
  const newUI = `{activeTab === 'registrasi' && (
        <div className="flex flex-col lg:flex-row gap-6 flex-grow animate-in fade-in h-full">
          {/* Left Panel - List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <select
              className="bg-[#0b1120] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 w-full"
              value={activePemohon?.id || ''}
              onChange={(e) => setActivePemohon(direktoriList.find(d => d.id === e.target.value) || null)}
            >
              <option value="">Pilih Pemohon...</option>
              {direktoriList.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar h-[calc(100vh-250px)]">
              {direktoriList.map((item, idx) => {
                const isActive = activePemohon?.id === item.id;
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setActivePemohon(item)}
                    className={\`cursor-pointer p-4 rounded-xl border transition-all \${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-[#0b1120] border-slate-800 hover:border-slate-700'
                    }\`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={\`font-bold text-sm \${isActive ? 'text-emerald-100' : 'text-slate-200'}\`}>
                        {item.name}
                      </h4>
                      <span className={\`text-[10px] font-bold px-2 py-1 rounded border \${
                        item.status === 'MENUNGGU' ? 'bg-amber-950/50 text-amber-500 border-amber-900/50' :
                        item.status === 'DISETUJUI' ? 'bg-emerald-950/50 text-emerald-500 border-emerald-900/50' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }\`}>
                        {item.status?.toUpperCase() || 'MENUNGGU'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-col gap-1">
                      <span>ID: {item.id || \`PIHK-00\${idx+1}\`}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Baru saja</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {activePemohon ? (
              <>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{activePemohon.name}</h2>
                    <p className="text-sm text-emerald-500 flex items-center gap-2 mt-1">
                      <Building2 className="w-4 h-4" /> Pengajuan Izin {activePemohon.type || 'PIHK'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase">Status Pemohon</p>
                    <p className="text-amber-400 font-bold text-sm">Verifikasi Dokumen</p>
                  </div>
                </div>

                {/* Card 1: Validasi AHU */}
                <Card className="bg-[#0b1120] border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">1</div>
                      <h3 className="font-bold text-slate-200">Validasi Status Hukum (AHU)</h3>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 border border-slate-800 p-4 rounded-lg gap-4">
                      <div>
                        <p className="text-sm text-slate-300">Nomor Induk Berusaha (NIB): <span className="font-bold">8120004951234</span></p>
                        <p className="text-xs text-slate-500 mt-1">Integrasi API Kemenkumham diperlukan untuk memeriksa keabsahan entitas.</p>
                      </div>
                      <Button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold shrink-0">
                        VALIDASI DATA AHU
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2: Dokumen Fisik/Digital */}
                <Card className="bg-[#0b1120] border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">2</div>
                      <h3 className="font-bold text-slate-200">Kelengkapan Dokumen Fisik/Digital</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* SK Kemenkumham Upload */}
                      <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all">
                        <Upload className="w-6 h-6 text-slate-500 mb-3" />
                        <p className="text-sm font-bold text-slate-300">SK Kemenkumham</p>
                        <p className="text-[10px] text-slate-500 mt-1">Format PDF (Maks. 5MB)</p>
                      </div>

                      {/* Bukti Rekening Upload */}
                      <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all">
                        <Upload className="w-6 h-6 text-slate-500 mb-3" />
                        <p className="text-sm font-bold text-slate-300">Bukti Rekening 1 Miliar</p>
                        <p className="text-[10px] text-slate-500 mt-1">Format PDF (Maks. 5MB)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <FileCheck className="w-12 h-12 mb-4 opacity-50" />
                <p>Pilih pemohon dari daftar di sebelah kiri untuk melihat detail.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'operasional' && (`;
  
  content = before + newUI + after;
  
  // Replace the mock data for direktoriList
  const mockOld = `data = [
              { name: 'PT. Khazzanah Al-Anshary', type: 'PIHK', status: 'Menunggu', id: 'DIR-001' },
              { name: 'PT. Mabrur Tour', type: 'PPIU', status: 'Dalam Pengawasan', id: 'DIR-002' },
              { name: 'PT. Safa Marwa', type: 'PIHK', status: 'Disetujui', id: 'DIR-003' },
           ];`;
  const mockNew = `data = [
              { name: 'PT Al-Dawood Barokah Utama', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-005' },
              { name: 'PT. Gaido Azza Darussalam Indonesia', type: 'PIHK', status: 'MENUNGGU', id: 'PIHK-003' },
              { name: 'PT. Sultanah Nafisah Mandiri', type: 'PPIU', status: 'MENUNGGU', id: 'PPIU-001' },
           ];`;
           
  if (content.includes(mockOld)) {
    content = content.replace(mockOld, mockNew);
  }
  
  fs.writeFileSync(dashboardPath, content, 'utf8');
  console.log("Patched successfully!");
} else {
  console.log("Could not find UI block limits.");
}
