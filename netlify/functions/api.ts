import { Handler } from '@netlify/functions'
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

// Helper to create responses
const createResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
})

export const handler: Handler = async (event, _context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(204, '')
  }

  try {
    const path = event.path || ''

    // Health Check
    if (event.httpMethod === 'GET' && path.includes('/health')) {
      return createResponse(200, {
        status: 'ok',
        service: 'Laporan JAVA & MJP (Serverless Native)',
        timestamp: new Date().toISOString(),
      })
    }

    // Transcribe
    if (event.httpMethod === 'POST' && path.includes('/transcribe')) {
      // Decode body safely
      let rawBody = event.body || ''
      if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, 'base64').toString('utf8')
      }

      let reqBody: any = {}
      try {
        reqBody = JSON.parse(rawBody)
      } catch (e) {
        return createResponse(400, { error: 'Format body request tidak valid (harus JSON).' })
      }

      const { imageBase64, apiKey: userKey } = reqBody

      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return createResponse(400, { error: 'Data gambar diperlukan (imageBase64).' })
      }

      const DEFAULT_KEY = process.env.GEMINI_API_KEY || ''
      const resolvedKey = (typeof userKey === 'string' && userKey.trim()) ? userKey.trim() : DEFAULT_KEY

      if (!resolvedKey) {
        return createResponse(400, { error: 'API key Gemini diperlukan. Masukkan API key di Pengaturan.' })
      }

      // Extract base64 & mime type
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      const mimeMatch  = imageBase64.match(/^data:(image\/\w+);base64,/)
      const mimeType   = mimeMatch ? mimeMatch[1] : 'image/jpeg'

      // Call Gemini
      const ai = new GoogleGenAI({ apiKey: resolvedKey })
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

      return createResponse(200, {
        formattedText: formatReceipt(receiptData),
        rawText,
      })
    }

    // Not Found
    return createResponse(404, { error: 'Route not found' })

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

    return createResponse(statusCode, { error: message, statusCode })
  }
}
