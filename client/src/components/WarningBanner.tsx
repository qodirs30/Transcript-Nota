import { motion } from 'motion/react'

export default function WarningBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass"
      style={{
        borderRadius: '18px',
        padding: '14px 16px',
        borderColor: 'rgba(251,191,36,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: '1px',
        }}>
          <svg style={{ width: '14px', height: '14px', color: 'rgba(251,191,36,0.8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(251,191,36,0.75)', marginBottom: '3px' }}>Peringatan</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.33)', lineHeight: 1.55 }}>
            Selalu periksa dan koreksi hasil AI — ketidakakuratan dapat terjadi terutama pada gambar buram atau kualitas rendah.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
