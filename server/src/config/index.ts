import dotenv from 'dotenv'
dotenv.config()

const getKeys = (): string[] => {
  const keys: string[] = []
  // Check for numbered API keys (e.g. GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.)
  for (let i = 1; i <= 10; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]
    if (key?.trim()) {
      keys.push(key.trim())
    }
  }

  // Fallback to comma-separated GEMINI_API_KEY
  if (keys.length === 0 && process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY.split(',').forEach(k => {
      const trimmed = k.trim()
      if (trimmed) keys.push(trimmed)
    })
  }

  return keys
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  // Allow localhost (dev) + semua IP jaringan lokal (akses dari HP)
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : true,  // true = allow semua origin (aman untuk local dev)
  defaultGeminiKeys: getKeys(),
  maxImageSizeMB: 10,
}

