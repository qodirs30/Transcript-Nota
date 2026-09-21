const fs = require('fs');

const pages = [
  'client/src/pages/HistoryPage.tsx',
  'client/src/pages/TranscriptionPage.tsx',
  'client/src/pages/AuthGatePage.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  
  // Replace all instances of `px-8 sm:px-10 md:px-16 lg:px-20` with `px-4 sm:px-6 md:px-10 lg:px-16`
  // History and Transcription have `px-8 sm:px-10 md:px-16 lg:px-20`
  content = content.replace(/px-8 sm:px-10 md:px-16 lg:px-20/g, 'px-4 sm:px-6 md:px-10 lg:px-16');
  
  // AuthGatePage has `px-8 py-8`
  content = content.replace(/px-8 py-8/g, 'px-5 py-6 sm:px-8 sm:py-8');
  
  fs.writeFileSync(p, content, 'utf8');
}
