import { useState, useRef, useCallback } from 'react'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { motion } from 'motion/react'
import { getCroppedImage } from '../utils/cropImage'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImageDataUrl: string) => void
  onCancel: () => void
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  const handleConfirmCrop = useCallback(async () => {
    if (!imgRef.current || !completedCrop) {
      onCropComplete(imageSrc)
      return
    }
    try {
      const croppedDataUrl = await getCroppedImage(imgRef.current, completedCrop)
      onCropComplete(croppedDataUrl)
    } catch (err) {
      console.error('Crop failed:', err)
      onCropComplete(imageSrc)
    }
  }, [completedCrop, imageSrc, onCropComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22 }}
      className="glass-card-elevated"
      style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative' }}
    >
      {/* Top specular */}
      <div
        style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        }}
      />

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(255,49,49,0.08)',
            border: '1px solid rgba(255,49,49,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg style={{ width: '15px', height: '15px', color: 'rgba(255,80,80,0.8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48 0l.136.046M16.539 9.137l-2.077 1.199M16.539 14.863l-2.077-1.199" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>Crop Gambar</h3>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Pilih area nota atau langsung konfirmasi</p>
          </div>
        </div>
      </div>

      {/* Crop area */}
      <div style={{ padding: '16px', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ borderRadius: '14px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '55vh' }}>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)}>
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Gambar untuk crop"
              style={{ maxHeight: '52vh', maxWidth: '100%', width: 'auto', display: 'block' }}
            />
          </ReactCrop>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', padding: '14px 20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCancel}
          style={{
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            flex: '0 0 auto',
          }}
        >
          Batal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.975 }}
          onClick={handleConfirmCrop}
          style={{
            flex: 1,
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'white',
            background: 'linear-gradient(135deg, #ff3131 0%, #c80d0d 100%)',
            border: '1px solid rgba(255,80,80,0.2)',
            boxShadow: '0 6px 18px rgba(255,49,49,0.22), inset 0 1px 0 rgba(255,255,255,0.15)',
            cursor: 'pointer',
          }}
        >
          Konfirmasi & Proses
        </motion.button>
      </div>
    </motion.div>
  )
}
