const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

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

// Copy IBM Plex fonts from @cai-ds/tokens
const fontsDir = path.join(root, 'node_modules', '@cai-ds', 'tokens', 'dist', 'fonts');
if (fs.existsSync(fontsDir)) {
  copyDir(fontsDir, publicDir);
  console.log('Fonts copied to public/');
}

// Copy sources-cloud assets to public/ so they're accessible at base URL
const scDir = path.join(root, 'landing', 'src', 'components', 'sources-cloud');
for (const file of ['sources-cloud.html', 'sources-cloud.css']) {
  const src = path.join(scDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, file));
  }
}
console.log('sources-cloud assets copied to public/');
