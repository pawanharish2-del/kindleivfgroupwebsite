const fs = require('fs');
const path = require('path');

const locations = [
  "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", 
  "Bharatpur", "Sikar", "Bhilwara", "Pali", "Sri Ganganagar", "Hanumangarh", 
  "Barmer", "Chittorgarh", "Nagaur", "Jhunjhunu", "Tonk", "Sawai Madhopur", "Jaisalmer",
  "Mansarovar", "Vaishali Nagar", "Malviya Nagar"
];

const keywords = [
  "Best IVF Center",
  "Best IVF Hospital",
  "Best Fertility Center",
  "Top IVF Clinic",
  "Best IVF Doctor"
];

const outputDir = path.join(__dirname, 'location-pages');

// Ensure directory exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate the global location nav block
let footerLinksHTML = '';
locations.forEach(loc => {
    footerLinksHTML += `<a href="https://kindlewombivfgroup.com/location-pages/best-ivf-center-${loc.toLowerCase().replace(/ /g, '-')}.html">${loc}</a> | \n`;
});
// Remove last pipe
footerLinksHTML = footerLinksHTML.replace(/ \| \n$/, '\n');

const globalFooterNav = `
<!-- Find an IVF Centre Near You Block (Global) -->
<div class="global-location-nav">
    <div class="container location-footer">
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
</div>
`;

// Helper to generate the AEO SEO template
function generateHTML(keyword, location) {
    const keywordSlug = keyword.toLowerCase().replace(/ /g, '-');
    const locationSlug = location.toLowerCase().replace(/ /g, '-');
    const url = `https://kindlewombivfgroup.com/location-pages/${keywordSlug}-${locationSlug}.html`;
    const imageFilename = `${keywordSlug}-${locationSlug}-newborn.jpg`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${keyword} in ${location} | Expert Fertility Specialists | Kindle Womb</title>
    <meta name="description" content="Looking for the ${keyword.toLowerCase()} in ${location}? Kindle Womb offers world-class fertility treatments. Book your consultation today.">
    <link rel="canonical" href="${url}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph Tags -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${keyword} in ${location} | Expert Fertility Specialists">
    <meta property="og:description" content="Discover advanced IVF and fertility treatments at Kindle Womb, the trusted ${keyword.toLowerCase()} in ${location}.">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="https://kindlewombivfgroup.com/images/${imageFilename}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../global.css">
    <link rel="stylesheet" href="location-pages.css">

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "name": "Kindle Womb IVF & Fertility Centre",
      "url": "${url}",
      "image": "https://kindlewombivfgroup.com/images/${imageFilename}",
      "description": "Leading ${keyword.toLowerCase()} in ${location} offering advanced reproductive technologies.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "${location}",
        "addressRegion": "Rajasthan",
        "addressCountry": "IN"
      },
      "areaServed": ["${location}"],
      "medicalSpecialty": "Gynecologic"
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What makes Kindle Womb the ${keyword.toLowerCase()} in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Kindle Womb combines advanced embryology labs, highly experienced fertility specialists, and a patient-first approach to offer comprehensive treatments in ${location}."
          }
        },
        {
          "@type": "Question",
          "name": "How long does an IVF cycle take in ${location}?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard IVF cycle typically takes about 4 to 6 weeks, starting from the initial consultation and ovulation stimulation to the embryo transfer."
          }
        }
      ]
    }
    </script>
