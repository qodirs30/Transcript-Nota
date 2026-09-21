const fs = require('fs');
let code = fs.readFileSync('client/src/pages/HistoryPage.tsx', 'utf8');

// Replace tracking-tight with ml-2 for breathing room
code = code.replace(
  'h2 className="text-white/90 font-semibold text-lg tracking-tight mb-1"',
  'h2 className="text-white/90 font-semibold text-lg mb-1 ml-1"'
);
code = code.replace(
  'h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight"',
  'h2 className="text-white/90 font-semibold mb-6 text-lg ml-1"'
);
code = code.replace(
  'h2 className="text-white/90 font-semibold mb-6 text-lg tracking-tight"',
  'h2 className="text-white/90 font-semibold mb-6 text-lg ml-1"'
);
code = code.replace(
  'h2 className="text-white/90 font-semibold text-xl tracking-tight"',
  'h2 className="text-white/90 font-semibold text-xl ml-1"'
);

fs.writeFileSync('client/src/pages/HistoryPage.tsx', code);
console.log('Patched headings!');
