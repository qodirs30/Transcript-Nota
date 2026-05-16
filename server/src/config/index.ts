import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  // Allow localhost (dev) + semua IP jaringan lokal (akses dari HP)
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : true,  // true = allow semua origin (aman untuk local dev)
  defaultGeminiKey: process.env.GEMINI_API_KEY || '',
  maxImageSizeMB: 10,
}
