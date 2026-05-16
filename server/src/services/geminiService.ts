import { GoogleGenAI } from '@google/genai'

/** Raw receipt data extracted by Gemini */
export interface ReceiptData {
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

/**
 * Extraction prompt for Gemini — instructs the model to return structured JSON.
 */
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

/**
 * Calls Google Gemini API to extract receipt data from an image.
 * Uses the new @google/genai SDK with gemini-2.5-flash model.
 */
export async function extractReceiptData(
  imageBase64: string,
  apiKey: string
): Promise<{ receiptData: ReceiptData; rawText: string }> {
  // Create client with user's API key (new SDK pattern)
  const ai = new GoogleGenAI({ apiKey })

  // Strip the data URL prefix to get raw base64
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
  
  // Detect MIME type from data URL
  const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'

  // Call Gemini using the new SDK API
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: EXTRACTION_PROMPT },
          {
            inlineData: {
              data: base64Data,
              mimeType,
            },
          },
        ],
      },
    ],
  })

  const rawText = result.text || ''

  // Parse the JSON response
  let receiptData: ReceiptData

  try {
    // Try to extract JSON from the response (handle potential markdown wrapping)
    let jsonString = rawText.trim()
    
    // Remove markdown code block if present
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const parsed = JSON.parse(jsonString)

    receiptData = {
      date: parsed.date || '',
      invoiceNumber: parsed.invoiceNumber || '',
      name: parsed.name || '',
      address: parsed.address || '',
      phone: parsed.phone || '',
      email: parsed.email || '',
      unit: parsed.unit || '',
      serialNumber: parsed.serialNumber || '',
      price: parsed.price || '',
      bonus: Array.isArray(parsed.bonus) ? parsed.bonus : [],
      paymentMethod: parsed.paymentMethod || '',
      salesPerson: parsed.salesPerson || '',
    }
  } catch (parseErr) {
    console.error('[GeminiService] Failed to parse JSON response:', rawText)
    throw new Error('Gagal memproses respons AI. Pastikan gambar struk jelas dan coba lagi.')
  }

  return { receiptData, rawText }
}
