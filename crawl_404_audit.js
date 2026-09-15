const fs = require('fs');
const path = require('path');

console.log('=== FULL LINK CRAWLER & 404 DETECTION ENGINE ===');

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

console.log(`Auditing ${allHtmlFiles.length} HTML files...`);

function resolveUrlToFile(fromFile, url) {
  if (!url || url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('javascript:')) {
    return { valid: true, type: 'special' };
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.startsWith(DOMAIN)) {
      return { valid: true, type: 'external' };
    }
    url = url.replace(DOMAIN, '');
    if (url === '' || url === '/') {
      return { valid: fs.existsSync('index.html'), targetFile: 'index.html' };
    }
    if (url.startsWith('/')) url = url.slice(1);
  }

  const cleanUrl = url.split('#')[0].split('?')[0];
  if (!cleanUrl) return { valid: true, type: 'hash_or_query' };

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
      return { valid: true, targetFile: norm };
    }
  }

  return { valid: false, fromFile, url, attempted: candidates };
}

let deadLinks = [];
let auditedLinksCount = 0;
let missingImages = [];

allHtmlFiles.forEach(file => {
  const normFile = path.normalize(file).replace(/\\/g, '/');
  let content = fs.readFileSync(file, 'utf8');

  // Strip script and style blocks before checking tags to avoid dynamic template literal false positives
  const markupOnly = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // 1. Audit href links
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(markupOnly)) !== null) {
    const href = match[1];
    auditedLinksCount++;
    const res = resolveUrlToFile(normFile, href);
    if (!res.valid) {
      deadLinks.push({ from: normFile, href, attempted: res.attempted });
    }
  }

  // 2. Audit img src
  const srcRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi;
  let imgMatch;
  while ((imgMatch = srcRegex.exec(markupOnly)) !== null) {
    const src = imgMatch[1];
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) continue;

    const fromDir = path.dirname(normFile).replace(/\\/g, '/');
    let imgPath = path.posix.normalize(path.posix.join(fromDir, src.split('?')[0]));
    if (!fs.existsSync(imgPath)) {
      missingImages.push({ from: normFile, src, resolved: imgPath });
    }
  }
});

// 3. Audit sitemap.xml URLs
const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapLocs = sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || [];
let deadSitemapUrls = [];

sitemapLocs.forEach(locTag => {
  const loc = locTag.replace('<loc>', '').replace('</loc>', '');
  const res = resolveUrlToFile('index.html', loc);
  if (!res.valid) {
    deadSitemapUrls.push(loc);
  }
});

console.log('--- 404 AUDIT RESULTS ---');
console.log(`Total internal href links scanned: ${auditedLinksCount}`);
console.log(`Broken internal links (404s): ${deadLinks.length}`);
console.log(`Missing image files (404s): ${missingImages.length}`);
console.log(`Sitemap URLs checked: ${sitemapLocs.length}`);
console.log(`Broken sitemap URLs (404s): ${deadSitemapUrls.length}`);

if (deadLinks.length > 0) {
  console.log('Dead links found:', deadLinks);
}
if (missingImages.length > 0) {
  console.log('Missing images found:', missingImages);
}
if (deadSitemapUrls.length > 0) {
  console.log('Dead sitemap URLs found:', deadSitemapUrls);
}
