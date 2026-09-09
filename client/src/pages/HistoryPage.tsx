import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft, Trash2, Filter, ChevronDown, Palette } from 'lucide-react'
import { getHistory, clearHistory, deleteHistoryItem, updateHistoryItemColor } from '../utils/historyStorage'
import type { ReceiptHistory } from '../utils/historyStorage'

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']
const ITEM_COLORS = [
  { id: 'default', value: 'transparent' },
  { id: 'red', value: 'rgba(239, 68, 68, 0.15)' },
  { id: 'blue', value: 'rgba(59, 130, 246, 0.15)' },
  { id: 'green', value: 'rgba(16, 185, 129, 0.15)' },
  { id: 'yellow', value: 'rgba(245, 158, 11, 0.15)' },
  { id: 'purple', value: 'rgba(139, 92, 246, 0.15)' },
]

const springConfig = { type: 'spring', bounce: 0, duration: 0.4 }

const getMonthYear = (dateStr: string) => {
  const parts = dateStr.split(' ')
  if (parts.length >= 2) return `${parts[1]} ${parts[2] || ''}`.trim()
  return 'Lainnya'
}

const getBrand = (unitStr: string) => {
  const unit = (unitStr || '').toUpperCase()
  if (unit.includes('LENOVO')) return 'Lenovo'
  if (unit.includes('ASUS')) return 'Asus'
  if (unit.includes('HP')) return 'HP'
  if (unit.includes('AXIOO')) return 'Axioo'
  if (unit.includes('ACER')) return 'Acer'
  if (unit.includes('MSI')) return 'MSI'
  if (unit.includes('APPLE') || unit.includes('MAC')) return 'Apple'
  return 'Lainnya'
}

