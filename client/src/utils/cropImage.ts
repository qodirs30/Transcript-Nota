import type { PixelCrop } from 'react-image-crop'

/**
 * Uses an HTML5 Canvas to extract the cropped region from an image element.
 * Returns a base64-encoded data URL of the cropped image.
 */
export async function getCroppedImage(
  image: HTMLImageElement,
  crop: PixelCrop,
  type = 'image/jpeg',
  quality = 0.92
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // Account for device pixel ratio for high-DPI displays
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const pixelCropX = crop.x * scaleX
  const pixelCropY = crop.y * scaleY
  const pixelCropWidth = crop.width * scaleX
  const pixelCropHeight = crop.height * scaleY

  canvas.width = pixelCropWidth
  canvas.height = pixelCropHeight

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    pixelCropX,
    pixelCropY,
    pixelCropWidth,
    pixelCropHeight,
    0,
    0,
    pixelCropWidth,
    pixelCropHeight
  )

  return canvas.toDataURL(type, quality)
}
