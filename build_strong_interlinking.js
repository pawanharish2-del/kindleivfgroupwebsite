const fs = require('fs');
const path = require('path');

console.log('=== MASTER STRONG INTERNAL LINKING ENGINE ===');

// Master Geographic Clusters for Rajasthan Locations
const geoClusters = {
  'jaipur': ['mansarovar', 'vaishali-nagar', 'malviya-nagar', 'tonk', 'sikar', 'ajmer', 'alwar'],
  'mansarovar': ['jaipur', 'vaishali-nagar', 'malviya-nagar', 'tonk', 'sikar', 'ajmer'],
  'vaishali-nagar': ['jaipur', 'mansarovar', 'malviya-nagar', 'sikar', 'alwar', 'ajmer'],
  'malviya-nagar': ['jaipur', 'mansarovar', 'vaishali-nagar', 'tonk', 'sawai-madhopur', 'ajmer'],
  'jodhpur': ['pali', 'barmer', 'jaisalmer', 'nagaur', 'bikaner', 'ajmer', 'jaipur'],
  'udaipur': ['chittorgarh', 'bhilwara', 'pali', 'jodhpur', 'kota', 'ajmer', 'jaipur'],
  'kota': ['sawai-madhopur', 'tonk', 'bhilwara', 'udaipur', 'jaipur', 'ajmer'],
  'ajmer': ['jaipur', 'nagaur', 'bhilwara', 'tonk', 'sikar', 'jodhpur', 'bikaner'],
  'bikaner': ['sri-ganganagar', 'hanumangarh', 'nagaur', 'jodhpur', 'jaisalmer', 'churu', 'jaipur'],
  'alwar': ['bharatpur', 'jaipur', 'sikar', 'jhunjhunu', 'sawai-madhopur'],
  'bharatpur': ['alwar', 'sawai-madhopur', 'jaipur', 'tonk'],
  'sikar': ['jhunjhunu', 'jaipur', 'alwar', 'nagaur', 'bikaner', 'ajmer'],
  'jhunjhunu': ['sikar', 'alwar', 'churu', 'jaipur', 'bikaner'],
  'bhilwara': ['ajmer', 'chittorgarh', 'udaipur', 'kota', 'tonk', 'jaipur'],
  'pali': ['jodhpur', 'jaisalmer', 'barmer', 'udaipur', 'ajmer', 'nagaur'],
  'barmer': ['jaisalmer', 'jodhpur', 'pali', 'bikaner', 'jaipur'],
  'jaisalmer': ['barmer', 'jodhpur', 'bikaner', 'pali', 'jaipur'],
  'chittorgarh': ['udaipur', 'bhilwara', 'kota', 'pali', 'jaipur'],
  'nagaur': ['ajmer', 'jodhpur', 'bikaner', 'sikar', 'jaipur'],
  'sri-ganganagar': ['hanumangarh', 'bikaner', 'churu', 'jaipur'],
  'hanumangarh': ['sri-ganganagar', 'bikaner', 'churu', 'jaipur'],
  'tonk': ['jaipur', 'sawai-madhopur', 'kota', 'ajmer', 'bhilwara'],
  'sawai-madhopur': ['tonk', 'kota', 'bharatpur', 'jaipur', 'alwar']
};

// All available blog posts
const postsDir = 'posts';
let blogPosts = [];
if (fs.existsSync(postsDir)) {
  blogPosts = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.html') && f !== 'template.html')
    .map(f => {
      const slug = f.replace(/\.html$/, '');
      const content = fs.readFileSync(path.join(postsDir, f), 'utf8');
      const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i) || content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/\|.*/, '').trim() : slug.replace(/-/g, ' ');
      return { slug, title, url: `/posts/${slug}` };
    });
}

// 1. Contextual keywords replacement helper
const contextualRules = [
  { keyword: 'In Vitro Fertilization (IVF)', url: '/ivf', text: 'In Vitro Fertilization (IVF)' },
  { keyword: 'Intrauterine Insemination (IUI)', url: '/iui', text: 'Intrauterine Insemination (IUI)' },
  { keyword: 'Intracytoplasmic Sperm Injection (ICSI)', url: '/icsi', text: 'Intracytoplasmic Sperm Injection (ICSI)' },
  { keyword: 'Donor IVF Services', url: '/donor-ivf-services', text: 'Donor IVF Services' },
  { keyword: 'Surgical Sperm Retrieval', url: '/sperm-retrieval', text: 'Surgical Sperm Retrieval' },
  { keyword: 'Infertility Assessment', url: '/infertility-assessment', text: 'Infertility Assessment' },
  { keyword: 'Advanced Fertility Technology', url: '/advance-technology', text: 'Advanced Fertility Technology' },
  { keyword: 'Fertility Enhancing Surgeries', url: '/fertility-enhancing-surgeries', text: 'Fertility Enhancing Surgeries' },
  { keyword: 'Gestational Surrogacy', url: '/what-is-surrogacy', text: 'Gestational Surrogacy' }
];

