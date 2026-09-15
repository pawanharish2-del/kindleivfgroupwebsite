const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('.');
let linkTargets = {};

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('javascript:')) {
      linkTargets[href] = (linkTargets[href] || 0) + 1;
    }
  }
});

const jaipurTargets = Object.keys(linkTargets).filter(h => h.includes('jaipur'));
console.log('Jaipur-related links found across site:');
jaipurTargets.forEach(t => console.log(`  ${t} -> ${linkTargets[t]} occurrences`));
