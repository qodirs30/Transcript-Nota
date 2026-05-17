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

        {/* Upload icon container */}
        <motion.div
          animate={isDragging ? { scale: 1.12, y: -6 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          <div
            style={{
              width: '76px', height: '76px',
              borderRadius: '22px',
              background: isDragging
                ? 'rgba(255,49,49,0.14)'
                : 'rgba(255,255,255,0.05)',
              border: isDragging
                ? '1px solid rgba(255,49,49,0.25)'
                : '1px solid rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: isDragging
                ? '0 8px 24px rgba(255,49,49,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
              transition: 'all 0.25s ease',
            }}
          >
            <svg
              style={{ width: '32px', height: '32px', color: isDragging ? '#ff6464' : 'rgba(255,100,100,0.75)', transition: 'color 0.25s ease' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
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
            {isDragging ? 'Lepaskan di sini!' : 'Upload Nota Kalian'}
          </p>
          <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
            Drag & drop, klik pilih file, atau{' '}
            <kbd style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(255,100,100,0.8)',
              background: 'rgba(255,49,49,0.08)',
              border: '1px solid rgba(255,49,49,0.15)',
              padding: '1px 6px',
              borderRadius: '6px',
            }}>Ctrl+V</kbd>
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
          borderRadius: '18px',
          padding: '14px 20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.85)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          width: '100%',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,49,49,0.08)'
          e.currentTarget.style.borderColor = 'rgba(255,49,49,0.2)'
          e.currentTarget.style.color = '#ff6464'
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
        }}
        whileTap={{ scale: 0.98 }}
      >
        <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        Tempel dari Keyboard
      </motion.button>
    </motion.div>
  )
}
