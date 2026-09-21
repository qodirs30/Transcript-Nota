const fs = require('fs');
let code = fs.readFileSync('client/src/pages/HistoryPage.tsx', 'utf8');

// Change padding to 16px
code = code.replace(/paddingLeft: '24px'/g, "paddingLeft: '16px'");
code = code.replace(/paddingRight: '24px'/g, "paddingRight: '16px'");

// Make header bulletproof
code = code.replace(
  '<header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">',
  '<header className="flex flex-col sm:flex-row sm:items-center justify-between" style={{ gap: "24px", marginBottom: "40px" }}>'
);
code = code.replace(
  '<div className="flex items-center gap-4">',
  '<div className="flex items-center" style={{ gap: "16px" }}>'
);

// Make Action Bar bulletproof
code = code.replace(
  '<div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-[24px]">',
  '<div className="flex flex-wrap items-center justify-between bg-white/5 border border-white/10 p-2 rounded-[24px]" style={{ gap: "16px", marginBottom: "32px" }}>'
);
code = code.replace(
  '<div className="flex flex-wrap items-center gap-2 pl-2">',
  '<div className="flex flex-wrap items-center pl-2" style={{ gap: "8px" }}>'
);

// Make Incentive Card bulletproof
code = code.replace(
  '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">',
  '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center" style={{ gap: "16px" }}>'
);
code = code.replace(
  '<div className="flex flex-wrap gap-2 mt-2">',
  '<div className="flex flex-wrap mt-2" style={{ gap: "8px", marginTop: "8px" }}>'
);

// Make Charts grid bulletproof
code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">',
  '<div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "24px", marginBottom: "40px" }}>'
);

// Make card list bulletproof
code = code.replace(
  '<div className="p-4 sm:p-6 lg:p-8 space-y-3">',
  '<div className="p-4 sm:p-6 lg:p-8" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>'
);

// Make individual history card bulletproof
code = code.replace(
  'className="p-5 sm:p-6 rounded-[20px] bg-neutral-900/40 border border-zinc-800/60 hover:bg-neutral-900/60 transition-colors flex flex-col gap-3"',
  'className="p-5 sm:p-6 rounded-[20px] bg-neutral-900/40 border border-zinc-800/60 hover:bg-neutral-900/60 transition-colors flex flex-col" style={{ gap: "12px" }}'
);
code = code.replace(
  '<div className="flex justify-between items-start gap-4">',
  '<div className="flex justify-between items-start" style={{ gap: "16px" }}>'
);

fs.writeFileSync('client/src/pages/HistoryPage.tsx', code);
console.log('Patched HistoryPage!');
