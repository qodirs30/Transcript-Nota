import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

interface EditableTextareaProps {
  value: string
  onChange: (value: string) => void
}

export default function EditableTextarea({ value, onChange }: EditableTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '7px',
            background: 'rgba(255,49,49,0.08)',
            border: '1px solid rgba(255,49,49,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg style={{ width: '11px', height: '11px', color: 'rgba(255,80,80,0.75)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Hasil Transkripsi</span>
        </div>
        <span style={{
          fontSize: '10.5px',
          color: 'rgba(255,255,255,0.28)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '3px 8px',
          borderRadius: '6px',
        }}>
          Bisa diedit
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '14px',
          padding: '14px',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.75,
          resize: 'none',
          minHeight: '260px',
          fontFamily: "'Inter', system-ui, sans-serif",
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => e.target.style.borderColor = 'rgba(255,49,49,0.25)'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
      />
    </motion.div>
  )
}
