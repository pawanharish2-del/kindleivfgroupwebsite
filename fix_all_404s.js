const fs = require('fs');
const path = require('path');

console.log('=== FIXING ALL DEAD LINKS AND IMAGES (ZERO 404S) ===');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walk(full));
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.xml')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('.');
let modified = 0;

files.forEach(file => {
  if (file.includes('fix_all_404s.js') || file.includes('crawl_404_audit.js') || file.includes('group_dead_links.js')) return;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Fix book-online -> contact
  content = content.replace(/https:\/\/kindlewombivfgroup\.com\/book-online/g, 'https://kindlewombivfgroup.com/contact');
  content = content.replace(/href=["'](?:\.\.\/|\.\/)?book-online["']/g, (m) => {
    if (file.includes('location-pages') || file.includes('posts')) return 'href="../contact"';
    return 'href="contact"';
  });

  // 2. Fix what-is-infertility -> infertility-assessment
  content = content.replace(/https:\/\/kindlewombivfgroup\.com\/what-is-infertility/g, 'https://kindlewombivfgroup.com/infertility-assessment');
  content = content.replace(/href=["'](?:\.\.\/|\.\/)?what-is-infertility["']/g, (m) => {
    if (file.includes('location-pages') || file.includes('posts')) return 'href="../infertility-assessment"';
    return 'href="infertility-assessment"';
  });

  // 3. Fix media-and-gallery -> gallery
  content = content.replace(/https:\/\/kindlewombivfgroup\.com\/media-and-gallery/g, 'https://kindlewombivfgroup.com/gallery');
  content = content.replace(/href=["'](?:\.\.\/|\.\/)?media-and-gallery["']/g, (m) => {
    if (file.includes('location-pages') || file.includes('posts')) return 'href="../gallery"';
    return 'href="gallery"';
  });

  // 4. Image corrections
  content = content.replace(/images\/hero-best-ivf-center-jaipur\.jpg/g, 'images/best-ivf-center-jaipur.jpg');
  content = content.replace(/images\/hero-best-ivf-doctor\.jpg/g, 'images/best-ivf-doctor-jaipur.jpg');
  content = content.replace(/images\/hero-infertility-specialist\.jpg/g, 'images/infertility-specialist-jaipur.jpg');
  content = content.replace(/images\/hero-iui-treatment-jaipur\.jpg/g, 'images/best-ivf-center-jaipur.jpg');
  content = content.replace(/images\/hero-ivf-cost-jaipur\.jpg/g, 'images/ivf-treatment-cost-jaipur.jpg');
  content = content.replace(/\.\.\/images\/best-fertility-center-jaipur-newborn\.jpg/g, '../images/best-ivf-center-jaipur.jpg');
  content = content.replace(/\.\.\/images\/best-ivf-doctor-jaipur-newborn\.jpg/g, '../images/best-ivf-doctor-jaipur.jpg');
  content = content.replace(/\.\.\/images\/best-ivf-hospital-jaipur-newborn\.jpg/g, '../images/best-ivf-center-jaipur.jpg');
  content = content.replace(/\.\.\/images\/infertility-specialist-jodhpur\.webp/g, '../images/best-fertility-center-jodhpur-newborn.jpg');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modified++;
  }
});

console.log(`Applied fixes across ${modified} files.`);
