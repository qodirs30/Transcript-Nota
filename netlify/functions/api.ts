/**
 * Netlify Serverless Function — Laporan JAVA & MJP API
 *
 * Wraps the Express app with serverless-http.
 * All /api/* requests are redirected here by netlify.toml.
 * Local dev still uses server/ with tsx (separate process).
 */

import serverless from 'serverless-http'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'

// ─── Types ────────────────────────────────────────────────────

interface ReceiptData {
  date: string
  invoiceNumber: string
  name: string
  address: string
  phone: string
  email: string
  unit: string
  serialNumber: string
  price: string
  bonus: string[]
  paymentMethod: string
  salesPerson: string
}

interface AppError extends Error {
  statusCode?: number
}

// ─── Gemini Prompt ────────────────────────────────────────────

const EXTRACTION_PROMPT = `Kamu adalah asisten AI yang sangat akurat untuk mengekstrak data dari foto struk/nota penjualan.

Analisis gambar struk ini dengan teliti dan ekstrak informasi berikut. Kembalikan hasilnya dalam format JSON yang valid.

Field yang harus diekstrak:
- "date": Tanggal transaksi (format: DD Month YYYY, contoh: "13 May 2026"). Gunakan format bulan dalam bahasa Inggris.
- "invoiceNumber": Nomor invoice/nota
- "name": Nama pelanggan (tulis HURUF KAPITAL)
- "address": Kota/alamat pelanggan
- "phone": Nomor telepon pelanggan (pastikan lengkap)
- "email": Email pelanggan
- "unit": Nama produk/unit yang dibeli (tulis HURUF KAPITAL, sertakan merek dan tipe lengkap)
- "serialNumber": Nomor seri / SN produk
- "price": Harga dalam format Rupiah (contoh: "Rp15.000.000")
- "bonus": Array berisi item bonus/hadiah (contoh: ["TAS LENOVO-BP210", "MOUSE WIRELESS POLOS"]). Tulis HURUF KAPITAL.
- "paymentMethod": Metode pembayaran (contoh: "BCA", "TUNAI", "MANDIRI")
- "salesPerson": Nama sales/penjual (tulis HURUF KAPITAL)

Rules:
1. Jika sebuah field TIDAK ditemukan di struk, kembalikan string kosong "" untuk field string, atau array kosong [] untuk bonus.
2. JANGAN mengarang data. Hanya kembalikan data yang benar-benar terlihat di gambar.
3. Pastikan nomor telepon, SN, dan harga diekstrak dengan teliti.
4. Kembalikan HANYA JSON yang valid, tanpa markdown, tanpa penjelasan tambahan.

Contoh format output:
{
  "date": "13 May 2026",
  "invoiceNumber": "MJP26050125",
  "name": "TOMMY PHILIANDRIE",
  "address": "Semarang",
  "phone": "085641854466",
  "email": "cvcozyalamkartika@gmail.com",
  "unit": "LENOVO GAMING-LOQ-15-1AID-ESSENTIAL-NO-MOUSE",
  "serialNumber": "SPF5WDYXJ",
  "price": "Rp15.000.000",
  "bonus": ["TAS LENOVO-BP210", "MOUSE WIRELESS POLOS"],
  "paymentMethod": "BCA",
  "salesPerson": "QODIRS"
}`

// ─── Format Receipt ───────────────────────────────────────────

function formatReceipt(data: ReceiptData): string {
  const lines: string[] = []
  lines.push(`📅 Tanggal : ${data.date}`)
  lines.push(`🧾 No Invoice : ${data.invoiceNumber}`)
  lines.push(`👤 Nama : ${data.name}`)
  lines.push(`📍 ${data.address}`)
  lines.push(`📞 NO. ${data.phone}`)
  lines.push(`📧 Email : ${data.email}`)
  lines.push(`💻 Unit : ${data.unit}`)
  lines.push(`🔢 SN : ${data.serialNumber}`)
  lines.push(`💰 Harga : ${data.price}`)

  if (data.bonus.length > 0) {
    lines.push(`🎁 Bonus :`)
    for (const item of data.bonus) {
      lines.push(`• ${item}`)
    }
  } else {
    lines.push(`🎁 Bonus : -`)
  }

  lines.push(`💳 Pembayaran : ${data.paymentMethod}`)
  lines.push(`👨‍💼 Sales : ${data.salesPerson}`)
  return lines.join('\n')
}

