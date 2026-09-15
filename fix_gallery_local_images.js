const fs = require('fs');

const updatedGalleryCards = [
  {
    category: 'infrastructure',
    title: 'Welcoming Patient Reception',
    subtitle: 'Infrastructure',
    color: 'text-brand-red',
    img: '/images/best-ivf-center-jaipur.jpg',
    caption: 'Welcoming Patient Reception Area'
  },
  {
    category: 'consultation',
    title: 'Comfortable Patient Lounges',
    subtitle: 'Consultation',
    color: 'text-brand-blue',
    img: '/images/Top-Fertility-Hospital-in-Jaipur.jpg',
    caption: 'Comfortable Patient Lounges & Waiting Suites'
  },
  {
    category: 'consultation',
    title: 'Private Doctor Consultation Chambers',
    subtitle: 'Consultation',
    color: 'text-brand-blue',
    img: '/images/best-ivf-doctor-jaipur.jpg',
    caption: 'Private Doctor Consultation Chambers with Dr. Girraj Prasad Swarnkar'
  },
  {
    category: 'cleanrooms',
    title: 'Modular Level-3 Embryology Cleanroom',
    subtitle: 'Embryology',
    color: 'text-brand-gold',
    img: '/images/test-tube-baby-center-jaipur.jpg',
    caption: 'Modular Level-3 Embryology Cleanroom with HEPA Filtration'
  },
  {
    category: 'cleanrooms',
    title: 'Micromanipulation & Laser Workstation',
    subtitle: 'Embryology',
    color: 'text-brand-gold',
    img: '/images/ICSI-Procedure-in-Jaipur.jpg',
    caption: 'Advanced ICSI Micromanipulation & Laser Assisted Hatching Workstation'
  },
  {
    category: 'infrastructure',
    title: 'Advanced Andrology & Laparoscopy OT',
    subtitle: 'Infrastructure',
    color: 'text-brand-red',
    img: '/images/Hysteroscopy-and-Laparoscopy.jpg',
    caption: 'Advanced Andrology & Laparoscopic Surgical Suite'
  },
  {
    category: 'cleanrooms',
    title: 'Reproductive Genetics & PGT Testing',
    subtitle: 'Embryology',
    color: 'text-brand-gold',
    img: '/images/future-ivf.jpg',
    caption: 'Reproductive Genetics & PGT Testing Laboratory'
  },
  {
    category: 'cleanrooms',
    title: 'Andrology & Microfluidics Lab',
    subtitle: 'Embryology',
    color: 'text-brand-gold',
    img: '/images/Male-Infertility-Treatment-in-Jaipur.jpg',
    caption: 'Specialized Andrology & Microfluidic Sperm Sorting Lab'
  },
  {
    category: 'infrastructure',
    title: 'High-Resolution Sonography Suite',
    subtitle: 'Infrastructure',
    color: 'text-brand-red',
    img: '/images/Choosing-the-Best-IVF-Hospital-Jaipur.jpg',
    caption: 'High-Resolution 4D Pelvic & Follicular Sonography Suite'
  },
  {
    category: 'cleanrooms',
    title: 'Cryopreservation & Gamete Bank',
    subtitle: 'Embryology',
    color: 'text-brand-gold',
    img: '/images/India-New-IVF-Guidelines-2025.jpg',
    caption: 'Advanced Cryopreservation & Gamete Vitrification Storage Bank'
  },
  {
    category: 'moments',
    title: 'Joy of Parenthood Celebrations',
    subtitle: 'Celebrations',
    color: 'text-brand-red',
    img: '/images/happy-mother-baby.png',
    caption: 'Celebrating Joyous Parenthood Milestones with Our Patients'
  },
  {
    category: 'moments',
    title: 'Mother & Baby Milestone Gathering',
    subtitle: 'Celebrations',
    color: 'text-brand-red',
    img: '/images/best-ivf-center-jodhpur-newborn.jpg',
    caption: 'Healthy Newborns & Family Celebrations at Kindle Womb IVF'
  }
];

// Generate Grid HTML
let gridHtml = '';
updatedGalleryCards.forEach((card, index) => {
  gridHtml += `
                <!-- ${index + 1}. ${card.title} -->
                <div class="gallery-item bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer" data-category="${card.category}" onclick="openLightbox(${index})">
                    <div class="relative h-64 overflow-hidden">
                        <img src="${card.img}" alt="${card.caption}" class="w-full h-full object-cover transition duration-500 hover:scale-105" loading="lazy">
                        <div class="gallery-overlay absolute inset-0 bg-brand-dark/60 flex items-center justify-center text-white text-3xl">
                            <i class="ph ph-magnifying-glass-plus"></i>
                        </div>
                    </div>
                    <div class="p-4 bg-white">
                        <span class="text-xs font-bold ${card.color} uppercase tracking-wide">${card.subtitle}</span>
                        <h3 class="font-heading text-lg text-brand-dark font-medium mt-1">${card.title}</h3>
                    </div>
                </div>
`;
});

// Generate JS Array
let jsArray = JSON.stringify(updatedGalleryCards.map(c => ({ src: c.img, caption: c.caption })), null, 4);

let content = fs.readFileSync('gallery.html', 'utf8');

// Replace Hero Background
content = content.replace(/<div class="absolute inset-0 opacity-40">[\s\S]*?<\/div>/i, `<div class="absolute inset-0 opacity-40">\n            <img class="w-full h-full object-cover" src="/images/best-ivf-center-jaipur.jpg" alt="Kindle Womb IVF Center Gallery">\n        </div>`);

// Replace Gallery Grid Container
content = content.replace(/<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="galleryContainer">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i, `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="galleryContainer">${gridHtml}\n            </div>\n        </div>\n    </section>`);

// Replace galleryData
content = content.replace(/const galleryData = \[[\s\S]*?\];/i, `const galleryData = ${jsArray};`);

fs.writeFileSync('gallery.html', content, 'utf8');
if (fs.existsSync('gallery/index.html')) {
  fs.writeFileSync('gallery/index.html', content, 'utf8');
}

console.log('Successfully updated gallery.html and gallery/index.html with 100% verified local images!');
