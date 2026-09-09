export interface ReceiptHistory {
  id: string
  date: string
  invoiceNumber: string
  name: string
  address: string
  phone: string
  email: string
  unit: string
  serialNumber: string
  price: string
  bonus: string[]
  paymentMethod: string
  salesPerson: string
  timestamp: number
  color?: string // Added color for item tagging
}

const STORAGE_KEY = 'laporan_gemini_history'

export function getHistory(): ReceiptHistory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveToHistory(receipt: Omit<ReceiptHistory, 'id' | 'timestamp'>): void {
  try {
    const history = getHistory()
    const newEntry: ReceiptHistory = {
      ...receipt,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }
    history.unshift(newEntry) // Add to the beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Gagal menyimpan history ke local storage', error)
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory()
    const filtered = history.filter(item => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Gagal menghapus item history', error)
  }
}

export function updateHistoryItemColor(id: string, color: string): void {
  try {
    const history = getHistory()
    const updated = history.map(item => item.id === id ? { ...item, color } : item)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Gagal mengupdate warna item history', error)
  }
}
