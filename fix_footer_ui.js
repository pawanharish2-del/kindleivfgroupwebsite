const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const locations = [
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer",
  "Mansarovar", "Vaishali Nagar", "Malviya Nagar"
];

let footerLinksHTML = '';
locations.forEach(loc => {
    footerLinksHTML += `<a href="https://kindlewombivfgroup.com/location-pages/best-ivf-center-${loc.toLowerCase().replace(/ /g, '-')}.html" style="color: #e5dcd9; text-decoration: none; font-size: 14.5px; padding: 5px 12px; background: rgba(255,255,255,0.05); border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); transition: background 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">${loc}</a>\n`;
});

const newGlobalLocationNav = `
    <!-- PROFESSIONAL LOCATION DIRECTORY -->
    <div style="max-width: 1400px; margin: 40px auto 20px auto; padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
        <h3 style="font-size: 21px; font-weight: 600; color: #ffffff; margin-bottom: 25px;">Find an IVF Centre Near You</h3>
        <div style="width: 100%;">
            <h4 style="font-size: 16px; color: #c9b4a4; margin-bottom: 15px; font-weight: 500;">Our Locations in Rajasthan</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
                ${footerLinksHTML}
            </div>
        </div>
    </div>
`;

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

        // Strip out the broken global-location-nav completely
        const brokenNavRegex = /\s*<!-- Find an IVF Centre Near You Block \(Global\) -->[\s\S]*?<div class="global-location-nav">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*/g;
        if (brokenNavRegex.test(content)) {
            content = content.replace(brokenNavRegex, '\n\n');
            modified = true;
        }

        // Also remove any duplicate or residual professional directories to avoid stacking
        const profRegex = /\s*<!-- PROFESSIONAL LOCATION DIRECTORY -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/g;
        if (profRegex.test(content)) {
             content = content.replace(profRegex, '\n\n');
             modified = true;
        }

        // Inject the professional inline-styled block right before the copyright footer-bottom
        if (/<div class="footer-bottom">/.test(content)) {
            content = content.replace('<div class="footer-bottom">', newGlobalLocationNav + '\n    <div class="footer-bottom">');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            console.log(`Professional UI applied to: ${file}`);
        }
    });
    
    console.log("UI Polish complete!");
});
