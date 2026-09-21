const fs = require('fs');

let tCode = fs.readFileSync('client/src/pages/TranscriptionPage.tsx', 'utf8');
tCode = tCode.replace(/paddingLeft: '24px'/g, "paddingLeft: '16px'");
tCode = tCode.replace(/paddingRight: '24px'/g, "paddingRight: '16px'");
fs.writeFileSync('client/src/pages/TranscriptionPage.tsx', tCode);

let aCode = fs.readFileSync('client/src/pages/AuthGatePage.tsx', 'utf8');
aCode = aCode.replace(/paddingLeft: '24px'/g, "paddingLeft: '16px'");
aCode = aCode.replace(/paddingRight: '24px'/g, "paddingRight: '16px'");
fs.writeFileSync('client/src/pages/AuthGatePage.tsx', aCode);

console.log('Patched others!');
