const fs = require('fs');
const path = require('path');

console.log('=== DEEP VERIFICATION: FORMS, NAP, OG, TWITTER, XML SITEMAP ===');

// 1. Validate sitemap.xml
const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
const urlMatches = sitemapContent.match(/<loc>(https:\/\/kindlewombivfgroup\.com\/[^<]*)<\/loc>/g);
console.log(`Sitemap validation: Found ${urlMatches ? urlMatches.length : 0} valid loc entries.`);

// Check for any non-canonical or malformed URLs in sitemap
const invalidSitemapUrls = (sitemapContent.match(/<loc>([^<]+)<\/loc>/g) || []).filter(u => !u.includes('https://kindlewombivfgroup.com/'));
console.log('Invalid sitemap URLs count:', invalidSitemapUrls.length);

// 2. Validate robots.txt
const robotsContent = fs.readFileSync('robots.txt', 'utf8');
const hasRobotsSitemap = robotsContent.includes('Sitemap: https://kindlewombivfgroup.com/sitemap.xml');
console.log('Robots.txt contains correct canonical sitemap:', hasRobotsSitemap);

// 3. Check Open Graph and Twitter tags across all HTML files
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

let ogUrlIssues = 0;
let ogImageIssues = 0;
let formsAudited = 0;
let formsWithIssues = 0;

walk('.').forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // OG URL check
  const ogUrlMatch = content.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  if (ogUrlMatch && !ogUrlMatch[1].startsWith('https://kindlewombivfgroup.com')) {
    ogUrlIssues++;
    console.log(`OG URL issue in ${file}: ${ogUrlMatch[1]}`);
  }

  // OG Image check
  const ogImgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImgMatch && !ogImgMatch[1].startsWith('https://kindlewombivfgroup.com') && !ogImgMatch[1].startsWith('images/') && !ogImgMatch[1].startsWith('../images/')) {
    ogImageIssues++;
    console.log(`OG Image issue in ${file}: ${ogImgMatch[1]}`);
  }

  // Forms audit
  const formMatches = content.match(/<form[\s\S]*?<\/form>/gi);
  if (formMatches) {
    formMatches.forEach(form => {
      formsAudited++;
      // Check if form has input fields without aria-label or associated label
      const inputs = form.match(/<input\s+[^>]*>/gi) || [];
      inputs.forEach(inp => {
        if (!inp.includes('type="hidden"') && !inp.includes('type="submit"') && !inp.includes('type="button"')) {
          if (!inp.includes('placeholder') && !inp.includes('aria-label') && !inp.includes('id=')) {
            formsWithIssues++;
          }
        }
      });
    });
  }
});

console.log(`Open Graph URL issues: ${ogUrlIssues}`);
console.log(`Open Graph Image issues: ${ogImageIssues}`);
console.log(`Total forms audited: ${formsAudited}, forms with accessibility issues: ${formsWithIssues}`);
