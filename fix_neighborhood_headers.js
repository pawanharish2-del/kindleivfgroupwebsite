const fs = require('fs');
const path = require('path');

const headerHtmlPath = path.join(__dirname, 'header.html');
const footerHtmlPath = path.join(__dirname, 'footer.html');

const headerContent = fs.readFileSync(headerHtmlPath, 'utf8');
const footerContent = fs.readFileSync(footerHtmlPath, 'utf8');

const richHeaderMatch = headerContent.match(/<header class="main-header">[\s\S]*?<\/header>/i);
if (!richHeaderMatch) {
    console.error("Could not find <header class=\"main-header\"> in header.html");
    process.exit(1);
}
const richHeader = richHeaderMatch[0];

const richFooterMatch = footerContent.match(/<footer class="site-footer">[\s\S]*?<\/footer>/i);
if (!richFooterMatch) {
    console.error("Could not find <footer class=\"site-footer\"> in footer.html");
    process.exit(1);
}
const richFooter = richFooterMatch[0];

const scriptMatch = headerContent.match(/<script>[\s\S]*?function toggleMobileMenu[\s\S]*?<\/script>/i);
const toggleScript = scriptMatch ? scriptMatch[0] : '';

function updateHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace <header ...>...</header>
    if (content.match(/<header[\s\S]*?<\/header>/i)) {
        content = content.replace(/<header[\s\S]*?<\/header>/i, richHeader);
        modified = true;
    }

    // Replace <footer ...>...</footer>
    if (content.match(/<footer[\s\S]*?<\/footer>/i)) {
        content = content.replace(/<footer[\s\S]*?<\/footer>/i, richFooter);
        modified = true;
    }

    // Ensure toggleMobileMenu script is present
    if (toggleScript && !content.includes('function toggleMobileMenu')) {
        if (content.includes('</body>')) {
            content = content.replace('</body>', '\n' + toggleScript + '\n</body>');
        } else {
            content += '\n' + toggleScript;
        }
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// 1. Process Root HTML files
const rootFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'header.html' && f !== 'footer.html' && !f.startsWith('google'));
console.log(`Synchronizing ${rootFiles.length} root HTML files...`);
rootFiles.forEach(f => updateHtmlFile(path.join(__dirname, f)));

// 2. Process Location Pages
const locationPagesDir = path.join(__dirname, 'location-pages');
if (fs.existsSync(locationPagesDir)) {
    const locFiles = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.html'));
    console.log(`Synchronizing ${locFiles.length} location HTML files...`);
    locFiles.forEach(f => updateHtmlFile(path.join(locationPagesDir, f)));
}

// 3. Process Posts
const postsDir = path.join(__dirname, 'posts');
if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));
    console.log(`Synchronizing ${postFiles.length} post HTML files...`);
    postFiles.forEach(f => updateHtmlFile(path.join(postsDir, f)));
}

console.log("=== Master Header and Footer synchronized across all site pages successfully! ===");

