import { useState } from 'react'
import { motion } from 'motion/react'
import Modal from './ui/Modal'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export default function SettingsModal({ isOpen, onClose, apiKey, onApiKeyChange }: SettingsModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [localKey, setLocalKey] = useState(apiKey)

  // Sync when modal opens
  const handleModalOpen = () => setLocalKey(apiKey)

  const handleSave = () => {
    onApiKeyChange(localKey.trim())
    onClose()
  }

  const handleClearCustomKey = () => {
    setLocalKey('')
    onApiKeyChange('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} allowClose={true}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px',
            background: 'rgba(255,49,49,0.1)',
            border: '1px solid rgba(255,49,49,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg style={{ width: '20px', height: '20px', color: '#ff7070' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Pengaturan</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Konfigurasi API Gemini</p>
          </div>
        </div>

        {/* Status: Default key */}
        <div style={{
          background: apiKey ? 'rgba(255,255,255,0.02)' : 'rgba(16,185,129,0.04)',
          border: apiKey ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(16,185,129,0.14)',
          borderRadius: '14px',
          padding: '13px 15px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '11px',
        }}>
          {/* Status icon */}
          <div style={{
            width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
            background: apiKey ? 'rgba(255,255,255,0.04)' : 'rgba(16,185,129,0.1)',
            border: apiKey ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(16,185,129,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg style={{ width: '13px', height: '13px', color: apiKey ? 'rgba(255,255,255,0.3)' : '#34d399' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {apiKey
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '12.5px', fontWeight: 600, color: apiKey ? 'rgba(255,255,255,0.45)' : '#34d399', marginBottom: '3px' }}>
              {apiKey ? 'Menggunakan API Key Custom' : 'API Default Aktif'}
            </p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.4 }}>
              {apiKey
                ? 'Key kustom kamu aktif dan tersimpan. Akan dipakai sebagai prioritas utama.'
                : 'Langsung bisa dipakai tanpa isi API key. Jika limit, tambahkan key kustom di bawah.'}
            </p>
          </div>
        </div>

        {/* Custom API Key input */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '14px 15px',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '11px' }}>
            <svg style={{ width: '12px', height: '12px', color: 'rgba(255,100,100,0.6)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>API Key Custom (opsional)</span>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={isVisible ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="Kosongkan untuk pakai API default"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '11px',
                padding: '11px 14px',
                paddingRight: '92px',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'Inter, system-ui, sans-serif',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,49,49,0.3)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button
              onClick={() => setIsVisible(!isVisible)}
              style={{
                position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '11px', fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '7px',
                padding: '4px 9px',
                cursor: 'pointer',
              }}
            >
              {isVisible ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          <p style={{ marginTop: '9px', fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
            Key tersimpan otomatis di browser.{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,100,100,0.6)', textDecoration: 'none' }}>
              Buat API key gratis →
            </a>
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.975 }}
            onClick={handleSave}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '14px',
              fontWeight: 600, fontSize: '14px', color: 'white',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #ff3131 0%, #c80d0d 100%)',
              border: '1px solid rgba(255,80,80,0.2)',
              boxShadow: '0 6px 20px rgba(255,49,49,0.25), inset 0 1px 0 rgba(255,255,255,0.16)',
            }}
          >
            Simpan
          </motion.button>

          {/* Only show reset if there's a custom key */}
          {apiKey && (
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              onClick={handleClearCustomKey}
              style={{
                width: '100%', padding: '11px',
                borderRadius: '14px',
                fontWeight: 500, fontSize: '13px',
                color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              Hapus key custom, pakai API default
            </motion.button>
          )}
        </div>
      </div>
    </Modal>
  )
}
