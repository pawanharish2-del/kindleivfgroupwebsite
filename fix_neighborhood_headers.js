const fs = require('fs');
const path = require('path');

const locationPagesDir = path.join(__dirname, 'location-pages');
const headerHtmlPath = path.join(__dirname, 'header.html');

// Read the rich header and script
const headerContent = fs.readFileSync(headerHtmlPath, 'utf8');

const richHeaderMatch = headerContent.match(/<header class="main-header">[\s\S]*?<\/header>/);
if (!richHeaderMatch) {
    console.error("Could not find <header class=\"main-header\"> in header.html");
    process.exit(1);
}
const richHeader = richHeaderMatch[0];

const scriptMatch = headerContent.match(/<script>\s*function toggleMobileMenu[\s\S]*?<\/script>/);
const toggleScript = scriptMatch ? scriptMatch[0] : '';

const neighborhoods = ["mansarovar", "vaishali-nagar", "malviya-nagar"];

fs.readdirSync(locationPagesDir).forEach(file => {
    if (neighborhoods.some(n => file.includes(n)) && file.endsWith('.html')) {
        const filePath = path.join(locationPagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Replace the basic header with the rich header
        if (content.match(/<header class="main-header">[\s\S]*?<\/header>/)) {
            content = content.replace(/<header class="main-header">[\s\S]*?<\/header>/, richHeader);
            modified = true;
        }

        // Add the toggleMobileMenu script if missing
        if (toggleScript && !content.includes('function toggleMobileMenu')) {
            content = content.replace('</body>', '\n' + toggleScript + '\n</body>');
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated header in ${file}`);
        }
    }
});

console.log("Replaced basic header with rich header in neighborhood pages.");
