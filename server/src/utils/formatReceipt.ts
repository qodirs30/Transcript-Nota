import type { ReceiptData } from '../services/geminiService'

/**
 * Formats extracted receipt data into the precise WhatsApp-ready string format.
 * Uses emojis and specific formatting as specified in the requirements.
 */
export function formatReceipt(data: ReceiptData): string {
  const lines: string[] = []

  lines.push(`📅 Tanggal : ${data.date}`)
  lines.push(`🧾 No Invoice : ${data.invoiceNumber}`)
  lines.push(`👤 Nama : ${data.name}`)
  lines.push(`📍 ${data.address}`)
  lines.push(`📞 NO. ${data.phone}`)
  lines.push(`📧 Email : ${data.email}`)
  lines.push(`💻 Unit : ${data.unit}`)
  lines.push(`🔢 SN : ${data.serialNumber}`)
  lines.push(`💰 Harga : ${data.price}`)

  // Bonus section with bullet points
  if (data.bonus.length > 0) {
    lines.push(`🎁 Bonus :`)
    for (const item of data.bonus) {
      lines.push(`• ${item}`)
    }
  } else {
    lines.push(`🎁 Bonus : -`)
  }

  lines.push(`💳 Pembayaran : ${data.paymentMethod}`)
  lines.push(`👨‍💼 Sales : ${data.salesPerson}`)

  return lines.join('\n')
}
