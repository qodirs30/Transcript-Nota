const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8');
css = css.replace(/textarea, input\[type="text"\], input\[type="password"\] \{/g, 'textarea, input[type="text"], input[type="password"], select {');
css = css.replace(/textarea:focus, input:focus \{/g, 'textarea:focus, input:focus, select:focus {');
fs.writeFileSync('client/src/index.css', css);
