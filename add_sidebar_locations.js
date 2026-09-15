const fs = require('fs');

const locations = [
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer"
];

let linksHtml = '';
locations.forEach(city => {
    const slug = city.toLowerCase().replace(/ /g, '-');
    linksHtml += `                <a href="location-pages/best-ivf-center-${slug}.html" style="font-size: 13.5px; padding: 6px 14px; background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; color: var(--navy-blue); text-decoration: none; transition: all 0.3s ease; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.02);" onmouseover="this.style.background='var(--brand-rust)'; this.style.color='#fff'; this.style.borderColor='var(--brand-rust)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.1)';" onmouseout="this.style.background='#ffffff'; this.style.color='var(--navy-blue)'; this.style.borderColor='rgba(0,0,0,0.08)'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.02)';">${city}</a>\n`;
});

// Adding a 'View All' link that stands out
linksHtml += `                <a href="all-locations" style="font-size: 13.5px; padding: 6px 14px; background: var(--navy-blue); border: 1px solid var(--navy-blue); border-radius: 20px; color: #fff; text-decoration: none; transition: all 0.3s ease; display: inline-block; box-shadow: 0 2px 5px rgba(0,0,0,0.1); font-weight: 500;" onmouseover="this.style.background='var(--brand-rust)'; this.style.borderColor='var(--brand-rust)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='var(--navy-blue)'; this.style.borderColor='var(--navy-blue)'; this.style.transform='translateY(0)';">Explore All Locations <i class="fa-solid fa-arrow-right-long" style="margin-left: 5px;"></i></a>\n`;

const widgetHtml = `
        <div class="sidebar-widget locations-widget" style="margin-top: 40px; padding: 25px; background: #fafafa; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05);">
            <h4 class="widget-title" style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-map-location-dot" style="color: var(--brand-rust);"></i> Our IVF Centres</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
${linksHtml}            </div>
        </div>
`;

const indexFile = 'index.html';
let content = fs.readFileSync(indexFile, 'utf8');

// Regex to find the end of the categories list widget
const targetRegex = /(Advanced Embryology Tech <span[^>]*>\(\d+\)<\/span><\/a><\/li>\s*<\/ul>\s*<\/div>)/;

if (targetRegex.test(content)) {
    content = content.replace(targetRegex, "$1\n" + widgetHtml);
    fs.writeFileSync(indexFile, content, 'utf8');
    console.log("Successfully injected beautiful locations sidebar widget into index.html!");
} else {
    console.log("Could not find the target injection point in index.html");
}
