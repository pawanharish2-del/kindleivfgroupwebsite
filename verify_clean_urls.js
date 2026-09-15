const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING CLEAN URLS ACROSS ENTIRE PROJECT ===');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = walk('.');
let issues = {
  canonicalWithHtml: [],
  ogUrlWithHtml: [],
  schemaWithHtml: [],
  sitemapWithHtml: [],
  internalHrefWithHtml: []
};

htmlFiles.forEach(file => {
  const norm = file.replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');

  // 1. Canonical
  const canMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canMatch && canMatch[1].endsWith('.html')) {
    issues.canonicalWithHtml.push({ file: norm, url: canMatch[1] });
  }

  // 2. og:url
  const ogMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  if (ogMatch && ogMatch[1].endsWith('.html')) {
    issues.ogUrlWithHtml.push({ file: norm, url: ogMatch[1] });
  }

  // 3. schema
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    if (/"url"\s*:\s*"https:\/\/kindlewombivfgroup\.com\/[^"]+?\.html"/i.test(match[1])) {
      issues.schemaWithHtml.push(norm);
    }
  }

  // 4. href with .html
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(content)) !== null) {
    const href = hrefMatch[1];
    if (href.endsWith('.html') && !href.startsWith('http://') && !href.startsWith('https://external') && !norm.startsWith('google')) {
      // Ignore external or specialized files
      issues.internalHrefWithHtml.push({ file: norm, href });
    }
  }
});

// Check sitemap
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapLocs = sitemap.match(/<loc>[^<]+<\/loc>/g) || [];
sitemapLocs.forEach(loc => {
  if (loc.includes('.html')) {
    issues.sitemapWithHtml.push(loc);
  }
});

console.log('--- CLEAN URL VERIFICATION RESULTS ---');
console.log(`1. Canonical tags with .html: ${issues.canonicalWithHtml.length}`);
console.log(`2. og:url tags with .html: ${issues.ogUrlWithHtml.length}`);
console.log(`3. Schema JSON-LD with .html: ${issues.schemaWithHtml.length}`);
console.log(`4. Sitemap URLs with .html: ${issues.sitemapWithHtml.length}`);
console.log(`5. Internal href links with .html: ${issues.internalHrefWithHtml.length}`);

if (issues.internalHrefWithHtml.length > 0) {
  console.log('Sample hrefs with .html:', issues.internalHrefWithHtml.slice(0, 10));
}
