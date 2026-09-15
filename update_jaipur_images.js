const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/USER/.gemini/antigravity/brain/64582e00-9f74-45b8-b986-9d99dbd25940';
const projectDir = 'c:/Users/USER/Downloads/kindle blog website/blog.kindlewombivfgroup.com';
const imagesDir = path.join(projectDir, 'images');

// Create images dir if it doesn't exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const jaipurArtifacts = {
    'best-ivf-center-jaipur': 'best_ivf_center_jaipur_1784888711151.jpg',
    'best-ivf-doctor-jaipur': 'best_ivf_doctor_jaipur_1784888752205.jpg',
    'infertility-specialist-jaipur': 'infertility_specialist_jaipur_newborn_1784888770223.jpg',
    'ivf-treatment-cost-jaipur': 'ivf_treatment_cost_jaipur_1784888787000.jpg',
    'test-tube-baby-center-jaipur': 'test_tube_baby_center_jaipur_1784888728253.jpg'
};

const keys = Object.keys(jaipurArtifacts);

keys.forEach(key => {
    const artifactName = jaipurArtifacts[key];
    const sourcePath = path.join(brainDir, artifactName);
    const destName = `${key}.jpg`;
    const destPath = path.join(imagesDir, destName);
    
    // Copy image
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied image to ${destPath}`);
        
        // Update corresponding HTML file
        const htmlPath = path.join(projectDir, 'location-pages', `${key}.html`);
        if (fs.existsSync(htmlPath)) {
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            
            // The template uses <img src="../images/placeholder.jpg"... or similar for the hero.
            // Let's replace ANY <img src="..."> in the .hero-section with our new image.
            // Or more specifically: replace the hero image background or img tag.
            // Wait, how is the hero image set in the generated pages? Let's check the regex replacement.
            // If the hero has an <img> tag:
            htmlContent = htmlContent.replace(/<img[^>]*src="[^"]*"[^>]*alt="Hero Image"[^>]*>/i, `<img src="../images/${destName}" alt="Newborn baby at Kindle Womb IVF ${key.replace(/-/g, ' ')}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: -1;">`);
            
            // In generate_100_pages.js we did:
            // `<img src="../images/placeholder.jpg" alt="Hero Image" ...>`
            // So the above regex will catch it perfectly.

            fs.writeFileSync(htmlPath, htmlContent, 'utf8');
            console.log(`Updated HTML: ${htmlPath}`);
        } else {
            console.warn(`Warning: HTML file not found at ${htmlPath}`);
        }
    } else {
        console.error(`Error: Source artifact not found at ${sourcePath}`);
    }
});

console.log("Jaipur images injected successfully!");