function applyContextualKeywords(html, currentUrl) {
  let modified = html;
  contextualRules.forEach(rule => {
    if (rule.url === currentUrl) return; // don't link to self
    
    // Only replace outside existing <a> tags or headings
    const regex = new RegExp(`(?<!<a[^>]*>[^<]*)(?<!<h[1-6][^>]*>[^<]*)\\b(${rule.keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b(?![^<]*<\\/a>)`, 'i');
    if (regex.test(modified)) {
      modified = modified.replace(regex, `<a href="${rule.url}" class="contextual-seo-link" style="color: #A94E46; font-weight: 600; text-decoration: underline; text-underline-offset: 3px;">$1</a>`);
    }
  });
  return modified;
}

// 2. Interlink Location Pages
const locDir = 'location-pages';
if (fs.existsSync(locDir)) {
  const locFiles = fs.readdirSync(locDir).filter(f => f.endsWith('.html'));
  console.log(`Injecting strong interlinks into ${locFiles.length} location pages...`);

  locFiles.forEach(file => {
    const filePath = path.join(locDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.html$/, '');

    // Identify city
    let cityKey = Object.keys(geoClusters).find(k => slug.includes(k)) || 'jaipur';
    const relatedCityKeys = geoClusters[cityKey] || ['jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer'];

    // Generate Nearby Locations Matrix HTML
    let nearbyLinksHtml = '';
    relatedCityKeys.slice(0, 6).forEach(cKey => {
      const cName = cKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      nearbyLinksHtml += `<a href="/location-pages/best-ivf-center-${cKey}" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:30px; color:#2C3E50; text-decoration:none; font-size:0.9rem; font-weight:500; transition:all 0.2s ease;"><i class="fa-solid fa-location-dot" style="color:#E74C3C;"></i> ${cName} Center</a>\n`;
    });

    // Generate Related Treatments Matrix HTML
    const treatments = [
      { name: 'IVF Treatment', url: '/ivf', icon: 'fa-dna' },
      { name: 'IUI Treatment', url: '/iui', icon: 'fa-microscope' },
      { name: 'ICSI Process', url: '/icsi', icon: 'fa-syringe' },
      { name: 'Donor IVF', url: '/donor-ivf-services', icon: 'fa-hand-holding-heart' },
      { name: 'Infertility Check', url: '/infertility-assessment', icon: 'fa-clipboard-check' },
      { name: 'Sperm Retrieval', url: '/sperm-retrieval', icon: 'fa-user-doctor' },
      { name: 'Advanced Tech', url: '/advance-technology', icon: 'fa-wand-magic-sparkles' },
      { name: 'Fertility Surgery', url: '/fertility-enhancing-surgeries', icon: 'fa-heart-pulse' }
    ];
    let treatmentLinksHtml = '';
    treatments.forEach(t => {
      treatmentLinksHtml += `<a href="${t.url}" style="display:inline-flex; align-items:center; gap:6px; padding:10px 18px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:30px; color:#36507A; text-decoration:none; font-size:0.9rem; font-weight:600; transition:all 0.2s ease;"><i class="fa-solid ${t.icon}" style="color:#F2B830;"></i> ${t.name}</a>\n`;
    });

    // Generate 3 Related Blog Guides
    const shuffledBlogs = [...blogPosts].sort(() => 0.5 - Math.random()).slice(0, 3);
    let blogLinksHtml = '';
    shuffledBlogs.forEach(b => {
      blogLinksHtml += `<li style="margin-bottom:12px; display:flex; align-items:flex-start; gap:10px;"><i class="fa-solid fa-circle-arrow-right" style="color:#E74C3C; margin-top:4px; font-size:0.85rem;"></i> <a href="${b.url}" style="color:#2C3E50; text-decoration:none; font-weight:500; font-size:0.95rem; transition:color 0.2s ease;">${b.title}</a></li>\n`;
    });

    // Interlink Section Block
    const interlinkBlock = `
    <!-- ==========================================
         COMPREHENSIVE SEO INTERLINKING HUB
         ========================================== -->
    <section class="kw-interlink-hub" style="background-color:#F8FAFC; padding:60px 20px; border-top:1px solid #E2E8F0; border-bottom:1px solid #E2E8F0;">
        <div style="max-width:1200px; margin:0 auto;">
            <div style="text-align:center; margin-bottom:45px;">
                <span style="color:#E74C3C; font-weight:700; font-size:0.85rem; text-transform:uppercase; letter-spacing:1.5px;">Integrated Care Network</span>
                <h2 style="font-family:'Marcellus',serif; font-size:clamp(1.8rem, 3.5vw, 2.4rem); color:#2C3E50; margin-top:8px;">Explore Specialized Fertility Solutions & Centers</h2>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:35px;">
                <!-- Column 1: Core Treatments -->
                <div style="background:#FFFFFF; padding:30px; border-radius:18px; border:1px solid #E2E8F0; box-shadow:0 4px 15px rgba(90,115,156,0.06);">
                    <h3 style="font-family:'Marcellus',serif; font-size:1.3rem; color:#36507A; margin-bottom:18px; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-dna" style="color:#E74C3C;"></i> Advanced Treatments</h3>
                    <p style="font-size:0.95rem; color:#555; margin-bottom:20px;">Explore precision ART procedures tailored to your reproductive health:</p>
                    <div style="display:flex; flex-wrap:wrap; gap:10px;">
                        ${treatmentLinksHtml}
                    </div>
                </div>

                <!-- Column 2: Regional Network -->
                <div style="background:#FFFFFF; padding:30px; border-radius:18px; border:1px solid #E2E8F0; box-shadow:0 4px 15px rgba(90,115,156,0.06);">
                    <h3 style="font-family:'Marcellus',serif; font-size:1.3rem; color:#36507A; margin-bottom:18px; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-map-location-dot" style="color:#E74C3C;"></i> Neighboring Rajasthan Hubs</h3>
                    <p style="font-size:0.95rem; color:#555; margin-bottom:20px;">Kindle Womb satellite consultation & clinical access centers:</p>
                    <div style="display:flex; flex-wrap:wrap; gap:10px;">
                        ${nearbyLinksHtml}
                    </div>
                    <div style="margin-top:20px; padding-top:15px; border-top:1px dashed #CBD5E1;">
                        <a href="/all-locations" style="color:#36507A; font-weight:700; font-size:0.9rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">View All 20+ Rajasthan Locations <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>

                <!-- Column 3: Clinical Insights -->
                <div style="background:#FFFFFF; padding:30px; border-radius:18px; border:1px solid #E2E8F0; box-shadow:0 4px 15px rgba(90,115,156,0.06);">
                    <h3 style="font-family:'Marcellus',serif; font-size:1.3rem; color:#36507A; margin-bottom:18px; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-book-medical" style="color:#E74C3C;"></i> Clinical Guides & Insights</h3>
                    <p style="font-size:0.95rem; color:#555; margin-bottom:20px;">Doctor-reviewed guides on IVF success, preparation, and costs:</p>
                    <ul style="list-style:none; padding:0; margin:0;">
                        ${blogLinksHtml}
                    </ul>
                    <div style="margin-top:20px; padding-top:15px; border-top:1px dashed #CBD5E1;">
                        <a href="/blogs" style="color:#36507A; font-weight:700; font-size:0.9rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">Explore Fertility Insights Blog <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;

    // Remove older interlink modules if present
    content = content.replace(/<!-- INTERLINKING MODULE -->[\s\S]*?<!-- END INTERLINKING MODULE -->/gi, '');
    content = content.replace(/<!-- ==========================================\s*COMPREHENSIVE SEO INTERLINKING HUB[\s\S]*?<\/section>/gi, '');

    // Inject before footer or before </main>
    if (content.includes('<footer class="site-footer">')) {
      content = content.replace('<footer class="site-footer">', `${interlinkBlock}\n    <footer class="site-footer">`);
    } else if (content.includes('</main>')) {
      content = content.replace('</main>', `${interlinkBlock}\n    </main>`);
    }

    // Apply contextual keywords
    content = applyContextualKeywords(content, `/location-pages/${slug}`);

    fs.writeFileSync(filePath, content, 'utf8');
  });
}

// 3. Interlink Blog Posts
if (fs.existsSync(postsDir)) {
  const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.html') && f !== 'template.html');
  console.log(`Injecting strong interlinks into ${postFiles.length} blog post pages...`);

  postFiles.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.html$/, '');

    // Breadcrumb HTML
    const breadcrumbHtml = `
    <nav class="post-breadcrumb" aria-label="Breadcrumb" style="padding:15px 0; margin-bottom:25px; font-size:0.9rem; color:#64748B; border-bottom:1px solid #E2E8F0;">
        <a href="/" style="color:#5A739C; text-decoration:none;">Home</a> &gt; 
        <a href="/blogs" style="color:#5A739C; text-decoration:none;">Insights & Blogs</a> &gt; 
        <span style="color:#2C3E50; font-weight:600;">Article</span>
    </nav>
    `;

    // Related Posts & Treatment Widget
    const shuffledPosts = blogPosts.filter(b => b.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3);
    let relatedPostsHtml = '';
    shuffledPosts.forEach(p => {
      relatedPostsHtml += `<li style="margin-bottom:14px; display:flex; align-items:flex-start; gap:10px;"><i class="fa-solid fa-newspaper" style="color:#E74C3C; margin-top:4px;"></i> <a href="${p.url}" style="color:#2C3E50; text-decoration:none; font-weight:600; line-height:1.4;">${p.title}</a></li>\n`;
    });

    const postInterlinkWidget = `
    <!-- ==========================================
         RELATED CLINICAL GUIDES & TREATMENTS WIDGET
         ========================================== -->
    <div class="post-seo-interlinks" style="margin:50px 0 30px 0; padding:35px; background:#F8FAFC; border-radius:18px; border:1px solid #E2E8F0;">
        <h3 style="font-family:'Marcellus',serif; font-size:1.4rem; color:#2C3E50; margin-bottom:20px; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-notes-medical" style="color:#E74C3C;"></i> Related Clinical Treatments & Patient Resources</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:25px; margin-bottom:25px;">
            <div>
                <h4 style="font-size:1rem; color:#36507A; margin-bottom:12px; font-weight:700;">Specialized Treatments</h4>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">
                    <a href="/ivf" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">IVF Treatment</a>
                    <a href="/iui" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">IUI Process</a>
                    <a href="/icsi" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">ICSI Treatment</a>
                    <a href="/donor-ivf-services" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">Donor IVF</a>
                    <a href="/sperm-retrieval" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">Sperm Retrieval</a>
                    <a href="/advance-technology" style="padding:6px 14px; background:#FFFFFF; border:1px solid #CBD5E1; border-radius:20px; color:#2C3E50; text-decoration:none; font-size:0.85rem; font-weight:600;">Laser Hatching</a>
                </div>
            </div>
            <div>
                <h4 style="font-size:1rem; color:#36507A; margin-bottom:12px; font-weight:700;">Recommended Articles</h4>
                <ul style="list-style:none; padding:0; margin:0;">
                    ${relatedPostsHtml}
                </ul>
            </div>
        </div>
        <div style="background:#FFFFFF; padding:20px; border-radius:12px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:15px; border:1px solid #E2E8F0;">
            <div>
                <strong style="color:#2C3E50; font-size:1rem; display:block;">Need Personalized Medical Guidance?</strong>
                <span style="color:#64748B; font-size:0.9rem;">Consult with Medical Director Dr. Girraj Prasad Swarnkar at Kindle Womb IVF Jaipur.</span>
            </div>
            <a href="/contact" style="padding:10px 24px; background:#F2B830; color:#2C3E50; font-weight:700; border-radius:30px; text-decoration:none; font-size:0.9rem; white-space:nowrap; box-shadow:0 4px 12px rgba(242,184,48,0.3);">Book Consultation</a>
        </div>
    </div>
    `;

    // Remove older widgets if present
    content = content.replace(/<!-- ==========================================\s*RELATED CLINICAL GUIDES[\s\S]*?<\/div>\s*<\/div>/gi, '');

    // Inject before footer or author section
    if (content.includes('<footer class="site-footer">')) {
      content = content.replace('<footer class="site-footer">', `${postInterlinkWidget}\n    <footer class="site-footer">`);
    }

    // Apply contextual keywords
    content = applyContextualKeywords(content, `/posts/${slug}`);

    fs.writeFileSync(filePath, content, 'utf8');
  });
}

// 4. Interlink Root Service Pages
const rootPagesToInterlink = [
  'ivf.html', 'iui.html', 'icsi.html', 'donor-ivf-services.html',
  'sperm-retrieval.html', 'infertility-assessment.html', 'advance-technology.html',
  'fertility-enhancing-surgeries.html', 'what-is-surrogacy.html',
  'frequently-asked-questions.html', 'ivf-center.html', 'services.html'
];

rootPagesToInterlink.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const slug = file.replace(/\.html$/, '');
    content = applyContextualKeywords(content, `/${slug}`);
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Master strong interlinking applied across all pages!');
