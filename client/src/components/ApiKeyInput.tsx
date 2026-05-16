import { useState } from 'react'
import { motion } from 'motion/react'

interface ApiKeyInputProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export default function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(!apiKey)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors duration-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-surface-200 truncate">Gemini API Key</span>
          {apiKey && (
            <span className="text-[11px] bg-accent-500/15 text-accent-400 px-2.5 py-1 rounded-full font-medium border border-accent-500/10 flex-shrink-0">
              ✓ Aktif
            </span>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-4 h-4 text-surface-500 flex-shrink-0 ml-2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>

      {/* Expandable input */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-5 pb-4 pt-1">
          <div className="relative">
            <input
              type={isVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Masukkan API Key..."
              className="w-full bg-surface-900/50 border border-surface-600/20 rounded-xl px-4 py-3 text-sm text-surface-200 placeholder:text-surface-500 focus:border-primary-500/40 focus:ring-2 focus:ring-primary-500/10 transition-all pr-24"
            />
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-surface-400 hover:text-surface-200 px-3 py-1.5 rounded-lg hover:bg-surface-700/40 transition-all cursor-pointer"
            >
              {isVisible ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>
          <p className="text-xs text-surface-500 mt-2.5 leading-relaxed">
            Key tidak disimpan di server.{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Buat API key gratis →
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
