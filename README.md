# Laporan JAVA & MJP

Modern web-based receipt transcription tool powered by Google Gemini AI. Upload or paste photos of physical receipts, automatically extract key information, and get WhatsApp-ready formatted text.

## Features

- 🤖 **AI-Powered OCR**: Uses Google Gemini to extract receipt data
- ✂️ **Image Cropping**: Built-in crop tool for precise receipt selection
- 📋 **WhatsApp Format**: Output formatted perfectly for WhatsApp sharing
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Glassmorphism design with smooth animations

## Quick Start

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Development

```bash
# Start backend server
cd server
npm install
npm run dev

# Start frontend (in a new terminal)
cd client
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS v4 + Motion
- **Backend**: Express.js + TypeScript
- **AI**: Google Gemini 1.5 Flash
