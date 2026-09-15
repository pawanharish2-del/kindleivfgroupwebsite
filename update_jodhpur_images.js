const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\64582e00-9f74-45b8-b986-9d99dbd25940";
const imagesDir = path.join(__dirname, 'images');
const locationPagesDir = path.join(__dirname, 'location-pages');

const mapping = {
    "best_ivf_center_jodhpur": "best-ivf-center-jodhpur-newborn.jpg",
    "best_ivf_hospital_jodhpur": "best-ivf-hospital-jodhpur-newborn.jpg",
    "best_fertility_center_jodhpur": "best-fertility-center-jodhpur-newborn.jpg",
    "top_ivf_clinic_jodhpur": "top-ivf-clinic-jodhpur-newborn.jpg",
    "best_ivf_doctor_jodhpur": "best-ivf-doctor-jodhpur-newborn.jpg"
};

// Find the latest generated files in the brain dir
const files = fs.readdirSync(brainDir);

Object.keys(mapping).forEach(prefix => {
    // Find the matching file with the highest timestamp (to get the newest ones)
    const matchingFiles = files.filter(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    if (matchingFiles.length > 0) {
        // Sort to get the latest (highest timestamp)
        matchingFiles.sort();
        const latestFile = matchingFiles[matchingFiles.length - 1];
        
        const sourcePath = path.join(brainDir, latestFile);
        const targetFilename = mapping[prefix];
        const targetPath = path.join(imagesDir, targetFilename);
        
        // Copy to images folder
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Copied ${latestFile} to images/${targetFilename}`);

        // Update the corresponding HTML file
        const htmlFilename = targetFilename.replace('-newborn.jpg', '.html');
        const htmlPath = path.join(locationPagesDir, htmlFilename);
        
        if (fs.existsSync(htmlPath)) {
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');
            // Ensure the img src points to the correct file
            htmlContent = htmlContent.replace(/<img src="\.\.\/images\/[^"]+"/g, `<img src="../images/${targetFilename}"`);
            fs.writeFileSync(htmlPath, htmlContent, 'utf8');
            console.log(`Updated HTML: ${htmlFilename}`);
        }
    } else {
        console.log(`No image found for prefix: ${prefix}`);
    }
});
