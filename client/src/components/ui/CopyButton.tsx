import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface CopyButtonProps {
  text: string
  className?: string
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [text])

  return (
    <motion.button
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={handleCopy}
      className={`shimmer-hover ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        padding: '15px 24px',
        borderRadius: '18px',
        minHeight: '52px',
        fontWeight: 600,
        fontSize: '14px',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        ...(copied ? {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 8px 24px rgba(16,185,129,0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
        } : {
          background: 'linear-gradient(135deg, #ff3131 0%, #c80d0d 100%)',
          border: '1px solid rgba(255,80,80,0.22)',
          boxShadow: '0 8px 24px rgba(255,49,49,0.22), inset 0 1px 0 rgba(255,255,255,0.16)',
        }),
      }}
    >
      {/* Top specular */}
      <div
        style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
        }}
      />

      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Tersalin ke clipboard!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
            Salin ke Clipboard
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
