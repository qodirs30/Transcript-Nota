import { useState, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { getHistory, clearHistory } from '../utils/historyStorage'
import type { ReceiptHistory } from '../utils/historyStorage'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

export default function HistoryPage({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<ReceiptHistory[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClear = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua history?')) {
      clearHistory()
      setHistory([])
    }
  }

  // Calculate Sales by Month
  const salesData = useMemo(() => {
    const monthlyMap: Record<string, number> = {}
    history.forEach(item => {
      // Very naive date parsing, assume "DD Month YYYY" like "13 May 2026"
      const parts = item.date.split(' ')
      if (parts.length >= 2) {
        const monthYear = `${parts[1]} ${parts[2] || ''}`.trim()
        monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + 1
      }
    })
    
    return Object.entries(monthlyMap).map(([name, sales]) => ({ name, sales }))
  }, [history])

  // Calculate Brand Analysis
  const brandData = useMemo(() => {
    const brandMap: Record<string, number> = {}
    history.forEach(item => {
      const unit = item.unit.toUpperCase()
      let brand = 'Lainnya'
      if (unit.includes('LENOVO')) brand = 'Lenovo'
      else if (unit.includes('ASUS')) brand = 'Asus'
      else if (unit.includes('HP')) brand = 'HP'
      else if (unit.includes('AXIOO')) brand = 'Axioo'
      else if (unit.includes('ACER')) brand = 'Acer'
      else if (unit.includes('MSI')) brand = 'MSI'
      else if (unit.includes('APPLE') || unit.includes('MAC')) brand = 'Apple'
      
      brandMap[brand] = (brandMap[brand] || 0) + 1
    })

    return Object.entries(brandMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [history])

  return (
    <div className="min-h-dvh bg-noise w-full overflow-hidden" style={{ background: 'var(--color-surface-950)' }}>
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      
      <div className="relative z-10 w-full mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-12" style={{ maxWidth: '1800px' }}>
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/50"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                History & Analytics
              </h1>
              <p className="text-white/40 text-sm mt-1">Data penjualan tersimpan di browser Anda</p>
            </div>
          </div>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-red-400 text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="glass-card-elevated p-6 rounded-2xl">
            <h2 className="text-white/80 font-semibold mb-6">Penjualan Bulanan (Total Transaksi)</h2>
            <div className="h-64 w-full">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                    />
                    <Bar dataKey="sales" fill="#ff3131" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  Belum ada data
                </div>
              )}
            </div>
          </div>

          {/* Brand Analysis Chart */}
          <div className="glass-card-elevated p-6 rounded-2xl">
            <h2 className="text-white/80 font-semibold mb-6">Analisis Brand Laptop</h2>
            <div className="h-64 w-full flex items-center justify-center">
              {brandData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={brandData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                  Belum ada data
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="glass-card-elevated rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-white/80 font-semibold">Riwayat Transaksi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/60">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Tanggal</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Invoice</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Pelanggan</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap min-w-[200px]">Unit</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Harga</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Sales</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 text-white/80">{item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.salesPerson}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-white/30">
                      Belum ada data riwayat transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
