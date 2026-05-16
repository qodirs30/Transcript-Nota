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
          <CopyButton text={formattedText} />
        </motion.div>
      </div>
    </motion.div>
  )
}
