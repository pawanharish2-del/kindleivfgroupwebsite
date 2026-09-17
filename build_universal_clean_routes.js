const fs = require('fs');
const path = require('path');

console.log('=== BUILDING UNIVERSAL CLEAN ROUTE DIRECTORIES (ZERO 404 GUARANTEE) ===');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Normalize asset and internal paths to root-relative in all HTML content
function normalizeContentForUniversalRouting(content, filePath) {
  let c = content;

  // Make core CSS & favicon root-relative
  c = c.replace(/href=["'](?:\.\.\/|\.\/)?global\.css["']/g, 'href="/global.css"');
  c = c.replace(/href=["'](?:\.\.\/|\.\/)?location-pages\.css["']/g, 'href="/location-pages/location-pages.css"');
  c = c.replace(/href=["'](?:\.\.\/|\.\/)?favicon\.jpg["']/g, 'href="/faviconkindle.jpg"');
  c = c.replace(/src=["'](?:\.\.\/|\.\/)?kindle-logo\.png["']/g, 'src="/kindle-logo.png"');

  // Make images root-relative: src="images/xxx" or src="../images/xxx" -> src="/images/xxx"
  c = c.replace(/src=["'](?:\.\.\/|\.\/)?images\/([^"']+)["']/g, 'src="/images/$1"');
  c = c.replace(/src=["'](?:\.\.\/|\.\/)?posts\/([^"']+)["']/g, 'src="/posts/$1"');

  // Make internal links root-relative without .html
  const rootPages = [
    'about', 'advance-technology', 'all-locations', 'best-ivf-center-jaipur',
    'best-ivf-doctor-jaipur', 'blogs', 'contact', 'donor-ivf-services',
    'fertility-enhancing-surgeries', 'frequently-asked-questions', 'gallery',
    'icsi', 'infertility-assessment', 'infertility-specialist-jaipur',
    'iui-treatment-jaipur', 'iui', 'ivf-center', 'ivf-treatment-cost-jaipur',
    'ivf', 'services', 'sperm-retrieval', 'test-tube-baby-center-jaipur',
    'what-is-surrogacy'
  ];

  rootPages.forEach(p => {
    // replace href="about" or href="../about" or href="about.html" with href="/about"
    const regex1 = new RegExp(`href=["'](?:\\.\\.\\/|\\.\\/)?${p}(?:\\.html)?(["'#\\?])`, 'g');
    c = c.replace(regex1, `href="/${p}$1`);
  });

  // Location pages links
  c = c.replace(/href=["'](?:\.\.\/|\.\/)?location-pages\/([^"'\?#]+?)(?:\.html)?(["'#\?])/g, 'href="/location-pages/$1$2');

  // Posts links
  c = c.replace(/href=["'](?:\.\.\/|\.\/)?posts\/([^"'\?#]+?)(?:\.html)?(["'#\?])/g, 'href="/posts/$1$2');

  // Clean canonicals and og:urls to clean domain URLs
  c = c.replace(/(<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)(?:\.html)?(["'][^>]*>)/gi, '$1$2');
  c = c.replace(/(<meta\s+property=["']og:url["']\s+content=["']https:\/\/kindlewombivfgroup\.com\/[^"']+?)(?:\.html)?(["'])/gi, '$1$2');

  return c;
}

// 2. Process all Root HTML Pages and create [slug]/index.html
const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== '404.html' && !f.startsWith('google'));

console.log(`Processing ${rootFiles.length} root HTML files...`);

rootFiles.forEach(file => {
  const slug = file.replace(/\.html$/, '');
  let content = fs.readFileSync(file, 'utf8');
  content = normalizeContentForUniversalRouting(content, file);

  // Save updated root .html file
  fs.writeFileSync(file, content, 'utf8');

  // If not homepage index.html, create [slug]/index.html
  if (slug !== 'index' && slug !== 'header' && slug !== 'footer' && slug !== 'template') {
    ensureDir(slug);
    fs.writeFileSync(path.join(slug, 'index.html'), content, 'utf8');
    console.log(`Created directory route: /${slug}/index.html`);
  }
});

// 3. Process Location Pages and create location-pages/[slug]/index.html
if (fs.existsSync('location-pages')) {
  const locFiles = fs.readdirSync('location-pages').filter(f => f.endsWith('.html'));
  console.log(`Processing ${locFiles.length} location pages...`);

  locFiles.forEach(file => {
    const slug = file.replace(/\.html$/, '');
    const filePath = path.join('location-pages', file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = normalizeContentForUniversalRouting(content, filePath);

    // Save updated location-pages/[file].html
    fs.writeFileSync(filePath, content, 'utf8');

    // Create location-pages/[slug]/index.html
    const targetDir = path.join('location-pages', slug);
    ensureDir(targetDir);
    fs.writeFileSync(path.join(targetDir, 'index.html'), content, 'utf8');
  });
  console.log(`Created ${locFiles.length} directory routes under /location-pages/...`);
}

// 4. Process Blog Posts and create posts/[slug]/index.html
if (fs.existsSync('posts')) {
  const postFiles = fs.readdirSync('posts').filter(f => f.endsWith('.html'));
  console.log(`Processing ${postFiles.length} blog post pages...`);

  postFiles.forEach(file => {
    const slug = file.replace(/\.html$/, '');
    const filePath = path.join('posts', file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = normalizeContentForUniversalRouting(content, filePath);

    // Save updated posts/[file].html
    fs.writeFileSync(filePath, content, 'utf8');

    // Create posts/[slug]/index.html
    const targetDir = path.join('posts', slug);
    ensureDir(targetDir);
    fs.writeFileSync(path.join(targetDir, 'index.html'), content, 'utf8');
  });
  console.log(`Created ${postFiles.length} directory routes under /posts/...`);
}

console.log('Universal clean route generation completed successfully!');
