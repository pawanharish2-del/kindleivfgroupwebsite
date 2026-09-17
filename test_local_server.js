const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;

// Create standard static file server simulation (like Nginx, Apache, GitHub Pages)
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(__dirname, reqPath);

  // Check 1: direct file
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200);
    return res.end(fs.readFileSync(filePath));
  }

  // Check 2: directory/index.html
  let dirIndex = path.join(filePath, 'index.html');
  if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(dirIndex));
  }

  // Check 3: file.html
  let htmlFile = filePath + '.html';
  if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(htmlFile));
  }

  res.writeHead(404, { 'Content-Type': 'text/html' });
  if (fs.existsSync('404.html')) {
    res.end(fs.readFileSync('404.html'));
  } else {
    res.end('404 Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}...`);

  // Read sitemap URLs and test every single one
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  const locs = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map(l => l.replace('<loc>', '').replace('</loc>', ''));

  console.log(`Testing ${locs.length} clean URLs against live server simulation...`);

  let failed = [];
  let passed = 0;

  for (const url of locs) {
    const relativePath = url.replace('https://kindlewombivfgroup.com', '');
    const testUrl = `http://localhost:${PORT}${relativePath}`;

    await new Promise(resolve => {
      http.get(testUrl, (resp) => {
        if (resp.statusCode === 200) {
          passed++;
        } else {
          failed.push({ url, status: resp.statusCode });
        }
        resolve();
      }).on('error', (err) => {
        failed.push({ url, error: err.message });
        resolve();
      });
    });
  }

  // Also test critical asset URLs
  const assetUrls = ['/global.css', '/kindle-logo.png', '/faviconkindle.jpg', '/images/best-ivf-center-jaipur.jpg'];
  let assetPassed = 0;
  for (const asset of assetUrls) {
    await new Promise(resolve => {
      http.get(`http://localhost:${PORT}${asset}`, (resp) => {
        if (resp.statusCode === 200) assetPassed++;
        else failed.push({ asset, status: resp.statusCode });
        resolve();
      });
    });
  }

  console.log(`\n=== SERVER SIMULATION TEST RESULTS ===`);
  console.log(`Total URLs Tested: ${locs.length}`);
  console.log(`Passed (HTTP 200 OK): ${passed}`);
  console.log(`Failed URLs (404): ${failed.length}`);
  console.log(`Assets Verified: ${assetPassed}/${assetUrls.length}`);

  if (failed.length > 0) {
    console.log('Failed URLs details:', failed);
  }

  server.close(() => {
    console.log('Test completed and server stopped.');
    process.exit(failed.length === 0 ? 0 : 1);
  });
});
