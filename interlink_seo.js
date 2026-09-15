const fs = require('fs');
const path = require('path');

const locationPagesDir = path.join(__dirname, 'location-pages');
const postsDir = path.join(__dirname, 'posts');

// Master list of locations
const locations = [
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer",
  "Mansarovar", "Vaishali Nagar", "Malviya Nagar"
];

// Read all blog posts to link to
let blogPosts = [];
if (fs.existsSync(postsDir)) {
    blogPosts = fs.readdirSync(postsDir)
        .filter(f => f.endsWith('.html') && f !== 'template.html')
        .map(f => {
            // Extract a readable title from filename, e.g. "best-ivf-center-jaipur.html" -> "Best IVF Center Jaipur"
            let title = f.replace('.html', '').replace(/-/g, ' ');
            title = title.replace(/\b\w/g, l => l.toUpperCase());
            return { filename: f, title: title };
        });
}

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Interlinking Replacements (Pillar 1)
const contextualLinks = [
    { search: 'In Vitro Fertilization (IVF)', replace: '<a href="https://kindlewombivfgroup.com/ivf" style="color: var(--brand-rust); text-decoration: underline; font-weight: 500;">In Vitro Fertilization (IVF)</a>' },
    { search: 'Intracytoplasmic Sperm Injection (ICSI)', replace: '<a href="https://kindlewombivfgroup.com/icsi" style="color: var(--brand-rust); text-decoration: underline; font-weight: 500;">Intracytoplasmic Sperm Injection (ICSI)</a>' }
];

let filesProcessed = 0;

fs.readdirSync(locationPagesDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(locationPagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if already interlinked
        if (content.includes('class="seo-interlink-module"')) {
            return; // Skip already processed
        }

        // 1. Contextual Linking
        contextualLinks.forEach(link => {
            // Only replace the first occurrence in the text to avoid spamming links
            content = content.replace(link.search, link.replace);
        });

        // 2. Nearby Locations (Pillar 2)
        const nearbyCities = getRandomItems(locations.filter(l => !file.includes(l.toLowerCase().replace(/ /g, '-'))), 5);
        let nearbyHTML = `<ul style="list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 10px;">`;
        nearbyCities.forEach(city => {
            nearbyHTML += `<li><a href="best-ivf-center-${city.toLowerCase().replace(/ /g, '-')}.html" style="display: inline-block; padding: 8px 15px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; color: var(--navy-blue); text-decoration: none; font-size: 14px; transition: all 0.2s ease;" onmouseover="this.style.background='var(--soft-cream)'; this.style.borderColor='var(--brand-rust)';" onmouseout="this.style.background='rgba(0,0,0,0.03)'; this.style.borderColor='rgba(0,0,0,0.05)';">${city} IVF Centers</a></li>`;
        });
        nearbyHTML += `</ul>`;

        // 3. Blog Integration (Pillar 3)
        const relatedBlogs = getRandomItems(blogPosts, 3);
        let blogsHTML = `<ul style="list-style: none; padding: 0; margin-top: 15px;">`;
        relatedBlogs.forEach(blog => {
            blogsHTML += `<li style="margin-bottom: 10px;"><i class="fa-solid fa-arrow-right" style="color: var(--brand-rust); margin-right: 10px; font-size: 12px;"></i> <a href="../posts/${blog.filename}" style="color: var(--text-dark); text-decoration: none; font-weight: 500; transition: color 0.2s ease;" onmouseover="this.style.color='var(--brand-rust)';" onmouseout="this.style.color='var(--text-dark)';">${blog.title}</a></li>`;
        });
        blogsHTML += `</ul>`;

        const interlinkModule = `
        <!-- INTERLINKING MODULE -->
        <section class="seo-interlink-module" style="padding: 40px 20px; background: #fafafa; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05);">
            <div class="container" style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
                
                <div class="interlink-col">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-map-location-dot" style="color: var(--brand-rust);"></i> Explore Nearby Facilities</h3>
                    <p style="font-size: 14px; color: var(--text-dark); opacity: 0.8; margin-bottom: 15px;">Discover our world-class fertility clinics in neighboring districts:</p>
                    ${nearbyHTML}
                </div>

                <div class="interlink-col">
                    <h3 style="font-size: 20px; color: var(--navy-blue); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><i class="fa-solid fa-book-medical" style="color: var(--brand-rust);"></i> Latest Fertility Insights</h3>
                    <p style="font-size: 14px; color: var(--text-dark); opacity: 0.8; margin-bottom: 15px;">Read specialized clinical resources from our medical team:</p>
                    ${blogsHTML}
                </div>

            </div>
        </section>
        <!-- END INTERLINKING MODULE -->
        `;

        // Inject right before the existing related-pages section or before </main>
        const splitPattern = /<!-- Related Pages -->/;
        if (content.match(splitPattern)) {
            content = content.replace(splitPattern, `${interlinkModule}\n        <!-- Related Pages -->`);
            fs.writeFileSync(filePath, content, 'utf8');
            filesProcessed++;
        }
    }
});

console.log(`Successfully applied strong interlinking architecture to ${filesProcessed} pages.`);
