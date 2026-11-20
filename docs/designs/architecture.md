# System Architecture - Laporan JAVA & MJP

## Overview
This project is a full-stack application designed to transcribe physical receipts/notes into digital text using AI. It uses a modern web frontend and a lightweight Node.js backend.

## System Components

### 1. Frontend (client/)
- **Framework**: React with Vite.
- **Styling**: Tailwind CSS v4.
- **Animations**: Framer Motion for smooth transitions and Glassmorphism effects.
- **Key Features**:
  - Image upload and paste support.
  - Client-side image cropping using `react-image-crop` (implied).
  - Real-time transcription display.
  - One-click "Copy to WhatsApp" functionality.

### 2. Backend (server/)
- **Framework**: Express.js with TypeScript.
- **Architecture**: Service-oriented MVC.
  - **Routes**: Defines API endpoints (`/api/transcribe`, `/api/health`).
  - **Controllers**: Handles request logic and orchestrates services.
  - **Services**: `geminiService.ts` handles communication with Google AI.
  - **Utils**: `formatReceipt.ts` for post-processing the AI output into a clean format.
- **Security**: Basic API key validation and CORS configuration.

### 3. AI Integration
- **Engine**: Google Gemini 1.5 Flash.
- **Input**: Base64 encoded images sent from the frontend.
- **Prompting**: Structured prompts to ensure consistent extraction of items, prices, and totals.

### 4. Deployment
- **Platform**: Vercel and Netlify support.
- **Environment**: Root level `vercel.json` and `netlify.toml` for deployment configuration.
- **Serverless**: `api/index.ts` acts as the entry point for Vercel Serverless Functions.

## Data Flow
1. User uploads/pastes an image in the React Frontend.
2. User crops the image to focus on the receipt.
3. Frontend sends the base64 image data to the Backend API (`POST /api/transcribe`).
4. Backend Controller receives the image and calls `geminiService`.
5. `geminiService` calls Google Gemini API with the image and a specific prompt.
6. Gemini returns a JSON or structured text response.
7. Backend formats the response for WhatsApp using `formatReceipt` util.
8. Frontend displays the result and allows the user to copy it.

## Environment Variables
- `GEMINI_API_KEY`: Required for AI features.
- `PORT`: (Optional) Port for the backend server.
- `CORS_ORIGIN`: (Optional) Allowed origins for CORS.
