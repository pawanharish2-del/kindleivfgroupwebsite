const fs = require('fs');
const path = require('path');

const CANONICAL_DOMAIN = 'https://kindlewombivfgroup.com';
const OLD_DOMAIN = 'kindlewombivfgroup5.com';

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

const allHtml = walk('.');
console.log(`=== FULL RE-AUDIT PASS: ANALYZING ${allHtml.length} HTML PAGES ===`);

const report = {
  totalFiles: allHtml.length,
  oldDomainOccurrences: 0,
  oldDomainFiles: [],
  missingCanonical: [],
  canonicalMismatch: [],
  missingTitle: [],
  duplicateTitles: {},
  missingDescription: [],
  missingH1: [],
  multipleH1: [],
  invalidSchema: [],
  schemaWithOldDomain: [],
  imagesWithoutAlt: [],
  brokenLinks: [],
  formsWithoutActionOrHandler: [],
  phoneCtaIssues: []
};

const titleRegistry = {};
const allHtmlSet = new Set(allHtml.map(f => f.replace(/\\/g, '/').replace(/^\.\//, '')));

allHtml.forEach(file => {
  const normFile = file.replace(/\\/g, '/').replace(/^\.\//, '');
  const content = fs.readFileSync(file, 'utf8');
  const isSnippet = (normFile === 'header.html' || normFile === 'footer.html' || normFile.startsWith('google') || normFile.includes('template.html'));

  // 1. Old domain check
  if (content.includes(OLD_DOMAIN)) {
    report.oldDomainOccurrences++;
    report.oldDomainFiles.push(normFile);
  }

  if (isSnippet) return;

  // 2. Canonical check
  const canMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i) ||
                   content.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  if (!canMatch) {
    if (normFile !== '404.html') {
      report.missingCanonical.push(normFile);
    }
  } else {
    const canUrl = canMatch[1];
    if (!canUrl.startsWith(CANONICAL_DOMAIN)) {
      report.canonicalMismatch.push({ file: normFile, url: canUrl });
    }
  }

  // 3. Title check
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    report.missingTitle.push(normFile);
  } else {
    const t = titleMatch[1].trim();
    if (!titleRegistry[t]) titleRegistry[t] = [];
    titleRegistry[t].push(normFile);
  }

  // 4. Description check
  const descMatch = content.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                    content.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  if (!descMatch || !descMatch[1].trim()) {
    if (normFile !== '404.html') {
      report.missingDescription.push(normFile);
    }
  }

  // 5. H1 check
  const h1Matches = content.match(/<h1[\s>]/gi);
  if (!h1Matches) {
    report.missingH1.push(normFile);
  } else if (h1Matches.length > 1) {
    report.multipleH1.push({ file: normFile, count: h1Matches.length });
  }

  // 6. Schema check
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const rawJson = match[1];
    try {
      const parsed = JSON.parse(rawJson);
      const str = JSON.stringify(parsed);
      if (str.includes(OLD_DOMAIN)) {
        report.schemaWithOldDomain.push(normFile);
      }
    } catch (e) {
      report.invalidSchema.push({ file: normFile, error: e.message });
    }
  }

  // 7. Image alt check
  const imgRegex = /<img\s+([^>]*?)>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const imgAttrs = imgMatch[1];
    if (!/alt\s*=\s*["'][^"']*["']/i.test(imgAttrs)) {
      report.imagesWithoutAlt.push({ file: normFile, tag: imgMatch[0].slice(0, 60) });
    }
  }

  // 8. Link check
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let hrefMatch;
  while ((hrefMatch = hrefRegex.exec(content)) !== null) {
    const href = hrefMatch[1];
    if (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }
    // relative link resolution
    const fileDir = path.dirname(normFile);
    let targetPath = path.posix.normalize(path.posix.join(fileDir, href.split('#')[0].split('?')[0]));
    if (targetPath.startsWith('/')) targetPath = targetPath.slice(1);

    if (targetPath && targetPath.endsWith('.html') && !allHtmlSet.has(targetPath)) {
      report.brokenLinks.push({ source: normFile, target: href, resolved: targetPath });
    }
  }
});

// Check title duplicates
for (const [title, files] of Object.entries(titleRegistry)) {
  if (files.length > 1) {
    report.duplicateTitles[title] = files;
  }
}

console.log('----------------------------------------------------');
console.log('RE-AUDIT RESULTS:');
console.log(`1. Old Domain Occurrences: ${report.oldDomainOccurrences}`);
console.log(`2. Missing Canonical Tags: ${report.missingCanonical.length}`);
console.log(`3. Canonical Domain Mismatches: ${report.canonicalMismatch.length}`);
console.log(`4. Missing Titles: ${report.missingTitle.length}`);
console.log(`5. Duplicate Title Groups: ${Object.keys(report.duplicateTitles).length}`);
console.log(`6. Missing Meta Descriptions: ${report.missingDescription.length}`);
console.log(`7. Missing H1: ${report.missingH1.length}`);
console.log(`8. Multiple H1s: ${report.multipleH1.length}`);
console.log(`9. Invalid Schema JSON-LD: ${report.invalidSchema.length}`);
console.log(`10. Schema with Old Domain: ${report.schemaWithOldDomain.length}`);
console.log(`11. Images without Alt: ${report.imagesWithoutAlt.length}`);
console.log(`12. Broken Relative HTML Links: ${report.brokenLinks.length}`);
console.log('----------------------------------------------------');

if (report.brokenLinks.length > 0) {
  console.log('Broken link details:', report.brokenLinks.slice(0, 10));
}
if (Object.keys(report.duplicateTitles).length > 0) {
  console.log('Duplicate titles:', report.duplicateTitles);
}
if (report.invalidSchema.length > 0) {
  console.log('Invalid schema details:', report.invalidSchema);
}
if (report.oldDomainFiles.length > 0) {
  console.log('Old domain files:', report.oldDomainFiles);
}

fs.writeFileSync('final_audit_report.json', JSON.stringify(report, null, 2));
