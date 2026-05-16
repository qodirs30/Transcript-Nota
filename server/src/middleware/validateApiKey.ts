import { Request, Response, NextFunction } from 'express'
import { config } from '../config'

/**
 * Validates API key presence.
 * - If user sends a custom apiKey → use it
 * - If no apiKey sent but server has GEMINI_API_KEY → use server default
 * - If neither → reject with 400
 */
export function validateApiKey(req: Request, _res: Response, next: NextFunction): void {
  const userKey = req.body?.apiKey?.trim()

  if (userKey) {
    // User has a custom key — use it
    req.body.apiKey = userKey
    next()
    return
  }

  if (config.defaultGeminiKey) {
    // Fallback to server's built-in key
    req.body.apiKey = config.defaultGeminiKey
    req.body.usingDefaultKey = true
    next()
    return
  }

  // No key available at all
  const error = new Error('API key Gemini diperlukan. Masukkan API key di Pengaturan.') as any
  error.statusCode = 400
  next(error)
}
