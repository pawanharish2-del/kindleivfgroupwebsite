const fs = require('fs');
const path = require('path');

console.log('=== RUNNING PASS 2: COMPREHENSIVE AUTO-FIX ENGINE ===');

// 1. Walk all HTML, JS, CSS, and config files
function walkAll(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        results = results.concat(walkAll(full));
      }
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.xml') || file.endsWith('.txt') || file === '.htaccess') {
      results.push(full);
    }
  });
  return results;
}

const allFiles = walkAll('.');
console.log(`Processing ${allFiles.length} files for domain normalization & URL updates...`);

let fixedDomainFiles = 0;

allFiles.forEach(filePath => {
  // Skip audit scripts themselves to avoid false matches
  if (filePath.includes('audit') || filePath.includes('check_') || filePath.includes('fix_engine.js')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Domain replacements
  // 1. https://blog.kindlewombivfgroup5.com -> https://kindlewombivfgroup.com
  content = content.replace(/https?:\/\/(?:www\.|blog\.)?kindlewombivfgroup5\.com/gi, 'https://kindlewombivfgroup.com');
  // 2. Any lingering kindlewombivfgroup5.com
  content = content.replace(/kindlewombivfgroup5\.com/gi, 'kindlewombivfgroup.com');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedDomainFiles++;
  }
});

console.log(`Domain normalization applied to ${fixedDomainFiles} files.`);

// 2. Fix location-pages/test-tube-baby-center-jodhpur.html JSON-LD escaping
const jodhpurPath = path.join('location-pages', 'test-tube-baby-center-jodhpur.html');
if (fs.existsSync(jodhpurPath)) {
  let jodhpurContent = fs.readFileSync(jodhpurPath, 'utf8');
  // Fix unescaped html in JSON-LD answer
  jodhpurContent = jodhpurContent.replace(
    /"text":\s*"The term 'test tube baby' is the colloquial name for <a href="https:\/\/kindlewombivfgroup\.com\/ivf"[^>]*>In Vitro Fertilization \(IVF\)<\/a>\.\s*It involves retrieving eggs([^"]*)"/g,
    '"text": "The term \'test tube baby\' is the colloquial name for In Vitro Fertilization (IVF). It involves retrieving eggs$1"'
  );
  fs.writeFileSync(jodhpurPath, jodhpurContent, 'utf8');
  console.log('Fixed JSON-LD syntax in test-tube-baby-center-jodhpur.html');
}

// 3. Fix about.html double H1
if (fs.existsSync('about.html')) {
  let aboutContent = fs.readFileSync('about.html', 'utf8');
  aboutContent = aboutContent.replace('<h1 class="banner-title">About</h1>', '<div class="banner-title">About Us</div>');
  aboutContent = aboutContent.replace(/<title>[\s\S]*?<\/title>/i, '<title>About Kindle Womb IVF | Leading Fertility & Test Tube Baby Centre</title>');
  fs.writeFileSync('about.html', aboutContent, 'utf8');
  console.log('Fixed duplicate H1 in about.html');
}

// 4. Fix duplicate title between infertility-specialist-jaipur.html and location-pages/infertility-specialist-jaipur.html
if (fs.existsSync('infertility-specialist-jaipur.html')) {
  let infContent = fs.readFileSync('infertility-specialist-jaipur.html', 'utf8');
  infContent = infContent.replace(
    /<title>[\s\S]*?<\/title>/i,
    '<title>Best Infertility Specialist in Jaipur | Top Fertility Doctors | Kindle Womb IVF</title>'
  );
  fs.writeFileSync('infertility-specialist-jaipur.html', infContent, 'utf8');
  console.log('Fixed title in infertility-specialist-jaipur.html');
}

// 5. Check all JSON-LD across all HTML files and fix any parsing errors
function walkHtml(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) results = results.concat(walkHtml(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const htmlFiles = walkHtml('.');
let schemaErrorsFixed = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(content)) !== null) {
    const rawJson = match[1];
    try {
      JSON.parse(rawJson);
    } catch (e) {
      console.log(`Found invalid JSON-LD in ${file}: ${e.message}`);
      // Attempt auto-sanitizing unescaped quotes inside strings or trailing commas
      let sanitized = rawJson
        .replace(/,\s*([\]}])/g, '$1') // remove trailing commas
        .replace(/<a\s+href=[^>]*>([^<]*)<\/a>/gi, '$1'); // strip unescaped a tags inside json
      try {
        JSON.parse(sanitized);
        content = content.replace(rawJson, sanitized);
        modified = true;
        schemaErrorsFixed++;
        console.log(`  -> Successfully sanitized JSON-LD in ${file}`);
      } catch (e2) {
        console.log(`  -> Could not auto-sanitize JSON-LD in ${file}: ${e2.message}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log(`Auto-fix pass completed. Total schema errors fixed: ${schemaErrorsFixed}`);
