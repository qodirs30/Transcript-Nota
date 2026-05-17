import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import SettingsModal from '../components/SettingsModal'
import ImageUploader from '../components/ImageUploader'
import ImageCropper from '../components/ImageCropper'
import TranscriptionResult from '../components/TranscriptionResult'
import WarningBanner from '../components/WarningBanner'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { transcribeReceipt } from '../services/api'

type Stage = 'upload' | 'crop' | 'processing' | 'result'

const STORAGE_KEY = 'laporan_gemini_apikey'

export default function TranscriptionPage() {
  // Load custom API key from localStorage on startup
  const [apiKey, setApiKey] = useState<string>(() => {
    try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
  })
  const [stage, setStage] = useState<Stage>('upload')
  const [rawImage, setRawImage] = useState('')
  const [croppedImage, setCroppedImage] = useState('')
  const [formattedText, setFormattedText] = useState('')
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  // Persist custom key to localStorage whenever it changes
  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key)
    try {
      if (key) localStorage.setItem(STORAGE_KEY, key)
      else localStorage.removeItem(STORAGE_KEY)
    } catch { /* storage not available */ }
  }, [])

  const handleImageSelect = useCallback((imageDataUrl: string) => {
    setRawImage(imageDataUrl)
    setStage('crop')
    setError('')
  }, [])

  const handleCropComplete = useCallback(async (croppedDataUrl: string) => {
    setCroppedImage(croppedDataUrl)
    setStage('processing')
    try {
      // apiKey bisa kosong — server akan pakai default key
      const result = await transcribeReceipt(croppedDataUrl, apiKey)
      setFormattedText(result.formattedText)
      setStage('result')
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Terjadi kesalahan saat memproses gambar'
      setError(message)
      setStage('upload')
    }
  }, [apiKey])

  const handleReset = useCallback(() => {
    setStage('upload')
    setRawImage('')
    setCroppedImage('')
    setFormattedText('')
    setError('')
  }, [])

  const handleCancelCrop = useCallback(() => {
    setStage('upload')
    setRawImage('')
  }, [])

  return (
    <div className="min-h-dvh bg-noise" style={{ background: 'var(--color-surface-950)' }}>
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Ambient orbs */}
      <div
        className="fixed pointer-events-none animate-glow"
        style={{
          top: '-10%', left: '20%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(255,49,49,0.08) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-5%', right: '15%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(200,20,20,0.05) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            {/* Logo + label */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '7px 14px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <img
                src="/logo-agres.png"
                alt="Agres Logo"
                style={{ width: '22px', height: '22px', objectFit: 'contain' }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
                JAVA & MJP
              </span>
            </div>

            {/* Settings button */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setShowSettings(true)}
              style={{
                position: 'relative',
                width: '42px', height: '42px',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                backdropFilter: 'blur(12px)',
                color: 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Show dot only if custom key is set (to indicate it's active) */}
              {apiKey && (
                <span
                  className="absolute"
                  style={{
                    top: '-4px', right: '-4px',
                    width: '10px', height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid var(--color-surface-950)',
                    boxShadow: '0 0 6px rgba(16,185,129,0.7)',
                  }}
                />
              )}
              <svg style={{ width: '17px', height: '17px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,100,100,0.9) 60%, #ff3131 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Laporan JAVA & MJP
            </h1>
          </div>
        </motion.header>

        {/* ── Error ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              style={{ marginBottom: '20px' }}
            >
              <div
                className="glass"
                style={{
                  borderRadius: '16px',
                  padding: '14px 16px',
                  borderColor: 'rgba(255,49,49,0.14)',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,49,49,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg style={{ width: '15px', height: '15px', color: '#ff6464' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#ff8080', marginBottom: '2px' }}>Terjadi Kesalahan</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-word' }}>{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', flexShrink: 0 }}
                >
                  <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <AnimatePresence mode="wait">
          <div key={stage}>
            {stage === 'upload' && <ImageUploader onImageSelect={handleImageSelect} />}

            {stage === 'crop' && rawImage && (
              <ImageCropper
                imageSrc={rawImage}
                onCropComplete={handleCropComplete}
                onCancel={handleCancelCrop}
              />
            )}

            {stage === 'processing' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="glass-card-elevated"
                style={{ borderRadius: '24px' }}
              >
                <LoadingSpinner
                  text="Mengekstrak data dari nota..."
                  subtext="AI sedang membaca gambar"
                />
              </motion.div>
            )}

            {stage === 'result' && croppedImage && formattedText && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TranscriptionResult
                  croppedImage={croppedImage}
                  formattedText={formattedText}
                  onTextChange={setFormattedText}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleReset}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '11px 22px',
                      borderRadius: '14px',
                      fontSize: '13.5px',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                      cursor: 'pointer',
                    }}
                  >
                    <svg style={{ width: '15px', height: '15px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    Upload Nota Baru
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* ── Warning Banner ── */}
        <div style={{ marginTop: '2.5rem' }}>
          <WarningBanner />
        </div>

        {/* ── Footer ── */}
        <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '11px', color: 'rgba(255,255,255,0.14)', letterSpacing: '0.03em' }}>
          Laporan JAVA & MJP
        </p>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  )
}
