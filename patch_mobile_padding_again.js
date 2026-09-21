const fs = require('fs');

const pages = [
  'client/src/pages/HistoryPage.tsx',
  'client/src/pages/TranscriptionPage.tsx',
  'client/src/pages/AuthGatePage.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace px-4 sm:px-6 md:px-10 lg:px-16 with px-6 sm:px-8 md:px-12 lg:px-20
  content = content.replace(/px-4 sm:px-6 md:px-10 lg:px-16/g, 'px-6 sm:px-8 md:px-12 lg:px-20');
  
  fs.writeFileSync(p, content, 'utf8');
}
