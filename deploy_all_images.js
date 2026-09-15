const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');

const locations = [
  "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer"
];

const keywords = [
  "Best IVF Center",
  "Best IVF Hospital",
  "Best Fertility Center",
  "Top IVF Clinic",
  "Best IVF Doctor"
];

let copiedCount = 0;

locations.forEach(location => {
    keywords.forEach(keyword => {
        const keywordSlug = keyword.toLowerCase().replace(/ /g, '-');
        const locationSlug = location.toLowerCase().replace(/ /g, '-');
        
        // The source image is the Jodhpur equivalent
        const sourceFilename = `${keywordSlug}-jodhpur-newborn.jpg`;
        const sourcePath = path.join(imagesDir, sourceFilename);
        
        // The target image for the new city
        const targetFilename = `${keywordSlug}-${locationSlug}-newborn.jpg`;
        const targetPath = path.join(imagesDir, targetFilename);

        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, targetPath);
            copiedCount++;
        } else {
            console.log(`Source image not found: ${sourceFilename}`);
        }
    });
});

console.log(`Successfully generated and deployed ${copiedCount} images across the remaining 18 cities!`);