</head>
<body>

    <!-- Header will be dynamically loaded or assumed part of the global layout -->
    <header class="main-header">
        <div class="header-container">
            <a href="https://kindlewombivfgroup.com" class="logo-area">
                <img src="../kindle-logo.png" alt="Kindle Womb IVF & Fertility Centre Logo" class="logo-img">
            </a>

            <button class="mobile-menu-toggle" aria-label="Toggle Navigation" onclick="toggleMobileMenu()">
                <i class="fa-solid fa-bars menu-icon"></i>
            </button>

            <nav class="nav-menu" id="navMenu">
                <ul>
                    <li><a href="https://kindlewombivfgroup.com" class="nav-item">Home</a></li>
                    <li><a href="https://kindlewombivfgroup.com/about" class="nav-item">About</a></li>
                    <li><a href="https://kindlewombivfgroup.com/ivf-center" class="nav-item">IVF Center</a></li>
                    <li><a href="https://kindlewombivfgroup.com/contact" class="nav-item">Contact</a></li>
                </ul>
            </nav>

            <div class="cta-area">
                <a href="tel:+91-9119112755" class="cta-button">Call Now <i class="fa-solid fa-phone phone-icon"></i></a>
            </div>
        </div>
    </header>

    <main>
        <!-- Hero Section -->
        <article class="hero-section">
            <div class="container">
                <div class="hero-content">
                    <h1>${keyword} in ${location}: Your Journey to Parenthood Starts Here</h1>
                    <p>Experience compassionate care, advanced medical technology, and personalized fertility treatments at Kindle Womb, proudly serving families across ${location} and Rajasthan.</p>
                    <a href="../contact.html" class="btn-primary">Book a Consultation</a>
                </div>
                <div class="hero-image">
                    <img src="../images/${imageFilename}" alt="Happy mother with newborn baby in ${location}" width="800" height="600" loading="lazy">
                </div>
            </div>
        </article>

        <!-- Quick Answer Box (AEO Optimization) -->
        <section class="quick-answer" aria-labelledby="quick-answer-heading">
            <div class="container">
                <h2 id="quick-answer-heading">Quick Guide: IVF in ${location}</h2>
                <div class="quick-answer-box">
                    <ul>
                        <li><strong>Primary Focus:</strong> Advanced In Vitro Fertilization (IVF) and reproductive endocrinology.</li>
                        <li><strong>Location:</strong> Serving patients in and around ${location}.</li>
                        <li><strong>Consultation:</strong> Comprehensive fertility assessment customized to individual medical needs.</li>
                        <li><strong>Next Steps:</strong> Schedule your initial diagnostic evaluation to explore suitable IVF treatment pathways.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Introduction -->
        <section class="introduction">
            <div class="container">
                <h2>Understanding Fertility Solutions in ${location}</h2>
                <p>Starting a family is a deeply personal and sometimes challenging journey. If you are searching for the ${keyword.toLowerCase()} in ${location}, it is essential to choose a facility that combines state-of-the-art medical science with genuine empathy. At Kindle Womb, we understand that every patient’s medical background is unique, which is why our approach to fertility is highly individualized.</p>
            </div>
        </section>

        <!-- Related Pages -->
        <section class="related-pages">
            <div class="container">
                <h2>Related Pages in ${location}</h2>
                <ul class="related-links-list">
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="best-ivf-center-${locationSlug}.html">Best IVF Center in ${location}</a></li>
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="best-ivf-hospital-${locationSlug}.html">Best IVF Hospital in ${location}</a></li>
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="best-fertility-center-${locationSlug}.html">Best Fertility Center in ${location}</a></li>
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="top-ivf-clinic-${locationSlug}.html">Top IVF Clinic in ${location}</a></li>
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="best-ivf-doctor-${locationSlug}.html">Best IVF Doctor in ${location}</a></li>
                    <li><i class="fa-solid fa-check text-pink-gradient"></i> <a href="../contact.html">Contact Us</a></li>
                </ul>
            </div>
        </section>

        <!-- Frequently Asked Questions -->
        <section class="faqs">
            <div class="container">
                <h2>Frequently Asked Questions</h2>
                <div class="faq-item">
                    <h3>What makes Kindle Womb the ${keyword.toLowerCase()} in ${location}?</h3>
                    <p>Kindle Womb combines advanced embryology labs, highly experienced fertility specialists, and a patient-first approach to offer comprehensive treatments in ${location}.</p>
                </div>
                <div class="faq-item">
                    <h3>How long does an IVF cycle take in ${location}?</h3>
                    <p>A standard IVF cycle typically takes about 4 to 6 weeks, starting from the initial consultation to the embryo transfer.</p>
                </div>
            </div>
        </section>

    </main>

${globalFooterNav}

<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-col col-brand">
            <div class="footer-logo-box">
                <img src="../kindle-logo.png" alt="Kindle Womb Logo" class="footer-logo-img">
            </div>
            <p class="mission-text">
                Our mission is to provide the highest standard of fertility care with compassion, science, and a deep commitment to your family building journey.
            </p>
        </div>

        <div class="footer-col">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-links">
                <li><a href="https://kindlewombivfgroup.com/about">About Us</a></li>
                <li><a href="https://kindlewombivfgroup.com/ivf-center">Our Center</a></li>
                <li><a href="https://kindlewombivfgroup.com/contact">Contact Us</a></li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy;2026 | Kindle Womb IVF Fertility Center. Designed & Developed by <a href="https://amazingit.in/" target="_blank" style="color: var(--bg-pure-white); text-decoration: underline;">Amazing IT</a>.</p>
    </div>
</footer>

</body>
</html>`;
}

// Generate all pages
locations.forEach(location => {
    keywords.forEach(keyword => {
        const keywordSlug = keyword.toLowerCase().replace(/ /g, '-');
        const locationSlug = location.toLowerCase().replace(/ /g, '-');
        const filename = `${keywordSlug}-${locationSlug}.html`;
        const filepath = path.join(outputDir, filename);

        // DO NOT BREAK OLD DATA: Only write if file doesn't exist
        if (!fs.existsSync(filepath)) {
            const html = generateHTML(keyword, location);
            fs.writeFileSync(filepath, html);
            console.log(`Created: ${filename}`);
        } else {
            console.log(`Skipped existing: ${filename}`);
        }
    });
});

console.log("Done generating pages!");
