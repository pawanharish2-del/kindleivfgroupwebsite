const fs = require('fs');

const galleryItems = [
    {
        src: '/images/gallery/gallery2 (1).avif',
        alt: 'Kindle Womb IVF Consultation & Clinical Infrastructure',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Modern Clinical Infrastructure'
    },
    {
        src: '/images/gallery/gallery2 (2).avif',
        alt: 'Embryology & Advanced Reproductive Cleanroom',
        category: 'cleanrooms',
        categoryLabel: 'Embryology Lab',
        title: 'Embryology & Cleanroom Suite'
    },
    {
        src: '/images/gallery/gallery2 (3).avif',
        alt: 'Patient Consultation Chambers & Guidance',
        category: 'consultation',
        categoryLabel: 'Consultation',
        title: 'Patient Consultation Chambers'
    },
    {
        src: '/images/gallery/gallery2 (4).avif',
        alt: 'Diagnostic Ultrasound & Imaging Suite',
        category: 'cleanrooms',
        categoryLabel: 'Diagnostics',
        title: 'Advanced Diagnostic Facility'
    },
    {
        src: '/images/gallery/gallery2 (5).avif',
        alt: 'Kindle Womb Reception & Patient Care Wing',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Reception & Patient Lounge'
    },
    {
        src: '/images/gallery/gallery2 (6).avif',
        alt: 'Specialized Andrology & Gamete Handling Facility',
        category: 'cleanrooms',
        categoryLabel: 'Embryology',
        title: 'Andrology & Gamete Laboratory'
    },
    {
        src: '/images/gallery/gallery2 (7).avif',
        alt: 'Private Patient Recovery & Care Suites',
        category: 'consultation',
        categoryLabel: 'Care Suites',
        title: 'Patient Care & Recovery Suite'
    },
    {
        src: '/images/gallery/gallery2 (8).avif',
        alt: 'Kindle Womb IVF Team & Clinical Staff',
        category: 'moments',
        categoryLabel: 'Our Team',
        title: 'Dedicated Clinical Team'
    },
    {
        src: '/images/gallery/gallery2 (9).avif',
        alt: 'State-of-the-Art IVF Procedure Room',
        category: 'cleanrooms',
        categoryLabel: 'Cleanrooms',
        title: 'Modern Procedure Cleanroom'
    },
    {
        src: '/images/gallery/gallery2 (10).avif',
        alt: 'Cryopreservation & Gamete Vitrification Bank',
        category: 'cleanrooms',
        categoryLabel: 'Cryo Bank',
        title: 'Cryopreservation Facility'
    },
    {
        src: '/images/gallery/gallery2 (11).avif',
        alt: 'Warm & Welcoming Patient Experience Area',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Welcoming Care Center'
    },
    {
        src: '/images/gallery/gallery2 (12).avif',
        alt: 'Specialist Fertility Consultation Room',
        category: 'consultation',
        categoryLabel: 'Consultation',
        title: 'Specialist Consultation Wing'
    },
    {
        src: '/images/gallery/gallery2 (13).avif',
        alt: 'Patient Counseling & Emotional Support Lounge',
        category: 'consultation',
        categoryLabel: 'Patient Care',
        title: 'Patient Counseling Lounge'
    },
    {
        src: '/images/gallery/gallery2 (14).avif',
        alt: 'Advanced ICSI & Micromanipulation Equipment',
        category: 'cleanrooms',
        categoryLabel: 'Embryology',
        title: 'Precision Micromanipulation Suite'
    },
    {
        src: '/images/gallery/gallery2 (15).avif',
        alt: 'Kindle Womb Centre Exterior & Entrance Tonk Road',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Kindle Womb Facility Entrance'
    },
    {
        src: '/images/gallery/gallery2 (16).avif',
        alt: 'Day Care & Post-Procedure Care Wing',
        category: 'consultation',
        categoryLabel: 'Day Care',
        title: 'Comfortable Day Care Suites'
    },
    {
        src: '/images/gallery/gallery2 (17).avif',
        alt: 'Kindle Womb Community & Awareness Events',
        category: 'moments',
        categoryLabel: 'Events',
        title: 'Health & Fertility Awareness Camps'
    },
    {
        src: '/images/gallery/gallery2 (18).avif',
        alt: 'Modern IVF Operating & Laparoscopy Suite',
        category: 'cleanrooms',
        categoryLabel: 'OT Suite',
        title: 'Laparoscopic & IVF OT Suite'
    },
    {
        src: '/images/gallery/gallery2 (19).avif',
        alt: 'Patient Success & Parenthood Milestones',
        category: 'moments',
        categoryLabel: 'Milestones',
        title: 'Joyous Parenthood Milestones'
    },
    {
        src: '/images/gallery/gallery2 (20).avif',
        alt: 'Clinical Pharmacy & Patient Assistance Desk',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Patient Support & Assistance'
    },
    {
        src: '/images/gallery/gallery2 (21).avif',
        alt: 'Embryologist Monitoring & Time-Lapse Incubators',
        category: 'cleanrooms',
        categoryLabel: 'Embryology',
        title: 'Time-Lapse Incubators & Monitoring'
    },
    {
        src: '/images/gallery/gallery2 (22).avif',
        alt: 'Celebrating New Life & Happy Families',
        category: 'moments',
        categoryLabel: 'Celebrations',
        title: 'Celebrating Miracle Babies'
    },
    {
        src: '/images/gallery/gallery-photo-4.jpg',
        alt: 'Kindle Womb IVF Clinic Facility',
        category: 'infrastructure',
        categoryLabel: 'Infrastructure',
        title: 'Clinical Environment & Patient Care'
    }
];

