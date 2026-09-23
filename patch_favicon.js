const fs = require('fs');
let html = fs.readFileSync('client/index.html', 'utf8');

html = html.replace(
  '<link rel="icon" type="image/x-icon" href="/logo-agres.ico" />',
  '<link rel="icon" type="image/png" href="/logo-agres.png" />'
);

fs.writeFileSync('client/index.html', html);
console.log('Updated index.html to use PNG favicon');
