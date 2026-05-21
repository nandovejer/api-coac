const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', '@cai-ds', 'tokens', 'dist', 'fonts');
const dest = path.join(__dirname, '..', 'public');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(src)) {
  copyDir(src, dest);
  console.log('Fonts copied to public/');
}
