import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from '@google/genai'

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
  hasScreenProtector: boolean
  hasGarskin: boolean
}

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
- "hasScreenProtector": true/false (Cek apakah ada "Screen Protector", "Anti Gores", atau "SP" di nota)
- "hasGarskin": true/false (Cek apakah ada "Garskin" atau "Laminasi" di nota)

Rules:
1. Jika sebuah field TIDAK ditemukan di struk, kembalikan string kosong "" untuk field string, atau array kosong [] untuk bonus.
2. JANGAN mengarang data. Hanya kembalikan data yang benar-benar terlihat di gambar.
3. Pastikan nomor telepon, SN, dan harga diekstrak dengan teliti.
4. Kembalikan HANYA JSON yang valid, tanpa markdown, tanpa penjelasan tambahan.`

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const path = req.url || ''

    if (req.method === 'GET' && path.includes('/health')) {
      return res.status(200).json({
        status: 'ok',
        service: 'Laporan JAVA & MJP (Vercel Serverless)',
        timestamp: new Date().toISOString(),
      })
    }

    if (req.method === 'POST' && path.includes('/transcribe')) {
      const { imageBase64, apiKey: userKey } = req.body || {}

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Data gambar diperlukan (imageBase64).' })
      }

      const envKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
      ].filter(Boolean) as string[]

      let resolvedKey = ''
      if (typeof userKey === 'string' && userKey.trim()) {
        resolvedKey = userKey.trim()
      } else if (envKeys.length > 0) {
        resolvedKey = envKeys[Math.floor(Math.random() * envKeys.length)]
      }

      if (!resolvedKey) {
        return res.status(400).json({ error: 'API key Gemini diperlukan. Masukkan API key di Pengaturan.' })
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      const mimeMatch  = imageBase64.match(/^data:(image\/\w+);base64,/)
      const mimeType   = mimeMatch ? mimeMatch[1] : 'image/jpeg'

      let result;
      const ai = new GoogleGenAI({ apiKey: resolvedKey })
      
      try {
        result = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{
            role: 'user',
            parts: [
              { text: EXTRACTION_PROMPT },
              { inlineData: { data: base64Data, mimeType } },
            ],
          }],
        })
      } catch (err: any) {
        console.warn('[FALLBACK] gemini-3.8-flash gagal. Mencoba gemini-3.6-flash...', err.message)
        let fallbackKey = resolvedKey;
        if (!userKey && envKeys.length > 1) {
           const otherKeys = envKeys.filter(k => k !== resolvedKey);
           fallbackKey = otherKeys[Math.floor(Math.random() * otherKeys.length)];
        }
        const fallbackAi = new GoogleGenAI({ apiKey: fallbackKey })
        
        result = await fallbackAi.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{
            role: 'user',
            parts: [
              { text: EXTRACTION_PROMPT },
              { inlineData: { data: base64Data, mimeType } },
            ],
          }],
        })
      }

      const rawText = result.text || ''

      let jsonString = rawText.trim()
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }

      let parsed: any
      try {
        parsed = JSON.parse(jsonString)
      } catch {
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
        hasScreenProtector: Boolean(parsed.hasScreenProtector),
        hasGarskin:    Boolean(parsed.hasGarskin),
      }

      return res.status(200).json({
        formattedText: formatReceipt(receiptData),
        rawText,
        data: receiptData
      })
    }

    return res.status(404).json({ error: 'Route not found' })

  } catch (err: any) {
    console.error('[ERROR]', err)
    let statusCode = 500
    let message = err.message || 'Internal server error'

    if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
      statusCode = 401
      message = 'API Key Gemini tidak valid. Periksa kembali API key Anda.'
    } else if (message.includes('RATE_LIMIT') || err.status === 429) {
      statusCode = 429
      message = 'Batas penggunaan API tercapai. Tambahkan API key custom di Pengaturan, atau coba lagi nanti.'
    }

    return res.status(statusCode).json({ error: message, statusCode })
  }
}
