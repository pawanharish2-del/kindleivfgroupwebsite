const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const locations = [
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer"
];

let footerLinksHTML = '';
locations.forEach(loc => {
    footerLinksHTML += `<a href="https://kindlewombivfgroup.com/location-pages/best-ivf-center-${loc.toLowerCase().replace(/ /g, '-')}.html">${loc}</a>\n`;
});

const globalLocationNav = `
    <!-- Find an IVF Centre Near You Block (Global) -->
    <div class="global-location-nav">
        <h3>Find an IVF Centre Near You</h3>
        <div class="footer-grid">
            <div class="footer-column" style="width: 100%;">
                <h4>Our Locations in Rajasthan</h4>
                <div class="location-links-inline">
                    ${footerLinksHTML}
                </div>
            </div>
        </div>
    </div>
`;

const footerHtmlContent = fs.readFileSync(path.join(rootDir, 'footer.html'), 'utf-8');
let footerMatch = footerHtmlContent.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
let trueFooter = footerMatch ? footerMatch[0] : '';

// Insert "All IVF Locations" link if missing
if (!trueFooter.includes('All IVF Locations')) {
    trueFooter = trueFooter.replace(
        /(<li><a href="https:\/\/blog\.kindlewombivfgroup5\.com\/">Blog<\/a><\/li>)/,
        '$1\n                <li><a href="https://kindlewombivfgroup.com/all-locations">All IVF Locations</a></li>'
    );
}

// Inject location nav INSIDE the footer before the footer-bottom
const optimizedFooter = trueFooter.replace('<div class="footer-bottom">', globalLocationNav + '\n    <div class="footer-bottom">');

function walk(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

walk(rootDir, function(err, results) {
    if (err) throw err;
    const htmlFiles = results.filter(f => f.endsWith('.html') && !f.includes('header.html') && !f.includes('footer.html') && !f.includes('readme.html'));

    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf-8');
        let modified = false;

        // Clean out the old external white block if it exists
        content = content.replace(/\s*<!-- Find an IVF Centre Near You Block \(Global\) -->[\s\S]*?<div class="global-location-nav">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/g, '\n\n');
        
        // Replace old footer with new optimized footer
        if (/<footer class="site-footer">[\s\S]*?<\/footer>/.test(content)) {
            content = content.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/, optimizedFooter);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Updated footer on: ${file}`);
        }
    });
    
    console.log("Footer sync complete!");
});
