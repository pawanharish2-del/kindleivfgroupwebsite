const fs = require('fs');
const path = require('path');

console.log('=== REMOVING .HTML EXTENSION ACROSS ENTIRE PROJECT (CLEAN URLS) ===');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walk(full));
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.xml') || file === '.htaccess') {
      results.push(full);
    }
  });
  return results;
}

const allFiles = walk('.');
console.log(`Processing ${allFiles.length} files...`);

let modifiedFiles = 0;

allFiles.forEach(file => {
  // Skip this script itself and git files
  if (file.includes('clean_urls.js')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Canonical tags: strip .html
  content = content.replace(/(<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)\.html(["'][^>]*>)/gi, '$1$2');
  content = content.replace(/(<link\s+[^>]*href=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)\.html(["'][^>]*rel=["']canonical["'][^>]*>)/gi, '$1$2');

  // 2. Open Graph og:url
  content = content.replace(/(<meta\s+property=["']og:url["']\s+content=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)\.html(["'])/gi, '$1$2');

  // 3. Twitter url
  content = content.replace(/(<meta\s+name=["']twitter:url["']\s+content=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)\.html(["'])/gi, '$1$2');

  // 4. JSON-LD URLs: "url": "https://kindlewombivfgroup.com/...html" or "@id": "...html"
  content = content.replace(/("url"\s*:\s*"https:\/\/kindlewombivfgroup\.com\/[^"]+?)\.html(")/gi, '$1$2');
  content = content.replace(/("@id"\s*:\s*"https:\/\/kindlewombivfgroup\.com\/[^"]+?)\.html(")/gi, '$1$2');

  // 5. Internal links in href attributes
  // Absolute URLs with domain
  content = content.replace(/(href=["']https:\/\/kindlewombivfgroup\.com\/[^"'\?#]+?)\.html([#\?][^"']*)?(["'])/gi, '$1$2$3');

  // Relative URLs: href="about.html", href="../ivf.html", href="location-pages/xxx.html", href="posts/xxx.html"
  // Make sure not to touch external links or asset links like image.jpg
  content = content.replace(/href=["']((?:\.\.\/|\.\/)?(?:location-pages\/|posts\/)?[a-zA-Z0-9_\-]+)\.html([#\?][^"']*)?["']/gi, (match, p1, p2) => {
    const hash = p2 || '';
    return `href="${p1}${hash}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles++;
  }
});

console.log(`Clean URL conversion applied to ${modifiedFiles} files.`);