// ─── Express App ──────────────────────────────────────────────

const app = express()

// CORS — on Netlify, client and function are on same domain,
// so we allow all origins safely for local testing too.
app.use(cors({ origin: true, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// ─── Health Check ─────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Laporan JAVA & MJP (Serverless)',
    timestamp: new Date().toISOString(),
  })
})

// ─── Transcribe Route ─────────────────────────────────────────

app.post('/api/transcribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageBase64, apiKey: userKey } = req.body

    // Validate image
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      const err = new Error('Data gambar diperlukan (imageBase64).') as AppError
      err.statusCode = 400
      throw err
    }

    // Resolve API key: user custom key → server default key
    const DEFAULT_KEY = process.env.GEMINI_API_KEY || ''
    const resolvedKey = (typeof userKey === 'string' && userKey.trim()) ? userKey.trim() : DEFAULT_KEY

    if (!resolvedKey) {
      const err = new Error('API key Gemini diperlukan. Masukkan API key di Pengaturan.') as AppError
      err.statusCode = 400
      throw err
    }

    const usingDefault = !userKey || !userKey.trim()
    console.log(`[Transcribe] Using: ${usingDefault ? 'DEFAULT server key' : 'custom user key'}`)
    console.log(`[Transcribe] Image size: ${(imageBase64.length / 1024 / 1024).toFixed(2)} MB`)

    // Extract base64 & mime type
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const mimeMatch  = imageBase64.match(/^data:(image\/\w+);base64,/)
    const mimeType   = mimeMatch ? mimeMatch[1] : 'image/jpeg'

    // Call Gemini
    const ai     = new GoogleGenAI({ apiKey: resolvedKey })
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { text: EXTRACTION_PROMPT },
          { inlineData: { data: base64Data, mimeType } },
        ],
      }],
    })

    const rawText = result.text || ''

    // Parse JSON
    let jsonString = rawText.trim()
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    let parsed: any
    try {
      parsed = JSON.parse(jsonString)
    } catch {
      console.error('[Transcribe] Failed to parse JSON:', rawText)
      throw new Error('Gagal memproses respons AI. Pastikan gambar nota jelas dan coba lagi.')
    }

    const receiptData: ReceiptData = {
      date:          parsed.date          || '',
      invoiceNumber: parsed.invoiceNumber || '',
      name:          parsed.name          || '',
      address:       parsed.address       || '',
      phone:         parsed.phone         || '',
      email:         parsed.email         || '',
      unit:          parsed.unit          || '',
      serialNumber:  parsed.serialNumber  || '',
      price:         parsed.price         || '',
      bonus:         Array.isArray(parsed.bonus) ? parsed.bonus : [],
      paymentMethod: parsed.paymentMethod || '',
      salesPerson:   parsed.salesPerson   || '',
    }

    const formattedText = formatReceipt(receiptData)
    console.log('[Transcribe] Success!')

    res.json({ formattedText, rawText })

  } catch (err: any) {
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key not valid')) {
      err.statusCode = 401
      err.message = 'API Key Gemini tidak valid. Periksa kembali API key Anda.'
    } else if (err.message?.includes('RATE_LIMIT') || err.status === 429) {
      err.statusCode = 429
      err.message = 'Batas penggunaan API tercapai. Tambahkan API key custom di Pengaturan, atau coba lagi nanti.'
    }
    next(err)
  }
})

// ─── Error Handler ────────────────────────────────────────────

app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message    = err.message    || 'Internal server error'
  console.error(`[ERROR] ${statusCode}: ${message}`)
  res.status(statusCode).json({ error: message, statusCode })
})

// ─── Export handler ───────────────────────────────────────────

export const handler = serverless(app)
