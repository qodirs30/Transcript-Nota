import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Modal from '../components/ui/Modal'
import EmojiRain from '../components/EmojiRain'

interface AuthGatePageProps {
  onAccessGranted: () => void
}

export default function AuthGatePage({ onAccessGranted }: AuthGatePageProps) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [emojiRainActive, setEmojiRainActive] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleCorrectAnswer = () => {
    setIsTransitioning(true)
    setTimeout(() => onAccessGranted(), 600)
  }

  const handleWrongAnswer = () => {
    setShowRejectModal(true)
    setEmojiRainActive(true)
    setTimeout(() => setEmojiRainActive(false), 6000)
  }

  return (
    <>
      <EmojiRain active={emojiRainActive} />

      <AnimatePresence>
        {!isTransitioning && (
          <motion.div
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-dvh flex items-center justify-center relative overflow-hidden p-6"
            style={{ background: 'var(--color-surface-950)' }}
          >
            {/* Background mesh */}
            <div className="absolute inset-0 bg-mesh bg-noise" />

            {/* Floating orbs */}
            <motion.div
              animate={{ x: [0, 35, 0], y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,49,49,0.14) 0%, transparent 70%)', filter: 'blur(40px)' }}
            />
            <motion.div
              animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,80,80,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
            />

            {/* Card — near-square, generous padding */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', damping: 24, stiffness: 200 }}
              className="glass-card-elevated relative z-10 shimmer-hover"
              style={{
                borderRadius: '28px',
                padding: 'clamp(2rem, 5vw, 3.5rem)',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center',
              }}
            >
              {/* Top specular highlight */}
              <div
                className="absolute top-0 left-12 right-12 h-px rounded-full"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
              />

              {/* Red accent pill */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-2 mb-7"
                style={{
                  background: 'rgba(255,49,49,0.1)',
                  border: '1px solid rgba(255,49,49,0.18)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#ff3131', boxShadow: '0 0 6px rgba(255,49,49,0.8)' }}
                />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,120,120,0.9)', letterSpacing: '0.04em' }}>
                  LAPORAN JAVA & MJP
                </span>
              </motion.div>

              {/* Question */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '10px' }}
              >
                qodirs ganteng apa gak?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13.5px', marginBottom: '36px' }}
              >
                Jawab dengan jujur untuk melanjutkan
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                {/* Yes button — primary red */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCorrectAnswer}
                  className="shimmer-hover"
                  style={{
                    width: '100%',
                    padding: '15px 24px',
                    borderRadius: '16px',
                    fontWeight: 600,
                    fontSize: '15px',
                    color: 'white',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,80,80,0.25)',
                    background: 'linear-gradient(135deg, #ff3131 0%, #c80d0d 100%)',
                    boxShadow: '0 8px 24px rgba(255,49,49,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ih ganteng bangettt
                </motion.button>

                {/* No button — ghost glass */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWrongAnswer}
                  style={{
                    width: '100%',
                    padding: '15px 24px',
                    borderRadius: '16px',
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.52)',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  welek
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                style={{ marginTop: '28px', fontSize: '11px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.03em' }}
              >
                Laporan JAVA & MJP
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} allowClose={true}>
        <div style={{ textAlign: 'center', paddingTop: '8px', paddingBottom: '8px' }}>
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 260 }}
            style={{ marginBottom: '20px' }}
          >
            <div
              style={{
                width: '60px', height: '60px',
                borderRadius: '16px',
                background: 'rgba(255,49,49,0.12)',
                border: '1px solid rgba(255,49,49,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <svg style={{ width: '28px', height: '28px', color: '#ff6464' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </motion.div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>
            ndasem wi seng welekkk
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
            Jawab yang bener dong!
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowRejectModal(false)}
            style={{
              width: '100%',
              padding: '13px 24px',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '14px',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              transition: 'all 0.2s ease',
            }}
          >
            Coba Lagi
          </motion.button>
        </div>
      </Modal>
    </>
  )
}
