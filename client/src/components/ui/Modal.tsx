import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  allowClose?: boolean
}

export default function Modal({ isOpen, onClose, children, allowClose = true }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          onClick={allowClose ? onClose : undefined}
        >
          {/* Backdrop — heavy blur for liquid feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />

          {/* Modal Content — square proportions, liquid glass */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340, mass: 0.8 }}
            className="relative glass-modal rounded-3xl p-8 w-full shadow-2xl"
            style={{ maxWidth: '380px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top specular line */}
            <div
              className="absolute top-0 left-8 right-8 h-px rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
            />

            {allowClose && onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                aria-label="Close modal"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
