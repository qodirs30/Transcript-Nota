import { motion } from 'motion/react'

interface LoadingSpinnerProps {
  text?: string
  subtext?: string
}

export default function LoadingSpinner({ text = 'Memproses...', subtext }: LoadingSpinnerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '4rem 2rem' }}>
      {/* Liquid glass spinner */}
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderTopColor: '#ff4444',
            borderRightColor: 'rgba(255,68,68,0.3)',
          }}
        />
        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: '10px',
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderBottomColor: 'rgba(255,100,100,0.5)',
            borderLeftColor: 'rgba(255,100,100,0.2)',
          }}
        />
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ff6464, #ff3131)',
            boxShadow: '0 0 10px rgba(255,49,49,0.5)',
          }} />
        </motion.div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.72)', marginBottom: '4px' }}
        >
          {text}
        </motion.p>
        {subtext && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}
          >
            {subtext}
          </motion.p>
        )}
      </div>
    </div>
  )
}
