import { Router } from 'express'
import { validateApiKey } from '../middleware/validateApiKey'
import { transcribeController } from '../controllers/transcribeController'

export const transcribeRouter = Router()

/**
 * POST /api/transcribe
 * 
 * Request body:
 *   - imageBase64: string (base64-encoded data URL of the receipt image)
 *   - apiKey: string (user's Google Gemini API key)
 * 
 * Response:
 *   - formattedText: string (WhatsApp-ready formatted text)
 *   - rawText: string (raw text from Gemini)
 */
transcribeRouter.post('/transcribe', validateApiKey, transcribeController)
