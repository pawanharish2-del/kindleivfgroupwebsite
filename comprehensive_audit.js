const fs = require('fs');
const path = require('path');

const CANONICAL_DOMAIN = 'https://kindlewombivfgroup.com';
const OLD_DOMAIN_PATTERN = /kindlewombivfgroup5\.com/gi;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        results = results.concat(walk(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = walk('.');
console.log(`=== AUDIT PASS 1: INSPECTING ${htmlFiles.length} HTML FILES ===`);

let issues = {
  oldDomainFound: [],
  missingCanonical: [],
  nonCanonicalDomainInCanonical: [],
  missingTitle: [],
  duplicateTitles: {},
  missingDescription: [],
  missingH1: [],
  multipleH1: [],
  invalidSchemaJson: [],
  schemaWithOldDomain: [],
  brokenLocalLinks: [],
  imagesWithoutAlt: [],
  missingViewport: [],
  httpResources: []
};

const titlesMap = {};

htmlFiles.forEach(file => {
  const normFile = file.replace(/\\/g, '/');
  // Skip snippet components like header.html and footer.html if they are just templates
  const isComponent = (normFile === 'header.html' || normFile === 'footer.html' || normFile.startsWith('google'));
  const content = fs.readFileSync(file, 'utf8');

  // 1. Old domain check
  if (OLD_DOMAIN_PATTERN.test(content)) {
    const matches = content.match(OLD_DOMAIN_PATTERN);
    issues.oldDomainFound.push({ file: normFile, count: matches.length });
  }

  // 2. Canonical tag
  const canonicalMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
                         content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (!isComponent) {
    if (!canonicalMatch) {
      issues.missingCanonical.push(normFile);
    } else {
      const canonicalUrl = canonicalMatch[1];
      if (!canonicalUrl.startsWith(CANONICAL_DOMAIN)) {
        issues.nonCanonicalDomainInCanonical.push({ file: normFile, url: canonicalUrl });
      }
    }
  }

  // 3. Title tag
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!isComponent) {
    if (!titleMatch || !titleMatch[1].trim()) {
      issues.missingTitle.push(normFile);
    } else {
      const t = titleMatch[1].trim();
      if (!titlesMap[t]) titlesMap[t] = [];
      titlesMap[t].push(normFile);
    }
  }

  // 4. Meta Description
  const descMatch = content.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                    content.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  if (!isComponent) {
    if (!descMatch || !descMatch[1].trim()) {
      issues.missingDescription.push(normFile);
    }
  }

  // 5. H1 check
  const h1Matches = content.match(/<h1[\s>]/gi);
  if (!isComponent) {
    if (!h1Matches) {
      issues.missingH1.push(normFile);
    } else if (h1Matches.length > 1) {
      issues.multipleH1.push({ file: normFile, count: h1Matches.length });
    }
  }

  // 6. Viewport
  if (!isComponent && !content.includes('viewport')) {
    issues.missingViewport.push(normFile);
  }

  // 7. Schema JSON-LD validation
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const rawJson = match[1];
    try {
      const parsed = JSON.parse(rawJson);
      const str = JSON.stringify(parsed);
      if (OLD_DOMAIN_PATTERN.test(str)) {
        issues.schemaWithOldDomain.push(normFile);
      }
    } catch (e) {
      issues.invalidSchemaJson.push({ file: normFile, error: e.message });
    }
  }

  // 8. Images without alt
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const imgAttrs = imgMatch[1];
    if (!/alt\s*=\s*["'][^"']*["']/i.test(imgAttrs)) {
      issues.imagesWithoutAlt.push({ file: normFile, tag: imgMatch[0].slice(0, 50) });
    }
  }

  // 9. HTTP resources
  const httpRegex = /(src|href)=["']http:\/\/(?!localhost|127\.0\.0\.1)([^"']+)["']/gi;
  let httpMatch;
  while ((httpMatch = httpRegex.exec(content)) !== null) {
    issues.httpResources.push({ file: normFile, resource: httpMatch[0] });
  }
});

// Check duplicate titles
for (const [title, files] of Object.entries(titlesMap)) {
  if (files.length > 1) {
    issues.duplicateTitles[title] = files;
  }
}

console.log('--- AUDIT SUMMARY ---');
console.log(`1. Files with old domain (kindlewombivfgroup5.com): ${issues.oldDomainFound.length}`);
console.log(`2. Missing Canonical tags: ${issues.missingCanonical.length}`);
console.log(`3. Non-canonical domain in Canonical tags: ${issues.nonCanonicalDomainInCanonical.length}`);
console.log(`4. Missing Titles: ${issues.missingTitle.length}`);
console.log(`5. Duplicate Titles groups: ${Object.keys(issues.duplicateTitles).length}`);
console.log(`6. Missing Meta Descriptions: ${issues.missingDescription.length}`);
console.log(`7. Missing H1: ${issues.missingH1.length}`);
console.log(`8. Multiple H1s: ${issues.multipleH1.length}`);
console.log(`9. Invalid Schema JSON-LD: ${issues.invalidSchemaJson.length}`);
console.log(`10. Schema with old domain: ${issues.schemaWithOldDomain.length}`);
console.log(`11. Images without Alt: ${issues.imagesWithoutAlt.length}`);
console.log(`12. Missing Viewport: ${issues.missingViewport.length}`);
console.log(`13. HTTP Insecure Resources: ${issues.httpResources.length}`);

fs.writeFileSync('audit_results.json', JSON.stringify(issues, null, 2));
console.log('Detailed issues saved to audit_results.json');
