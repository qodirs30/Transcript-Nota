const fs = require('fs');

const path = 'client/src/components/SettingsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add lucide-react imports and useRef if not there
content = content.replace("import { useState } from 'react'", "import { useState, useRef } from 'react'\nimport { Download, Upload } from 'lucide-react'");

// Add logic inside SettingsModal
const logic = `
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const data = localStorage.getItem('laporan_gemini_history')
    if (!data || data === '[]') {
      alert('Tidak ada data history untuk diekspor.')
      return
    }
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`backup_nota_\${new Date().toISOString().slice(0, 10)}.json\`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const parsed = JSON.parse(json)
        if (Array.isArray(parsed)) {
          localStorage.setItem('laporan_gemini_history', JSON.stringify(parsed))
          alert('Data berhasil di-import! Silakan muat ulang halaman atau buka menu History.')
        } else {
          alert('Format file salah.')
        }
      } catch (err) {
        alert('Gagal membaca file JSON.')
      }
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {`;

content = content.replace("  const handleSave = () => {", logic);

// Add UI buttons for Export / Import in SettingsModal
const backupUI = `
        {/* Data Backup */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '14px 15px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '11px' }}>
            <Download size={14} color="rgba(255,255,255,0.5)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Backup History</span>
          </div>
          
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            style={{ display: 'none' }} 
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Download size={14} /> Export
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
              }}
            >
              <Upload size={14} /> Import
            </motion.button>
          </div>
        </div>

        {/* Action buttons */}`;

content = content.replace("{/* Action buttons */}", backupUI);

fs.writeFileSync(path, content, 'utf8');
