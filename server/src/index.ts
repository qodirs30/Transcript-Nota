import express from 'express'
import cors from 'cors'
import { config } from './config'
import { transcribeRouter } from './routes/transcribe'
import { healthRouter } from './routes/health'
import { errorHandler } from './middleware/errorHandler'

const app = express()

// ─── CORS ──────────────────────────────────────────────
app.use(cors({
  origin: config.corsOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

// ─── Body Parsing ──────────────────────────────────────
// Increase limit for base64 image payloads
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// ─── Routes ────────────────────────────────────────────
app.use('/api', healthRouter)
app.use('/api', transcribeRouter)

// ─── Error Handler ─────────────────────────────────────
app.use(errorHandler)

// ─── Start Server ──────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 Laporan JAVA & MJP — Backend Server`)
  console.log(`   Running on http://localhost:${config.port}`)
  console.log(`   CORS origins: ${Array.isArray(config.corsOrigins) ? config.corsOrigins.join(', ') : 'all origins (local dev)'}`)
  console.log(`   Health check: http://localhost:${config.port}/api/health\n`)
})

export default app
