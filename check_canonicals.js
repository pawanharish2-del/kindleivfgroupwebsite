const fs = require('fs');

const sampleFiles = [
  'index.html',
  'about.html',
  'ivf.html',
  'contact.html',
  'gallery.html',
  'location-pages/best-ivf-center-jaipur.html',
  'posts/understanding-ivf-cost-jaipur.html'
];

sampleFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    console.log(`${f} -> Canonical: ${m ? m[1] : 'NONE'}`);
  }
});
