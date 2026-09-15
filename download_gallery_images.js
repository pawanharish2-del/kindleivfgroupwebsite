const https = require('https');
const fs = require('fs');
const path = require('path');

const galleryDir = path.join('images', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
}

// Extract all external image URLs from gallery.html
const content = fs.readFileSync('gallery.html', 'utf8');
const urls = [];
const regex = /src=["'](https:\/\/static\.wixstatic\.com\/media\/[^"']+)["']/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  if (!urls.includes(match[1])) urls.push(match[1]);
}

// Also check lightbox items in gallery.html JS
const jsRegex = /src:\s*["'](https:\/\/static\.wixstatic\.com\/media\/[^"']+)["']/gi;
while ((match = jsRegex.exec(content)) !== null) {
  if (!urls.includes(match[1])) urls.push(match[1]);
}

console.log(`Found ${urls.length} external Wix images to download locally...`);

async function downloadImage(url, index) {
  const ext = path.extname(url.split('~')[0]) || '.jpg';
  const filename = `gallery-photo-${index + 1}${ext}`;
  const dest = path.join(galleryDir, filename);

  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve({ original: url, local: `/images/gallery/${filename}`, success: true });
        });
      } else {
        console.log(`Failed to download ${url} (status: ${res.statusCode})`);
        file.close();
        fs.unlinkSync(dest);
        resolve({ original: url, success: false });
      }
    }).on('error', (err) => {
      console.log(`Error downloading ${url}: ${err.message}`);
      resolve({ original: url, success: false });
    });
  });
}

(async () => {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    results.push(await downloadImage(urls[i], i));
  }

  // Update gallery.html with local paths
  let updatedContent = fs.readFileSync('gallery.html', 'utf8');
  results.forEach(res => {
    if (res.success) {
      updatedContent = updatedContent.replaceAll(res.original, res.local);
    }
  });

  fs.writeFileSync('gallery.html', updatedContent, 'utf8');
  if (fs.existsSync('gallery/index.html')) {
    fs.writeFileSync('gallery/index.html', updatedContent, 'utf8');
  }

  console.log('Successfully updated gallery.html with first-party local images!');
})();
