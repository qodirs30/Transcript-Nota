const fs = require('fs');
let code = fs.readFileSync('client/src/pages/HistoryPage.tsx', 'utf8');

// Incentive Card
code = code.replace(
  'className="glass-card-elevated p-5 sm:p-6 rounded-3xl relative overflow-hidden border border-emerald-500/20" style={{ background: "linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 100%)", marginBottom: "32px" }}',
  'className="glass-card-elevated rounded-3xl relative overflow-hidden border border-emerald-500/20" style={{ padding: "24px", background: "linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(0,0,0,0) 100%)", marginBottom: "32px" }}'
);

// Sales Chart Card
code = code.replace(
  'className="glass-card-elevated p-4 sm:p-6 lg:p-8 rounded-[2rem] relative overflow-hidden border border-white/10"',
  'className="glass-card-elevated rounded-[2rem] relative overflow-hidden border border-white/10" style={{ padding: "24px" }}'
);

// Brand Chart Card
code = code.replace(
  'className="glass-card-elevated p-4 sm:p-6 lg:p-8 rounded-[2rem] relative overflow-hidden border border-white/10"',
  'className="glass-card-elevated rounded-[2rem] relative overflow-hidden border border-white/10" style={{ padding: "24px" }}'
);

// Data Transaksi Header
code = code.replace(
  '<div className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8 border-b border-white/5 flex items-center justify-between">',
  '<div className="border-b border-white/5 flex items-center justify-between" style={{ padding: "24px" }}>'
);

// Data Transaksi List Container
code = code.replace(
  '<div className="p-4 sm:p-6 lg:p-8" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>',
  '<div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>'
);

// Individual Transaction Card
code = code.replace(
  'className="p-5 sm:p-6 rounded-[20px] bg-neutral-900/40 border border-zinc-800/60 hover:bg-neutral-900/60 transition-colors flex flex-col" style={{ gap: "12px" }}',
  'className="rounded-[20px] bg-neutral-900/40 border border-zinc-800/60 hover:bg-neutral-900/60 transition-colors flex flex-col" style={{ padding: "24px", gap: "12px" }}'
);

fs.writeFileSync('client/src/pages/HistoryPage.tsx', code);
console.log('Patched card padding!');
