const fs = require('fs');

const path = 'client/src/components/ImageUploader.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the nested icon container and styling with a simple icon
content = content.replace(
  /\{?\/\* Upload icon container \*\/\}?[\s\S]*?<svg[\s\S]*?<\/svg>\s*<\/div>\s*<\/motion\.div>/,
  `{/* Upload Icon */}
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ color: isDragging ? '#ff3131' : 'rgba(255,255,255,0.8)', marginBottom: '4px' }}
        >
          <svg style={{ width: '48px', height: '48px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </motion.div>`
);

content = content.replace(
  /\{isDragging \? 'Lepaskan di sini!' : 'Upload Nota Kalian'\}/,
  "{isDragging ? 'Lepaskan di sini!' : 'Unggah Foto Nota'}"
);

// Contrast for subtext
content = content.replace(
  /<p style=\{\{\s*fontSize:\s*'12\.5px',\s*color:\s*'rgba\(255,255,255,0\.4\)',\s*lineHeight:\s*1\.5\s*\}\}>\s*Tap untuk upload atau ambil foto\s*<\/p>/,
  `<p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontWeight: 500 }}>
            Tap untuk upload atau ambil foto
          </p>`
);

// Secondary Action Button
content = content.replace(
  /\{?\/\* Paste Button \*\/\}?[\s\S]*?<\/motion\.button>/,
  `{/* Paste Button (Secondary Action) */}
      <motion.button
        onClick={handlePasteClick}
        style={{
          borderRadius: '16px',
          padding: '14px 24px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: '100%',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        }}
        whileTap={{ scale: 0.97 }}
      >
        <svg style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        Tempel Teks dari Clipboard
      </motion.button>`
);

fs.writeFileSync(path, content, 'utf8');
