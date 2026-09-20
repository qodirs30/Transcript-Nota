import { useCallback, useRef, useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface ImageUploaderProps {
  onImageSelect: (imageDataUrl: string) => void
}

export default function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onImageSelect(reader.result)
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) { processFile(file); break }
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [processFile])

  const handlePasteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (!navigator.clipboard || !navigator.clipboard.read) {
        alert('Browser Anda tidak mendukung tombol ini. Silakan sentuh layar & tahan -> Paste.')
        return
      }
      const clipboardItems = await navigator.clipboard.read()
      for (const clipboardItem of clipboardItems) {
        const imageType = clipboardItem.types.find(type => type.startsWith('image/'))
        if (imageType) {
          const blob = await clipboardItem.getType(imageType)
          const file = new File([blob], 'pasted-image.png', { type: imageType })
          processFile(file)
          return
        }
      }
      alert('Tidak ada gambar di clipboard. Copy gambar terlebih dahulu.')
    } catch (err) {
      console.error('Failed to read clipboard:', err)
      alert('Gagal mengakses clipboard. Pastikan browser memberi izin, atau gunakan sentuh layar & tahan -> Paste.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 22 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="glass-card-elevated shimmer-hover"
        style={{
          borderRadius: '24px',
          padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'hidden',
          ...(isDragging ? {
            borderColor: 'rgba(255,49,49,0.4)',
            background: 'rgba(255,49,49,0.04)',
            transform: 'scale(1.005)',
          } : {}),
        }}
      >
        {/* Top specular */}
        <div
          className="absolute top-0 left-16 right-16 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }}
        />

        {/* Upload Icon */}
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ color: isDragging ? '#ff3131' : 'rgba(255,255,255,0.8)', marginBottom: '4px' }}
        >
          <svg style={{ width: '48px', height: '48px', transition: 'color 0.25s ease' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </motion.div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '15px',
            fontWeight: 600,
            color: isDragging ? 'rgba(255,120,120,0.95)' : 'rgba(255,255,255,0.82)',
            marginBottom: '6px',
            transition: 'color 0.2s ease',
          }}>
            {isDragging ? 'Lepaskan di sini!' : 'Unggah Foto Nota'}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, fontWeight: 500 }}>
            Tap untuk upload atau ambil foto
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Paste Button */}
      <motion.button
        onClick={handlePasteClick}
        style={{
          borderRadius: '16px',
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'none',
          width: '100%',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
        }}
        whileTap={{ scale: 0.98 }}
      >
        <svg style={{ width: '18px', height: '18px', opacity: 0.7 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        Tempel Teks dari Clipboard
      </motion.button>
    </motion.div>
  )
}
