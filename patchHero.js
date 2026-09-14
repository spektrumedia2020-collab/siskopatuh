const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/HeroSettings.tsx', 'utf-8');

const modified = content
  .replace("import { Save, Image as ImageIcon, MonitorPlay, Upload } from \"lucide-react\";", "import { Save, Image as ImageIcon, MonitorPlay, Upload } from \"lucide-react\";\nimport { compressImage } from \"../../lib/utils\";")
  .replace(/const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n\s*\}\n\s*\};/, `const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
        return;
      }
      try {
        const compressedBase64 = await compressImage(file, 1200, 0.6);
        setFormData(prev => ({ ...prev, backgroundImageUrl: compressedBase64 }));
        setSaved(false);
      } catch (err) {
        console.error("Error compressing image:", err);
        alert("Gagal memproses gambar.");
      }
    }
  };`);

fs.writeFileSync('src/pages/admin/HeroSettings.tsx', modified);
