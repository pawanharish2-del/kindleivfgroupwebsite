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

let urlMap = new Map();

allHtml.forEach(file => {
  let norm = file.replace(/\\/g, '/').replace(/^\.\//, '');
  if (excludedFiles.some(ex => norm === ex || norm.endsWith('/' + ex))) return;

  const content = fs.readFileSync(file, 'utf8');
  if (/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(content)) return;

  let cleanSlug = norm.replace(/\.html$/, '');
  if (cleanSlug.endsWith('/index')) {
    cleanSlug = cleanSlug.replace(/\/index$/, '');
  }

  let url;
  let priority = '0.7';
  let changefreq = 'weekly';

  if (cleanSlug === 'index' || cleanSlug === '') {
    url = `${DOMAIN}/`;
    priority = '1.0';
    changefreq = 'daily';
  } else if (cleanSlug === 'about' || cleanSlug === 'ivf' || cleanSlug === 'contact' || cleanSlug === 'ivf-center') {
    url = `${DOMAIN}/${cleanSlug}`;
    priority = '0.9';
    changefreq = 'weekly';
  } else if (cleanSlug === 'iui' || cleanSlug === 'icsi' || cleanSlug === 'donor-ivf-services' || cleanSlug === 'sperm-retrieval' || cleanSlug === 'infertility-assessment' || cleanSlug === 'advance-technology' || cleanSlug === 'gallery' || cleanSlug === 'frequently-asked-questions' || cleanSlug === 'what-is-surrogacy' || cleanSlug === 'blogs' || cleanSlug === 'all-locations' || cleanSlug === 'services' || cleanSlug === 'fertility-enhancing-surgeries') {
    url = `${DOMAIN}/${cleanSlug}`;
    priority = '0.8';
    changefreq = 'weekly';
  } else if (cleanSlug.startsWith('posts/')) {
    url = `${DOMAIN}/${cleanSlug}`;
    priority = '0.7';
    changefreq = 'monthly';
  } else if (cleanSlug.startsWith('location-pages/')) {
    url = `${DOMAIN}/${cleanSlug}`;
    priority = '0.75';
    changefreq = 'weekly';
  } else {
    url = `${DOMAIN}/${cleanSlug}`;
    priority = '0.6';
    changefreq = 'monthly';
  }

  const stat = fs.statSync(file);
  const mtime = stat.mtime.toISOString().split('T')[0];

  if (!urlMap.has(url)) {
    urlMap.set(url, {
      url,
      lastmod: mtime || TODAY,
      changefreq,
      priority
    });
  }
});

let entries = Array.from(urlMap.values());

// Sort entries: root first, then by priority, then alphabetically
entries.sort((a, b) => {
  if (a.url === `${DOMAIN}/`) return -1;
  if (b.url === `${DOMAIN}/`) return 1;
  return parseFloat(b.priority) - parseFloat(a.priority) || a.url.localeCompare(b.url);
});

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
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
console.log(`Successfully generated deduplicated sitemap.xml with ${entries.length} clean canonical URLs.`);
