const fs = require('fs');

const images = [
    '/images/gallery/gallery2 (1).avif',
    '/images/gallery/gallery2 (2).avif',
    '/images/gallery/gallery2 (3).avif',
    '/images/gallery/gallery2 (4).avif',
    '/images/gallery/gallery2 (5).avif',
    '/images/gallery/gallery2 (6).avif',
    '/images/gallery/gallery2 (7).avif',
    '/images/gallery/gallery2 (8).avif',
    '/images/gallery/gallery2 (9).avif',
    '/images/gallery/gallery2 (10).avif',
    '/images/gallery/gallery2 (11).avif',
    '/images/gallery/gallery2 (12).avif',
    '/images/gallery/gallery2 (13).avif',
    '/images/gallery/gallery2 (14).avif',
    '/images/gallery/gallery2 (15).avif',
    '/images/gallery/gallery2 (16).avif',
    '/images/gallery/gallery2 (17).avif',
    '/images/gallery/gallery2 (18).avif',
    '/images/gallery/gallery2 (19).avif',
    '/images/gallery/gallery2 (20).avif',
    '/images/gallery/gallery2 (21).avif',
    '/images/gallery/gallery2 (22).avif',
    '/images/gallery/gallery-photo-4.jpg'
];

let cardsHtml = '';
const galleryData = [];

images.forEach((src, index) => {
    galleryData.push({ src: src });

    cardsHtml += '                <div class="gallery-item group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 bg-gray-100 cursor-pointer aspect-[4/3] transition-all duration-300" onclick="openLightbox(' + index + ')">\n' +
        '                    <img src="' + src + '" alt="Kindle Womb IVF Gallery Photo" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">\n' +
        '                    <div class="gallery-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-3xl">\n' +
        '                        <i class="ph ph-magnifying-glass-plus"></i>\n' +
        '                    </div>\n' +
        '                </div>\n';
});

let galleryHtml = fs.readFileSync('gallery.html', 'utf8');

// Replace Gallery Section (without filter buttons and without titles)
const gallerySectionRegex = /<!-- ==========================================\s*GALLERY FILTER & GRID SECTION[\s\S]*?<!-- ==========================================\s*LIGHTBOX MODAL/;

const newGallerySection = '<!-- ==========================================\n' +
    '         GALLERY PHOTO GRID SECTION\n' +
    '         ========================================== -->\n' +
    '    <section class="py-12 md:py-16 bg-white">\n' +
    '        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">\n' +
    '            <!-- Simple Responsive Image Grid -->\n' +
    '            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" id="galleryContainer">\n' +
    cardsHtml +
    '            </div>\n' +
    '        </div>\n' +
    '    </section>\n\n' +
    '    <!-- ==========================================\n' +
    '         LIGHTBOX MODAL';

galleryHtml = galleryHtml.replace(gallerySectionRegex, newGallerySection);

// Update Lightbox HTML to remove text captions
const lightboxModalRegex = /<div id="lightboxModal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newLightboxModal = '<div id="lightboxModal" class="lightbox-modal">\n' +
    '        <button class="absolute top-6 right-6 text-white text-3xl hover:text-brand-gold transition z-50 p-2" onclick="closeLightbox()" aria-label="Close Lightbox">\n' +
    '            <i class="ph ph-x"></i>\n' +
    '        </button>\n' +
    '        \n' +
    '        <button class="absolute left-4 md:left-8 text-white text-4xl hover:text-brand-gold transition z-50 p-3 bg-black/40 rounded-full" onclick="prevImage()" aria-label="Previous Image">\n' +
    '            <i class="ph ph-caret-left"></i>\n' +
    '        </button>\n' +
    '        \n' +
    '        <button class="absolute right-4 md:right-8 text-white text-4xl hover:text-brand-gold transition z-50 p-3 bg-black/40 rounded-full" onclick="nextImage()" aria-label="Next Image">\n' +
    '            <i class="ph ph-caret-right"></i>\n' +
    '        </button>\n\n' +
    '        <div class="max-w-5xl max-h-[88vh] text-center flex flex-col items-center justify-center p-4">\n' +
    '            <img id="lightboxImg" src="" alt="Kindle Womb IVF Clinic Photo" class="max-h-[82vh] max-w-full rounded-2xl shadow-2xl object-contain">\n' +
    '        </div>\n' +
    '    </div>';

galleryHtml = galleryHtml.replace(lightboxModalRegex, newLightboxModal);

// Update JS galleryData and openLightbox function
const dataRegex = /const galleryData = \[[\s\S]*?\];/;
galleryHtml = galleryHtml.replace(dataRegex, 'const galleryData = ' + JSON.stringify(galleryData, null, 4) + ';');

const openLightboxRegex = /function openLightbox\(index\) \{[\s\S]*?document\.body\.style\.overflow = 'hidden';\s*\}/;
const newOpenLightbox = 'function openLightbox(index) {\n' +
    '            currentLightboxIndex = index;\n' +
    '            const modal = document.getElementById("lightboxModal");\n' +
    '            const img = document.getElementById("lightboxImg");\n' +
    '            img.src = galleryData[index].src;\n' +
    '            modal.classList.add("active");\n' +
    '            document.body.style.overflow = "hidden";\n' +
    '        }';
galleryHtml = galleryHtml.replace(openLightboxRegex, newOpenLightbox);

// Remove unused filterGallery JS function if present
galleryHtml = galleryHtml.replace(/\/\/ Filtering\s*function filterGallery[\s\S]*?\}\s*\}/, '');

fs.writeFileSync('gallery.html', galleryHtml, 'utf8');
console.log('Successfully simplified gallery.html: removed categories & titles, pure clean image grid!');



