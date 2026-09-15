const fs = require('fs');
const path = require('path');

const locationPagesDir = path.join(__dirname, 'location-pages');
const footerHtmlPath = path.join(__dirname, 'footer.html');

// Read the rich footer
const footerContent = fs.readFileSync(footerHtmlPath, 'utf8');
const richFooterMatch = footerContent.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
if (!richFooterMatch) {
    console.error("Could not find <footer class=\"site-footer\"> in footer.html");
    process.exit(1);
}
const richFooter = richFooterMatch[0];

const neighborhoods = ["mansarovar", "vaishali-nagar", "malviya-nagar"];

fs.readdirSync(locationPagesDir).forEach(file => {
    if (neighborhoods.some(n => file.includes(n)) && file.endsWith('.html')) {
        const filePath = path.join(locationPagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the basic footer with the rich footer
        content = content.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, richFooter);
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated footer in ${file}`);
    }
});

console.log("Replaced basic footer with rich footer in neighborhood pages.");
