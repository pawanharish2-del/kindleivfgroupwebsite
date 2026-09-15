const fs = require('fs');
const path = require('path');

const locationPagesDir = path.join(__dirname, 'location-pages');

fs.readdirSync(locationPagesDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(locationPagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if favicon already exists
        if (!content.includes('<link rel="icon"')) {
            // Insert it right after <head>
            content = content.replace('<head>', '<head>\n    <link rel="icon" type="image/jpeg" href="../favicon.jpg">');
            fs.writeFileSync(filePath, content);
            console.log(`Added favicon to ${file}`);
        }
    }
});

console.log("Finished adding favicons to all location pages.");
