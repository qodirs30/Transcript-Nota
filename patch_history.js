const fs = require('fs');
const path = 'client/src/pages/HistoryPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Move "Clear All" from header to the filter bar
content = content.replace(
  /<div className="flex items-center gap-3">\s*<button\s*onClick=\{handleClearAll\}\s*className="[^"]+"\s*>\s*<Trash2 size=\{16\} \/>\s*Clear All\s*<\/button>\s*<\/div>\s*<\/header>/,
  `</header>`
);

// 2. Refactor Filter Bar to include Clear All and have consistent styling
content = content.replace(
  /{?\/\* Filters \*\/}?[\s\S]*?<div className="flex flex-wrap items-center gap-4 mb-8">[\s\S]*?<\/div>\s*<\/div>/,
  `{/* Action Bar (Filters & Clear) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-[24px]">
          <div className="flex flex-wrap items-center gap-2 pl-2">
            <div className="flex items-center gap-2 text-white/50 text-sm font-medium mr-2">
              <Filter size={16} />
            </div>
            <div className="relative">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {availableMonths.map(m => (
                  <option key={m} value={m} className="bg-neutral-900">{m === 'All' ? 'Bulan: Semua' : m}</option>
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
        </div>`
);

// 3. Card "Estimasi Insentif": Add padding `p-5 sm:p-6` instead of just `p-6 sm:p-8` to be modular.
content = content.replace(
  /className="glass-card-elevated p-6 sm:p-8 rounded-\[2rem\] relative overflow-hidden border border-emerald-500\/20 mb-8"/,
  `className="glass-card-elevated p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-emerald-500/20 mb-8"`
);
// Modular badges for Screen Protector and Garskin
content = content.replace(
  /<div className="text-white\/50 text-sm flex gap-4">\s*<span>Screen Protector: <b className="text-emerald-400">\{incentiveData\.spCount\}<\/b><\/span>\s*<span>Garskin: <b className="text-emerald-400">\{incentiveData\.garskinCount\}<\/b><\/span>\s*<\/div>/,
  `<div className="flex flex-wrap gap-2 mt-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300">
                  Screen Protector: <b className="text-emerald-400">{incentiveData.spCount}</b>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300">
                  Garskin: <b className="text-emerald-400">{incentiveData.garskinCount}</b>
                </div>
              </div>`
);

// 4. Sales Chart and Brand Chart padding
// Add `pb-6` for margin inside chart container so tooltips don't clip.
content = content.replace(
  /<div className="h-64 w-full">/,
  `<div className="h-64 w-full pb-4">`
);

content = content.replace(
  /<div className="h-64 w-full relative flex items-center justify-center">/,
  `<div className="h-72 w-full relative flex flex-col items-center justify-center pb-2">`
);
content = content.replace(
  /wrapperStyle=\{\{ fontSize: '12px', color: 'rgba\(255,255,255,0\.7\)', paddingTop: '10px' \}\}/,
  `wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', paddingTop: '20px' }}`
);

fs.writeFileSync(path, content, 'utf8');
