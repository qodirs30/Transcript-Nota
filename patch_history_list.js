const fs = require('fs');
const path = 'client/src/pages/HistoryPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the list view inside HistoryPage.tsx
const newList = `
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
`;

// Replace from `{isMobile ? (` down to the end of the AnimatePresence that wraps the table.
// I will use regex to capture the whole block
const regex = /\{isMobile \? \([\s\S]*?\n\s*\)\s*\}\s*<\/motion\.div>/;
content = content.replace(regex, newList + '\n        </motion.div>');

// Also import Calendar, CreditCard, User from lucide-react
content = content.replace(
  "import { ArrowLeft, Trash2, ChevronDown, Filter, Palette } from 'lucide-react'",
  "import { ArrowLeft, Trash2, ChevronDown, Filter, Calendar, CreditCard, User } from 'lucide-react'"
);

fs.writeFileSync(path, content, 'utf8');
