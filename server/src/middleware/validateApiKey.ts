import { Request, Response, NextFunction } from 'express'
import { config } from '../config'

let keyIndex = 0

/**
 * Validates API key presence.
 * - If user sends a custom apiKey → use it
 * - If no apiKey sent but server has defaultGeminiKeys → use server default (round-robin)
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

  const keys = config.defaultGeminiKeys
  if (keys && keys.length > 0) {
    // Fallback to server's built-in keys with round-robin rotation
    const selectedKey = keys[keyIndex % keys.length]
    // Log key rotation for debugging
    console.log(`[Rotation] Using API key index ${keyIndex % keys.length + 1} of ${keys.length}`)
    
    keyIndex = (keyIndex + 1) % keys.length
    req.body.apiKey = selectedKey
    req.body.usingDefaultKey = true
    next()
    return
  }

  // No key available at all
  const error = new Error('API key Gemini diperlukan. Masukkan API key di Pengaturan.') as any
  error.statusCode = 400
  next(error)
}

