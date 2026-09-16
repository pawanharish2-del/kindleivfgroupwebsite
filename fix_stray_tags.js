const fs = require('fs');
const path = require('path');

console.log('=== REMOVING STRAY >> CHARACTERS ACROSS ALL FILES ===');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (f !== 'node_modules' && !f.startsWith('.')) res = res.concat(walk(full));
    } else if (f.endsWith('.html')) res.push(full);
  });
  return res;
}

const files = walk('.');
let fixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace double >> in meta tags or elsewhere
  content = content.replaceAll('.png">>', '.png">');
  content = content.replaceAll('.jpg">>', '.jpg">');
  content = content.replaceAll('.webp">>', '.webp">');
  content = content.replaceAll('.avif">>', '.avif">');
  content = content.replaceAll('>>', '>');

  // Also clean twitter tags in gallery.html
  if (file.includes('gallery')) {
    content = content.replaceAll('https://kindlewombivfgroup.com/gallery.html', 'https://kindlewombivfgroup.com/gallery');
    content = content.replaceAll('/images/gallery/gallery2 (3).avif', 'https://kindlewombivfgroup.com/images/best-ivf-center-jaipur.jpg');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    fixed++;
    console.log(`Fixed stray > in ${file}`);
  }
});

console.log(`Stray characters successfully removed from ${fixed} files.`);
