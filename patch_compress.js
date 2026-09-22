const fs = require('fs');
let code = fs.readFileSync('client/src/components/ImageUploader.tsx', 'utf8');

const oldProcess = `  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onImageSelect(reader.result)
    }
    reader.readAsDataURL(file)
  }, [onImageSelect])`;

const newProcess = `  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const MAX_WIDTH = 1200
      const MAX_HEIGHT = 1200
      
      let width = img.width
      let height = img.height
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width))
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height))
          height = MAX_HEIGHT
        }
      }
      
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        // Kompresi jadi JPEG dengan kualitas 70% biar cepat upload & AI nggak timeout
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        onImageSelect(compressedDataUrl)
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') onImageSelect(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') onImageSelect(reader.result)
      }
      reader.readAsDataURL(file)
    }
    img.src = url
  }, [onImageSelect])`;

code = code.replace(oldProcess, newProcess);
fs.writeFileSync('client/src/components/ImageUploader.tsx', code);
console.log('Patched ImageUploader!');
