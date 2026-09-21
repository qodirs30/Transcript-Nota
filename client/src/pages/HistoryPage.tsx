import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ArrowLeft, Trash2, Filter, ChevronDown, Palette, X, Calendar, CreditCard, User } from 'lucide-react'
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
  const [filterTime, setFilterTime] = useState<string>('All')
  const [filterBrand, setFilterBrand] = useState<string>('All')
  const [openColorPickerId, setOpenColorPickerId] = useState<string | null>(null)
  const [selectedBrandForModal, setSelectedBrandForModal] = useState<string | null>(null)

  const getBrandColor = (brandName: string, index: number) => {
    if (brandName === 'Lenovo') return '#ef4444' // Red for Lenovo
    if (brandName === 'Asus') return '#3b82f6'
    if (brandName === 'HP') return '#10b981'
    if (brandName === 'Axioo') return '#f59e0b'
    if (brandName === 'Acer') return '#8b5cf6'
    if (brandName === 'MSI') return '#ec4899'
    return PIE_COLORS[index % PIE_COLORS.length]
  }
  
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
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      let matchTime = true;
      if (filterTime === 'Hari Ini') matchTime = now - item.timestamp < oneDay;
      else if (filterTime === 'Minggu Ini') matchTime = now - item.timestamp < 7 * oneDay;
      else if (filterTime === 'Bulan Ini') matchTime = now - item.timestamp < 30 * oneDay;
      else if (filterTime === 'Tahun Ini') matchTime = now - item.timestamp < 365 * oneDay;
      
      const matchBrand = filterBrand === 'All' || getBrand(item.unit) === filterBrand
      return matchTime && matchBrand
    })
  }, [history, filterTime, filterBrand])

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

  const incentiveData = useMemo(() => {
    let spCount = 0
    let garskinCount = 0
    filteredHistory.forEach(item => {
      if (item.hasScreenProtector) spCount++
      if (item.hasGarskin) garskinCount++
    })
    return {
      spCount,
      garskinCount,
      total: (spCount * 20000) + (garskinCount * 20000)
    }
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
      
      <div className="relative z-10 w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-20 py-8 lg:py-12 max-w-6xl">
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
          
          </header>

        {/* Action Bar (Filters & Clear) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-[24px]">
          <div className="flex flex-wrap items-center gap-2 pl-2">
            <div className="flex items-center gap-2 text-white/50 text-sm font-medium mr-2">
              <Filter size={16} />
            </div>
            <div className="relative">
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {['All', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((t) => (
                  <option key={t} value={t} className="bg-neutral-900">{t === 'All' ? 'Waktu: Semua' : t}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {availableBrands.map(b => (
                  <option key={b} value={b} className="bg-neutral-900">{b === 'All' ? 'Brand: Semua' : b}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
          
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-red-400 text-sm font-medium mr-1"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>

        {/* Incentive Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.05 }}
          className="glass-card-elevated p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-emerald-500/20 mb-8"
          style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 100%)' }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-white/90 font-semibold text-lg tracking-tight mb-1">Estimasi Insentif (SP & Garskin)</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300">
                  Screen Protector: <b className="text-emerald-400">{incentiveData.spCount}</b>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300">
                  Garskin: <b className="text-emerald-400">{incentiveData.garskinCount}</b>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">
                Rp {incentiveData.total.toLocaleString('id-ID')}
              </div>
              <div className="text-white/40 text-xs mt-1 uppercase tracking-wider font-medium">Estimasi Cair Akhir Bulan</div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Sales Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.1 }}
            className="glass-card-elevated p-4 sm:p-6 lg:p-8 rounded-[2rem] relative overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight">Tren Penjualan Bulanan</h2>
            <div className="h-64 w-full pb-4">
              {salesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }}
                      contentStyle={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                      itemStyle={{ color: '#fff', fontWeight: 500 }}
                      position={{ y: -10 }}
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

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springConfig, delay: 0.2 }}
            className="glass-card-elevated p-4 sm:p-6 lg:p-8 rounded-[2rem] relative overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
            <h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight">Distribusi Brand</h2>
            <div className="h-72 w-full relative flex flex-col items-center justify-center pb-2">
              {brandData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={brandData}
                        cx="50%"
                        cy="45%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={6}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={6}
                      >
                        {brandData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getBrandColor(entry.name, index)} 
                            onClick={() => setSelectedBrandForModal(entry.name)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                        itemStyle={{ color: '#fff', fontWeight: 500 }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', paddingTop: '20px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Central Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[36px]">
                    <span className="text-3xl font-bold text-white/90">{filteredHistory.length}</span>
                    <span className="text-[11px] uppercase tracking-wider text-white/50 font-medium mt-0.5">Total</span>
                  </div>
                </>
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
          className="glass-card-elevated rounded-[2rem] overflow-hidden relative border border-white/10"
        >
          <div className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white/90 font-semibold text-xl tracking-tight">Data Transaksi ({filteredHistory.length})</h2>
          </div>
          
          
          {/* Card List View (Universal for Mobile & Desktop) */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={springConfig}
                  key={item.id} 
                  className="p-5 sm:p-6 rounded-[20px] bg-neutral-900/40 border border-zinc-800/60 hover:bg-neutral-900/60 transition-colors flex flex-col gap-3"
                >
                  {/* Baris 1: Nama Customer (kiri) & Nominal Harga (kanan, bold/highlight) */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="text-white/95 font-semibold text-base sm:text-lg">{item.name || 'Customer Tanpa Nama'}</div>
                    <div className="text-emerald-400 font-bold text-base sm:text-lg shrink-0">{item.price || 'Rp 0'}</div>
                  </div>
                  
                  {/* Baris 2: Tanggal Transaksi & Metode Pembayaran (muted text) */}
                  <div className="flex justify-between items-center text-white/40 text-[13px] sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{item.date} • {item.invoiceNumber || 'No Invoice'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={14} />
                      <span>{item.paymentMethod || '-'}</span>
                    </div>
                  </div>
                  
                  {/* Baris 3: Tipe Unit / Laptop (tag/teks sekunder yang jelas) */}
                  <div className="mt-1">
                    <div className="inline-block bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/70 text-[13px] sm:text-sm font-medium">
                      {item.unit || 'Unit tidak diketahui'}
                    </div>
                  </div>
                  
                  {/* Baris 4: Info Sales & Action Icons (pojok kanan bawah) */}
                  <div className="flex items-end justify-between mt-2 pt-4 border-t border-zinc-800/60">
                    <div className="text-white/50 text-[13px] flex items-center gap-2">
                      <User size={14} />
                      Sales: <span className="text-white/80 font-medium">{item.salesPerson || '-'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all text-red-400"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="py-16 text-center text-white/40 font-medium text-sm">
                  Tidak ada transaksi yang sesuai filter.
                </div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>

      {/* Brand Detail Modal */}
      <AnimatePresence>
        {selectedBrandForModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBrandForModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-xl font-semibold text-white">Data Penjualan: <span style={{ color: getBrandColor(selectedBrandForModal, 0) }}>{selectedBrandForModal}</span></h3>
                <button onClick={() => setSelectedBrandForModal(null)} className="p-2 rounded-full hover:bg-white/10 text-white/50 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {filteredHistory.filter(item => getBrand(item.unit) === selectedBrandForModal).map(item => (
                  <div key={item.id} className="mb-4 last:mb-0 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-medium">{item.unit}</div>
                        <div className="text-white/50 text-sm mt-1">{item.date} • {item.invoiceNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-semibold">{item.price}</div>
                      </div>
                    </div>
                    {item.bonus.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <span className="text-xs text-white/40 uppercase tracking-wider block mb-1">Bonus:</span>
                        <p className="text-white/70 text-sm">{item.bonus.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
                {filteredHistory.filter(item => getBrand(item.unit) === selectedBrandForModal).length === 0 && (
                   <div className="text-center text-white/40 py-8">Tidak ada data.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
