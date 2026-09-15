const fs = require('fs');

const ogUpdates = {
  'advance-technology.html': 'https://kindlewombivfgroup.com/kindle-logo.png',
  'gallery.html': 'https://kindlewombivfgroup.com/kindle-logo.png',
  'ivf-center.html': 'https://kindlewombivfgroup.com/images/best-ivf-center-jaipur-newborn.jpg',
  'sperm-retrieval.html': 'https://kindlewombivfgroup.com/kindle-logo.png',
  'what-is-surrogacy.html': 'https://kindlewombivfgroup.com/kindle-logo.png'
};

for (const [file, imgUrl] of Object.entries(ogUpdates)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']+["']/i, `<meta property="og:image" content="${imgUrl}">`);
    content = content.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][^"']+["']/i, `<meta name="twitter:image" content="${imgUrl}">`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated OG image in ${file} to ${imgUrl}`);
  }
}