export default function HistoryPage({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<ReceiptHistory[]>([])
  const [filterMonth, setFilterMonth] = useState<string>('All')
  const [filterBrand, setFilterBrand] = useState<string>('All')
  const [openColorPickerId, setOpenColorPickerId] = useState<string | null>(null)
  
  // Responsive check
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua history?')) {
      clearHistory()
      setHistory([])
    }
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Hapus riwayat ini?')) {
      deleteHistoryItem(id)
      setHistory(getHistory())
    }
  }

  const handleChangeColor = (id: string, color: string) => {
    updateHistoryItemColor(id, color)
    setHistory(getHistory())
    setOpenColorPickerId(null)
  }

  // Derive filter options
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    history.forEach(item => months.add(getMonthYear(item.date)))
    return ['All', ...Array.from(months)]
  }, [history])

  const availableBrands = useMemo(() => {
    const brands = new Set<string>()
    history.forEach(item => brands.add(getBrand(item.unit)))
    return ['All', ...Array.from(brands)]
  }, [history])

  // Filter data
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchMonth = filterMonth === 'All' || getMonthYear(item.date) === filterMonth
      const matchBrand = filterBrand === 'All' || getBrand(item.unit) === filterBrand
      return matchMonth && matchBrand
    })
  }, [history, filterMonth, filterBrand])

  // Analytics based on FILTERED data
  const salesData = useMemo(() => {
    const monthlyMap: Record<string, number> = {}
    filteredHistory.forEach(item => {
      const my = getMonthYear(item.date)
      monthlyMap[my] = (monthlyMap[my] || 0) + 1
    })
    return Object.entries(monthlyMap).map(([name, sales]) => ({ name, sales }))
  }, [filteredHistory])

  const brandData = useMemo(() => {
    const brandMap: Record<string, number> = {}
    filteredHistory.forEach(item => {
      const brand = getBrand(item.unit)
      brandMap[brand] = (brandMap[brand] || 0) + 1
    })
    return Object.entries(brandMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredHistory])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={springConfig}
      className="min-h-dvh w-full overflow-y-auto bg-noise pb-24" 
      style={{ background: 'var(--color-surface-950)' }}
    >
      <div className="fixed inset-0 bg-mesh pointer-events-none opacity-50" />
      
      <div className="relative z-10 w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-12 py-8 lg:py-12 max-w-[1400px]">
        {/* Header - Apple Style Translucent Bar behavior could be added, but static is fine here */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-white/70"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Analisis Data
              </h1>
              <p className="text-white/50 text-sm mt-1 font-medium">Dashboard riwayat penjualan lokal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all text-red-400 text-sm font-medium"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-white/50 text-sm font-medium mr-2">
            <Filter size={16} /> Filter:
          </div>
          <div className="relative">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              {availableMonths.map(m => (
                <option key={m} value={m} className="bg-neutral-900">{m === 'All' ? 'Semua Bulan' : m}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer backdrop-blur-md"
            >
              {availableBrands.map(b => (
                <option key={b} value={b} className="bg-neutral-900">{b === 'All' ? 'Semua Brand' : b}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Sales Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.1 }}
            className="glass-card-elevated p-6 lg:p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight">Tren Penjualan Bulanan</h2>
            <div className="h-64 w-full">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }}
                      contentStyle={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                      itemStyle={{ color: '#fff', fontWeight: 500 }}
                    />
                    <Bar dataKey="sales" name="Transaksi" fill="rgba(255, 255, 255, 0.8)" radius={[6, 6, 6, 6]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-medium">
                  Belum ada data
                </div>
              )}
            </div>
          </motion.div>

          {/* Brand Analysis Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.2 }}
            className="glass-card-elevated p-6 lg:p-8 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight">Distribusi Brand</h2>
            <div className="h-64 w-full flex items-center justify-center">
              {brandData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={brandData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={6}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={6}
                    >
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                      itemStyle={{ color: '#fff', fontWeight: 500 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-sm font-medium">
                  Belum ada data
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* History List/Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.3 }}
          className="glass-card-elevated rounded-3xl overflow-hidden relative"
        >
          <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white/90 font-semibold text-lg tracking-tight">Data Transaksi ({filteredHistory.length})</h2>
          </div>
          
          {isMobile ? (
            // Mobile Card View
            <div className="p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={springConfig}
                    key={item.id} 
                    className="p-6 rounded-[24px] border border-white/5 relative flex flex-col gap-1"
                    style={{ backgroundColor: item.color && item.color !== 'transparent' ? item.color : 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <div className="text-white/95 font-medium text-base mb-1.5 leading-snug">{item.name}</div>
                        <div className="text-white/50 text-[13px] leading-tight">{item.date}</div>
                        <div className="text-white/50 text-[13px] leading-tight mt-0.5">{item.invoiceNumber}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-white/90 font-semibold text-base">{item.price}</div>
                        <div className="text-white/50 text-[13px] mt-1">{item.paymentMethod}</div>
                      </div>
                    </div>
                    
                    <div className="text-white/75 text-[14px] leading-relaxed mb-3 bg-black/20 p-3.5 rounded-[16px] border border-white/5 mt-1 inline-block w-fit">
                      {item.unit}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                      <div className="text-white/50 text-[13px]">Sales: <span className="text-white/80 font-medium">{item.salesPerson}</span></div>
                      
                      <div className="flex items-center gap-2 relative">
                        <button 
                          onClick={() => setOpenColorPickerId(openColorPickerId === item.id ? null : item.id)}
                          className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-white/60"
                        >
                          <Palette size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Color Picker Popover */}
                        <AnimatePresence>
                          {openColorPickerId === item.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.9 }}
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                              className="absolute bottom-full right-0 mb-2 p-2 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex gap-2 z-20"
                            >
                              {ITEM_COLORS.map(color => (
                                <button
                                  key={color.id}
                                  onClick={() => handleChangeColor(item.id, color.value)}
                                  className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all"
                                  style={{ background: color.id === 'default' ? '#333' : color.value.replace('0.15', '1') }}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="py-12 text-center text-white/40 font-medium text-sm">
                    Tidak ada transaksi yang sesuai filter.
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // Desktop Table View
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="text-white/50 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Tanggal & Invoice</th>
                    <th className="px-6 py-4 font-medium">Pelanggan</th>
                    <th className="px-6 py-4 font-medium min-w-[250px]">Unit</th>
                    <th className="px-6 py-4 font-medium">Harga & Pembayaran</th>
                    <th className="px-6 py-4 font-medium">Sales</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={springConfig}
                        key={item.id} 
                        className="group border-b border-white/5 hover:bg-white/[0.02] transition-colors relative"
                        style={{ backgroundColor: item.color && item.color !== 'transparent' ? item.color : '' }}
                      >
                        <td className="px-6 py-4">
                          <div className="text-white/90 font-medium">{item.date}</div>
                          <div className="text-white/40 text-xs mt-1">{item.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white/90">{item.name}</div>
                          <div className="text-white/40 text-xs mt-1 truncate max-w-[150px]">{item.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white/80 line-clamp-2">{item.unit}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white/90 font-medium">{item.price}</div>
                          <div className="text-white/40 text-xs mt-1">{item.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-white/80">{item.salesPerson}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button 
                              onClick={() => setOpenColorPickerId(openColorPickerId === item.id ? null : item.id)}
                              className="p-2.5 rounded-full bg-white/0 group-hover:bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white/40 group-hover:text-white/80"
                            >
                              <Palette size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2.5 rounded-full bg-white/0 group-hover:bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-transparent group-hover:text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>

                            {/* Color Picker Popover */}
                            <AnimatePresence>
                              {openColorPickerId === item.id && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                                  className="absolute bottom-full right-0 mb-2 p-2 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl flex gap-2 z-20"
                                >
                                  {ITEM_COLORS.map(color => (
                                    <button
                                      key={color.id}
                                      onClick={() => handleChangeColor(item.id, color.value)}
                                      className="w-8 h-8 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-all"
                                      style={{ background: color.id === 'default' ? '#333' : color.value.replace('0.15', '1') }}
                                    />
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="text-white/40 font-medium">Tidak ada transaksi yang sesuai filter.</div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
