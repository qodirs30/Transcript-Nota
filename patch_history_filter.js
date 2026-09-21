const fs = require('fs');

const p = 'client/src/pages/HistoryPage.tsx';
let content = fs.readFileSync(p, 'utf8');

// Replace state
content = content.replace("const [filterMonth, setFilterMonth] = useState<string>('All')", "const [filterTime, setFilterTime] = useState<string>('All')");

// Replace uniqueMonths definition
content = content.replace(/const uniqueMonths = useMemo\(\(\) => \{\n    const months = new Set\(history\.map\(item => getMonthYear\(item\.date\)\)\)\n    return \['All', \.\.\.Array\.from\(months\)\]\n  \}, \[history\]\)/g, "");

// Replace filteredHistory useMemo
const oldFilter = `  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchMonth = filterMonth === 'All' || getMonthYear(item.date) === filterMonth
      const matchBrand = filterBrand === 'All' || getBrand(item.unit) === filterBrand
      return matchMonth && matchBrand
    })
  }, [history, filterMonth, filterBrand])`;

const newFilter = `  const filteredHistory = useMemo(() => {
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
  }, [history, filterTime, filterBrand])`;

content = content.replace(oldFilter, newFilter);

// Replace UI dropdown for Month with Time
const oldSelect = `<select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {uniqueMonths.map((m) => (
                  <option key={m} value={m} className="bg-neutral-900">{m === 'All' ? 'Bulan: Semua' : m}</option>
                ))}
              </select>`;

const newSelect = `<select 
                value={filterTime} 
                onChange={(e) => setFilterTime(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {['All', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((t) => (
                  <option key={t} value={t} className="bg-neutral-900">{t === 'All' ? 'Waktu: Semua' : t}</option>
                ))}
              </select>`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync(p, content, 'utf8');
