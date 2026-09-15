const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!filePath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix canonical
    // Sometimes it's <link class="canonical" ...> instead of rel="canonical"
    if (content.includes('<link class="canonical"')) {
        content = content.replace(/<link class="canonical"/g, '<link rel="canonical"');
        modified = true;
    }
    
    const canonicalRegex = /<link rel="canonical" href="https:\/\/www\.kindlewombivfgroup5\.com\/(.*?)"/g;
    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, '<link rel="canonical" href="https://kindlewombivfgroup.com/$1"');
        modified = true;
    }

    // 2. Fix og:url
    const ogRegex = /<meta property="og:url" content="https:\/\/www\.kindlewombivfgroup5\.com\/(.*?)"/g;
    if (ogRegex.test(content)) {
        content = content.replace(ogRegex, '<meta property="og:url" content="https://kindlewombivfgroup.com/$1"');
        modified = true;
    }

    // 3. Fix twitter:url
    const twitterRegex = /<meta property="twitter:url" content="https:\/\/www\.kindlewombivfgroup5\.com\/(.*?)"/g;
    if (twitterRegex.test(content)) {
        content = content.replace(twitterRegex, '<meta property="twitter:url" content="https://kindlewombivfgroup.com/$1"');
        modified = true;
    }

    // 4. Fix JSON-LD @id
    const idRegex = /"@id":\s*"https:\/\/www\.kindlewombivfgroup5\.com\/(.*?)"/g;
    if (idRegex.test(content)) {
        content = content.replace(idRegex, '"@id": "https://kindlewombivfgroup.com/$1"');
        modified = true;
    }

    // Note: We don't touch og:image, twitter:image, or publisher/author URLs which correctly point to the main site.

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed SEO URLs in:', filePath);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !fullPath.includes('.git') && !fullPath.includes('node_modules') && !fullPath.includes('images')) {
            walkDir(fullPath);
        } else if (stat.isFile()) {
            processFile(fullPath);
        }
    });
}

const rootDir = __dirname;
walkDir(rootDir);
console.log('Done fixing SEO URLs across all HTML files.');
