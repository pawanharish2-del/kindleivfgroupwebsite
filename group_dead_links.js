const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://kindlewombivfgroup.com';

function walkHtml(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walkHtml(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const allHtmlFiles = walkHtml('.');
const fileSet = new Set(allHtmlFiles.map(f => path.normalize(f).replace(/\\/g, '/')));

function resolveUrlToFile(fromFile, url) {
  if (!url || url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('javascript:')) {
    return { valid: true };
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.startsWith(DOMAIN)) return { valid: true };
    url = url.replace(DOMAIN, '');
    if (url === '' || url === '/') return { valid: fs.existsSync('index.html') };
    if (url.startsWith('/')) url = url.slice(1);
  }

  const cleanUrl = url.split('#')[0].split('?')[0];
  if (!cleanUrl) return { valid: true };

  const fromDir = path.dirname(fromFile).replace(/\\/g, '/');
  let candidate1 = path.posix.normalize(path.posix.join(fromDir, cleanUrl));
  if (candidate1.startsWith('./')) candidate1 = candidate1.slice(2);
  let candidateRoot = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;

  const candidates = [
    candidate1,
    candidate1 + '.html',
    candidateRoot,
    candidateRoot + '.html'
  ];

  for (const c of candidates) {
    const norm = path.normalize(c).replace(/\\/g, '/');
    if (fileSet.has(norm) || fs.existsSync(norm)) {
      return { valid: true };
    }
  }

  return { valid: false, cleanUrl };
}

let deadMap = {};

allHtmlFiles.forEach(file => {
  const normFile = path.normalize(file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    const res = resolveUrlToFile(normFile, href);
    if (!res.valid) {
      deadMap[href] = (deadMap[href] || 0) + 1;
    }
  }
});

console.log('=== DISTINCT DEAD LINK PATTERNS ===');
for (const [target, count] of Object.entries(deadMap)) {
  console.log(`${target} -> ${count} occurrences`);
}
