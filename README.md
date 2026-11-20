# 🧾 Laporan JAVA & MJP

Alat transkripsi struk berbasis web modern yang didukung oleh **Google Gemini AI**. Unggah atau tempel foto struk fisik, ekstrak informasi penting secara otomatis, dan dapatkan teks yang sudah diformat siap dibagikan di WhatsApp.

---

## 🚀 Fitur

*   🤖 **OCR Bertenaga AI**: Menggunakan Google Gemini 1.5 Flash untuk ekstraksi data akurat.
*   ✂️ **Pemotongan Gambar**: Alat pemotongan bawaan untuk pemilihan area struk yang presisi.
*   📋 **Format WhatsApp**: Output teks otomatis diformat khusus untuk dibagikan ke WhatsApp.
*   📱 **Desain Responsif**: Tampilan optimal di desktop, tablet, maupun ponsel.
*   🎨 **Antarmuka Modern**: Desain *Glassmorphism* dengan Framer Motion & Tailwind CSS v4.

---

## 📂 Struktur Project

- `client/`: Frontend React (Vite, TS, Tailwind v4).
- `server/`: Backend Express.js (TypeScript, API Logic).
- `api/`: Entry point untuk Vercel Serverless Functions.
- `docs/`: Dokumentasi teknis & arsitektur.

---

## 🛠️ Panduan Pengembangan

### Persyaratan
*   **Node.js 18+**
*   **Kunci API Google Gemini** (Dapatkan di [Google AI Studio](https://aistudio.google.com/apikey))

### Variabel Lingkungan (.env)

**Backend (`server/.env`):**
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:3001
```

### Instalasi & Jalankan Lokal

1.  **Backend**
    ```bash
    cd server
    npm install
    npm run dev
    ```

2.  **Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

*   **Frontend**: `http://localhost:5173`
*   **Backend**: `http://localhost:3001`

---

## ☁️ Deployment

Proyek ini siap dideploy ke **Vercel** atau **Netlify**.

### Vercel (Recommended)
Cukup hubungkan repo ke Vercel. Konfigurasi `vercel.json` sudah tersedia di root untuk menghandle *rewrites* dan *serverless functions* di folder `/api`.

### Build Produksi
```bash
# Di root directory
npm run build
```

---

## 🧰 Stack Teknologi

| Bagian | Teknologi |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Express.js, TypeScript |
| **AI Engine** | Google Gemini 1.5 Flash |
| **Deployment** | Vercel, Netlify |

---

## 📄 Dokumentasi Tambahan
Detail arsitektur sistem dapat dilihat di [docs/designs/architecture.md](./docs/designs/architecture.md).

---

## 🚀 Fitur

* 🤖 **OCR Bertenaga AI**: Menggunakan Google Gemini untuk mengekstrak data struk secara akurat.
* ✂️ **Pemotongan Gambar**: Alat pemotongan bawaan untuk pemilihan area struk yang presisi.
* 📋 **Format WhatsApp**: Output teks otomatis diformat khusus untuk dibagikan ke WhatsApp.
* 📱 **Desain Responsif**: Tampilan optimal di desktop, tablet, maupun ponsel.
* 🎨 **Antarmuka Modern**: Desain *Glassmorphism* dengan animasi yang halus menggunakan Framer Motion.

---

## 🛠️ Panduan Cepat

### Persyaratan
* **Node.js 18+**
* **Kunci API Google Gemini** (Dapatkan di [Google AI Studio](https://aistudio.google.com/apikey))

### Pengembangan (Lokal)

1.  **Jalankan Server Backend**
    ```bash
    cd server
    npm install
    npm run dev
    ```

2.  **Jalankan Frontend (di terminal baru)**
    ```bash
    cd client
    npm install
    npm run dev
    ```

* **Frontend**: `http://localhost:5173`
* **Backend**: `http://localhost:3001`

---

## 🧰 Stack Teknologi

| Bagian | Teknologi |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Express.js, TypeScript |
| **AI Engine** | Google Gemini 1.5 Flash |

---

> *Projek ini dibuat untuk mempermudah pencatatan laporan transaksi dari struk fisik ke format digital secara instan.*
