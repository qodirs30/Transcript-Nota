import { motion } from 'motion/react'

export default function WarningBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '16px',
        padding: '0 8px',
      }}
    >
      <svg style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontWeight: 500 }}>
        Selalu periksa hasil AI. Ketidakakuratan dapat terjadi pada foto buram.
      </p>
    </motion.div>
  )
}
