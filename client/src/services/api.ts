import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60 seconds for AI processing
})

export interface TranscribeResponse {
  formattedText: string
  rawText: string
}

/**
 * Send a cropped receipt image to the backend for AI transcription.
 * 
 * @param imageBase64 - The base64-encoded image data URL
 * @param apiKey - User's Google Gemini API key
 */
export async function transcribeReceipt(
  imageBase64: string,
  apiKey: string
): Promise<TranscribeResponse> {
  const response = await api.post<TranscribeResponse>('/transcribe', {
    imageBase64,
    apiKey,
  })
  return response.data
}

/**
 * Check if the backend server is healthy.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await api.get('/health')
    return response.status === 200
  } catch {
    return false
  }
}
