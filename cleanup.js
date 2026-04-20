const fs = require('fs');
const path = 'f:/my portfolio/css/style.css';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split(/\r?\n/);
const good = lines.slice(0, 4294).join('\r\n');
fs.writeFileSync(path, good, 'utf8');
console.log('Done. Lines reduced from', lines.length, 'to 4294');
