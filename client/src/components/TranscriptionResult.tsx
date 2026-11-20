import { motion } from 'motion/react'
import EditableTextarea from './EditableTextarea'
import CopyButton from './ui/CopyButton'

interface TranscriptionResultProps {
  croppedImage: string
  formattedText: string
  onTextChange: (text: string) => void
}

export default function TranscriptionResult({
  croppedImage,
  formattedText,
  onTextChange,
}: TranscriptionResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 22 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Success pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{
          borderRadius: '14px',
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderColor: 'rgba(16,185,129,0.1)',
        }}
      >
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg style={{ width: '13px', height: '13px', color: '#34d399' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(52,211,153,0.9)' }}>Transkripsi Berhasil!</p>
          <p style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.35)' }}>Periksa hasilnya dan edit jika perlu</p>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '16px' }}>
        {/* Image preview */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ borderRadius: '20px', overflow: 'hidden' }}
        >
          {/* Header */}
          <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '7px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ width: '11px', height: '11px', color: 'rgba(255,255,255,0.45)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Gambar Nota</span>
          </div>
          {/* Image */}
          <div style={{ padding: '12px', background: 'rgba(0,0,0,0.15)' }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={croppedImage}
                alt="Cropped receipt"
                style={{ width: '100%', height: 'auto', maxHeight: '420px', objectFit: 'contain', display: 'block' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Editable text + copy */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div className="glass-card" style={{ borderRadius: '20px', padding: '16px', flex: 1 }}>
            <EditableTextarea value={formattedText} onChange={onTextChange} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <CopyButton text={formattedText} />
            <button
              onClick={() => {
                const encodedText = encodeURIComponent(formattedText)
                window.open(`https://wa.me/?text=${encodedText}`, '_blank')
              }}
              style={{
                flex: 1,
                background: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.2)',
                borderRadius: '16px',
                padding: '12px 16px',
                color: '#25D366',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 211, 102, 0.15)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Kirim ke WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
