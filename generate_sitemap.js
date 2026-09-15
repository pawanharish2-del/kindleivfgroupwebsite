const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://kindlewombivfgroup.com';
const TODAY = new Date().toISOString().split('T')[0];

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

const allHtml = walkHtml('.');
const excludedFiles = [
  'header.html',
  'footer.html',
  '404.html',
  'googleffaff865656e63b1.html',
  'readme.html',
  'template.html',
  'posts/template.html'
];

let entries = [];

allHtml.forEach(file => {
  const norm = file.replace(/\\/g, '/').replace(/^\.\//, '');
  if (excludedFiles.some(ex => norm === ex || norm.endsWith('/' + ex))) return;

  const content = fs.readFileSync(file, 'utf8');
  // Skip if noindex is present
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(content)) return;

  let url;
  let priority = '0.7';
  let changefreq = 'weekly';

  if (norm === 'index.html') {
    url = `${DOMAIN}/`;
    priority = '1.0';
    changefreq = 'daily';
  } else if (norm === 'about.html' || norm === 'ivf.html' || norm === 'contact.html' || norm === 'ivf-center.html') {
    url = `${DOMAIN}/${norm}`;
    priority = '0.9';
    changefreq = 'weekly';
  } else if (norm === 'iui.html' || norm === 'icsi.html' || norm === 'donor-ivf-services.html' || norm === 'sperm-retrieval.html' || norm === 'infertility-assessment.html' || norm === 'advance-technology.html' || norm === 'gallery.html' || norm === 'frequently-asked-questions.html' || norm === 'what-is-surrogacy.html' || norm === 'blogs.html' || norm === 'all-locations.html') {
    url = `${DOMAIN}/${norm}`;
    priority = '0.8';
    changefreq = 'weekly';
  } else if (norm.startsWith('posts/')) {
    url = `${DOMAIN}/${norm}`;
    priority = '0.7';
    changefreq = 'monthly';
  } else if (norm.startsWith('location-pages/')) {
    url = `${DOMAIN}/${norm}`;
    priority = '0.75';
    changefreq = 'weekly';
  } else {
    url = `${DOMAIN}/${norm}`;
    priority = '0.6';
    changefreq = 'monthly';
  }

  // Check file modified time for lastmod
  const stat = fs.statSync(file);
  const mtime = stat.mtime.toISOString().split('T')[0];

  entries.push({
    url,
    lastmod: mtime || TODAY,
    changefreq,
    priority
  });
});

// Sort entries: root first, then service pages, then locations, then posts
entries.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority) || a.url.localeCompare(b.url));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

entries.forEach(item => {
  xml += `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
`;
});

xml += `</urlset>\n`;

fs.writeFileSync('sitemap.xml', xml, 'utf8');
console.log(`Successfully generated sitemap.xml with ${entries.length} canonical URLs.`);
