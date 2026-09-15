const fs = require('fs');
const path = require('path');

console.log('=== FIXING BROKEN INTERNAL LINKS ===');

// 1. Remove readme.html legacy file
if (fs.existsSync('readme.html')) {
  fs.unlinkSync('readme.html');
  console.log('Deleted legacy readme.html file.');
}

// 2. Fix treatment links in location-pages
const locDir = 'location-pages';
if (fs.existsSync(locDir)) {
  fs.readdirSync(locDir).forEach(file => {
    if (!file.endsWith('.html')) return;
    const fullPath = path.join(locDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;

    content = content.replace(/\.\.\/treatments\/ivf\.html/g, '../ivf.html');
    content = content.replace(/\.\.\/treatments\/icsi\.html/g, '../icsi.html');
    content = content.replace(/\.\.\/treatments\/iui\.html/g, '../iui.html');
    content = content.replace(/\.\.\/treatments\//g, '../');

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed treatment links in ${file}`);
    }
  });
}

// 3. Fix best-ivf-center-jaipur.html root link targets
if (fs.existsSync('best-ivf-center-jaipur.html')) {
  let content = fs.readFileSync('best-ivf-center-jaipur.html', 'utf8');
  // Replace links like /best-ivf-center-jodhpur.html with location-pages/best-ivf-center-jodhpur.html
  // and remove non-existent ones like churu, rajsamand, bhiwadi
  const validDistricts = [
    'jodhpur', 'udaipur', 'kota', 'ajmer', 'bikaner', 'mansarovar', 'vaishali-nagar',
    'malviya-nagar', 'bhilwara', 'sikar', 'alwar', 'jhunjhunu', 'chittorgarh',
    'nagaur', 'pali', 'sri-ganganagar', 'hanumangarh', 'bharatpur', 'barmer',
    'jaisalmer', 'tonk', 'sawai-madhopur'
  ];

  validDistricts.forEach(dist => {
    const regex = new RegExp(`href=["']\\/best-ivf-center-${dist}\\.html["']`, 'g');
    content = content.replace(regex, `href="location-pages/best-ivf-center-${dist}.html"`);
  });

  // Clean up any remaining broken links to churu, rajsamand, bhiwadi
  content = content.replace(/<a[^>]*href=["']\/best-ivf-center-(?:churu|rajsamand|bhiwadi)\.html["'][^>]*>[\s\S]*?<\/a>/gi, '');

  fs.writeFileSync('best-ivf-center-jaipur.html', content, 'utf8');
  console.log('Fixed link targets in root best-ivf-center-jaipur.html');
}

// 4. Fix all-locations.html link targets
if (fs.existsSync('all-locations.html')) {
  let content = fs.readFileSync('all-locations.html', 'utf8');
  content = content.replace(/<a[^>]*href=["']location-pages\/best-ivf-center-(?:churu|rajsamand|bhiwadi)\.html["'][^>]*>[\s\S]*?<\/a>/gi, '');
  // Also check if any card or item has it
  content = content.replace(/location-pages\/best-ivf-center-churu\.html/g, 'location-pages/best-ivf-center-bikaner.html');
  content = content.replace(/location-pages\/best-ivf-center-rajsamand\.html/g, 'location-pages/best-ivf-center-udaipur.html');
  content = content.replace(/location-pages\/best-ivf-center-bhiwadi\.html/g, 'location-pages/best-ivf-center-alwar.html');

  fs.writeFileSync('all-locations.html', content, 'utf8');
  console.log('Fixed link targets in all-locations.html');
}

// 5. Check all HTML files for any leading slash relative links like href="/best-ivf-center-...
function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

walk('.').forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace leading slash internal page links with relative paths
  content = content.replace(/href=["']\/([a-zA-Z0-9_\-]+\.html)["']/g, (m, p1) => {
    if (file.includes('location-pages') || file.includes('posts')) {
      return `href="../${p1}"`;
    }
    return `href="${p1}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Normalized leading slash links in ${file}`);
  }
});

console.log('All link fixes applied successfully.');
