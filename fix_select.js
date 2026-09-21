const fs = require('fs');
let content = fs.readFileSync('client/src/pages/HistoryPage.tsx', 'utf8');

const regex = /<select[\s\S]*?value=\{filterMonth\}[\s\S]*?onChange=\{\(e\) => setFilterMonth\(e\.target\.value\)\}[\s\S]*?<\/select>/;

const newSelect = `<select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="appearance-none bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 text-sm rounded-full pl-4 pr-10 py-2 outline-none transition-all cursor-pointer backdrop-blur-md"
              >
                {['All', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'].map((t) => (
                  <option key={t} value={t} className="bg-neutral-900">{t === 'All' ? 'Waktu: Semua' : t}</option>
                ))}
              </select>`;

content = content.replace(regex, newSelect);
fs.writeFileSync('client/src/pages/HistoryPage.tsx', content);
