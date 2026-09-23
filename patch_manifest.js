const fs = require('fs');
let html = fs.readFileSync('client/index.html', 'utf8');

if (!html.includes('manifest.json')) {
  html = html.replace(
    '<link rel="apple-touch-icon" href="/logo-agres.png" />',
    '<link rel="apple-touch-icon" href="/logo-agres.png" />\n    <link rel="manifest" href="/manifest.json" />'
  );
  fs.writeFileSync('client/index.html', html);
  console.log('Added manifest.json to index.html');
}
