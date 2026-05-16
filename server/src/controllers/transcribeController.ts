import { Request, Response, NextFunction } from 'express'
import { extractReceiptData } from '../services/geminiService'
import { formatReceipt } from '../utils/formatReceipt'

/**
 * POST /api/transcribe
 * 
 * Receives a base64-encoded receipt image and user's Gemini API key.
 * Returns formatted text ready for WhatsApp.
 */
export async function transcribeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { imageBase64, apiKey } = req.body

    // Validate image data
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      const error = new Error('Data gambar diperlukan (imageBase64).') as any
      error.statusCode = 400
      throw error
    }

    // Validate that it looks like a data URL or raw base64
    if (!imageBase64.startsWith('data:image/') && imageBase64.length < 100) {
      const error = new Error('Format gambar tidak valid.') as any
      error.statusCode = 400
      throw error
    }

    console.log('[Transcribe] Processing receipt image...')
    console.log(`[Transcribe] Using: ${req.body.usingDefaultKey ? 'DEFAULT server key' : 'custom user key'}`)
    console.log(`[Transcribe] Image data size: ${(imageBase64.length / 1024 / 1024).toFixed(2)} MB`)

    // Call Gemini API
    const { receiptData, rawText } = await extractReceiptData(imageBase64, apiKey)

    // Format into WhatsApp-ready text
    const formattedText = formatReceipt(receiptData)

    console.log('[Transcribe] Successfully extracted and formatted receipt data')

    res.json({
      formattedText,
      rawText,
    })
  } catch (err: any) {
    // Handle specific Gemini API errors
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key not valid')) {
      err.statusCode = 401
      err.message = 'API Key Gemini tidak valid. Periksa kembali API key Anda.'
    } else if (err.message?.includes('RATE_LIMIT_EXCEEDED')) {
      err.statusCode = 429
      err.message = 'Batas penggunaan API tercapai. Coba lagi dalam beberapa menit.'
    } else if (err.message?.includes('SAFETY')) {
      err.statusCode = 400
      err.message = 'Gambar ditolak oleh filter keamanan AI. Coba gambar lain.'
    }

    next(err)
  }
}
