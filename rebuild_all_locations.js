const fs = require('fs');

const header = fs.readFileSync('header.html', 'utf8');
const footer = fs.readFileSync('footer.html', 'utf8');

const majorCities = [
    { name: 'Jaipur', slug: 'best-ivf-center-jaipur' },
    { name: 'Jodhpur', slug: 'best-ivf-center-jodhpur' },
    { name: 'Udaipur', slug: 'best-ivf-center-udaipur' },
    { name: 'Kota', slug: 'best-ivf-center-kota' },
    { name: 'Ajmer', slug: 'best-ivf-center-ajmer' },
    { name: 'Bikaner', slug: 'best-ivf-center-bikaner' }
];

const jaipurAreas = [
    { name: 'Mansarovar', slug: 'best-ivf-center-mansarovar' },
    { name: 'Vaishali Nagar', slug: 'best-ivf-center-vaishali-nagar' },
    { name: 'Malviya Nagar', slug: 'best-ivf-center-malviya-nagar' }
];

const rajasthanDistricts = [
    { name: 'Bhilwara', slug: 'best-ivf-center-bhilwara' },
    { name: 'Sikar', slug: 'best-ivf-center-sikar' },
    { name: 'Alwar', slug: 'best-ivf-center-alwar' },
    { name: 'Jhunjhunu', slug: 'best-ivf-center-jhunjhunu' },
    { name: 'Churu', slug: 'best-ivf-center-churu' },
    { name: 'Chittorgarh', slug: 'best-ivf-center-chittorgarh' },
    { name: 'Rajsamand', slug: 'best-ivf-center-rajsamand' },
    { name: 'Sri Ganganagar', slug: 'best-ivf-center-sri-ganganagar' },
    { name: 'Hanumangarh', slug: 'best-ivf-center-hanumangarh' },
    { name: 'Bhiwadi', slug: 'best-ivf-center-bhiwadi' },
    { name: 'Bharatpur', slug: 'best-ivf-center-bharatpur' },
    { name: 'Pali', slug: 'best-ivf-center-pali' },
    { name: 'Nagaur', slug: 'best-ivf-center-nagaur' },
    { name: 'Barmer', slug: 'best-ivf-center-barmer' }
];

function buildGrid(locations) {
    return locations.map(loc => `
        <a href="location-pages/${loc.slug}.html" class="location-card">
            <div class="card-icon"><i class="fa-solid fa-location-dot"></i></div>
            <div class="card-content">
                <h3>${loc.name}</h3>
                <span>View IVF Centers</span>
            </div>
            <div class="card-arrow"><i class="fa-solid fa-arrow-right"></i></div>
        </a>
    `).join('');
}

const customCSS = `
<style>
    .location-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: #ffffff;
        border: 1px solid rgba(0,0,0,0.06);
        border-radius: 12px;
        text-decoration: none;
        color: var(--navy-blue);
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        transition: all 0.3s ease;
    }
    .location-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        border-color: var(--brand-rust);
    }
    .location-card .card-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--soft-cream);
        color: var(--brand-rust);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s ease;
    }
    .location-card:hover .card-icon {
        background: var(--brand-rust);
        color: #ffffff;
    }
    .location-card .card-content h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        color: var(--navy-blue);
        transition: color 0.3s ease;
    }
    .location-card:hover .card-content h3 {
        color: var(--brand-rust);
    }
    .location-card .card-content span {
        font-size: 13px;
        color: var(--text-dark);
        opacity: 0.7;
    }
    .location-card .card-arrow {
        margin-left: auto;
        color: var(--brand-rust);
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
    }
    .location-card:hover .card-arrow {
        opacity: 1;
        transform: translateX(0);
    }
    .locations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
    }
    .section-title {
        font-size: 28px;
        color: var(--navy-blue);
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 2px solid var(--soft-cream);
        display: flex;
        align-items: center;
        gap: 15px;
    }
</style>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/jpeg" href="favicon.jpg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All IVF Locations in Rajasthan | Kindle Womb IVF</title>
    
    <meta name="description" content="Directory of all 138 Kindle Womb IVF & Fertility Centre locations across Rajasthan, providing world-class fertility care near you.">
    <link rel="canonical" href="https://kindlewombivfgroup.com/all-locations.html">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="global.css">
    
    ${customCSS}
</head>
<body>

${header}

<main class="locations-directory-page">
    <!-- Hero Banner -->
    <section class="locations-hero" style="background: linear-gradient(135deg, var(--soft-cream) 0%, #f9f5f2 100%); padding: 80px 20px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
            <span style="color: var(--brand-rust); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; margin-bottom: 15px; display: block;">Our Network</span>
            <h1 style="font-size: 46px; color: var(--navy-blue); font-weight: 700; margin-bottom: 20px; line-height: 1.2;">All IVF Locations</h1>
            <p style="font-size: 18px; color: var(--text-dark); opacity: 0.8; line-height: 1.6; max-width: 600px; margin: 0 auto;">Discover world-class fertility care near you. Select your location below to find the best IVF specialists and advanced treatment centers across Rajasthan.</p>
        </div>
    </section>

    <!-- Directory Content -->
    <section class="locations-list-section" style="padding: 80px 20px; background: #fafafa;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
            
            <div class="location-category" style="margin-bottom: 70px;">
                <h2 class="section-title">
                    <i class="fa-solid fa-city" style="color: var(--brand-rust);"></i> Major Cities
                </h2>
                <div class="locations-grid">
                    ${buildGrid(majorCities)}
                </div>
            </div>

            <div class="location-category" style="margin-bottom: 70px;">
                <h2 class="section-title">
                    <i class="fa-solid fa-map-location-dot" style="color: var(--brand-rust);"></i> Jaipur Hyper-Local Areas
                </h2>
                <div class="locations-grid">
                    ${buildGrid(jaipurAreas)}
                </div>
            </div>

            <div class="location-category" style="margin-bottom: 70px;">
                <h2 class="section-title">
                    <i class="fa-solid fa-map" style="color: var(--brand-rust);"></i> Rajasthan Districts
                </h2>
                <div class="locations-grid">
                    ${buildGrid(rajasthanDistricts)}
                </div>
            </div>

        </div>
    </section>
</main>

${footer}

</body>
</html>
`;

fs.writeFileSync('all-locations.html', html, 'utf8');
console.log('all-locations.html rebuilt successfully!');