let cardsHtml = '';
const galleryData = [];

const categoryColors = {
    cleanrooms: 'text-brand-gold',
    infrastructure: 'text-brand-red',
    consultation: 'text-brand-blue',
    moments: 'text-brand-goldDark'
};

galleryItems.forEach((item, index) => {
    galleryData.push({
        src: item.src,
        caption: item.title + ' - ' + item.alt
    });

    const colorClass = categoryColors[item.category] || 'text-brand-blue';

    cardsHtml += '                <!-- ' + (index + 1) + '. ' + item.title + ' -->\n' +
        '                <div class="gallery-item bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer" data-category="' + item.category + '" onclick="openLightbox(' + index + ')">\n' +
        '                    <div class="relative h-64 overflow-hidden bg-gray-50">\n' +
        '                        <img src="' + item.src + '" alt="' + item.alt + '" class="w-full h-full object-cover transition duration-500 hover:scale-105" loading="lazy">\n' +
        '                        <div class="gallery-overlay absolute inset-0 bg-brand-dark/60 flex items-center justify-center text-white text-3xl">\n' +
        '                            <i class="ph ph-magnifying-glass-plus"></i>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="p-4 bg-white">\n' +
        '                        <span class="text-xs font-bold ' + colorClass + ' uppercase tracking-wide">' + item.categoryLabel + '</span>\n' +
        '                        <h3 class="font-heading text-lg text-brand-dark font-medium mt-1">' + item.title + '</h3>\n' +
        '                    </div>\n' +
        '                </div>\n\n';
});

let galleryHtml = fs.readFileSync('gallery.html', 'utf8');

const containerRegex = /<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="galleryContainer">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/;

const newGridHtml = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="galleryContainer">\n' + cardsHtml + '            </div>\n        </div>\n    </section>';

galleryHtml = galleryHtml.replace(containerRegex, newGridHtml);

const dataRegex = /const galleryData = \[[\s\S]*?\];/;
galleryHtml = galleryHtml.replace(dataRegex, 'const galleryData = ' + JSON.stringify(galleryData, null, 4) + ';');

fs.writeFileSync('gallery.html', galleryHtml, 'utf8');
console.log('Successfully updated gallery.html with ' + galleryItems.length + ' gallery images!');


