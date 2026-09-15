const fs = require('fs');

const imgFixes = [
  { file: 'location-pages/iui-treatment-jaipur.html', oldImg: '../images/iui-treatment-jaipur-success.jpg', newImg: '../images/best-ivf-center-jaipur.jpg' },
  { file: 'location-pages/iui-treatment-jodhpur.html', oldImg: '../images/iui-treatment-jodhpur-success.webp', newImg: '../images/best-fertility-center-jodhpur-newborn.jpg' },
  { file: 'location-pages/ivf-treatment-cost-jodhpur.html', oldImg: '../images/ivf-treatment-cost-jodhpur.webp', newImg: '../images/best-ivf-center-jodhpur-newborn.jpg' },
  { file: 'location-pages/test-tube-baby-center-jaipur.html', oldImg: '../images/test-tube-baby-center-jaipur-newborn.jpg', newImg: '../images/test-tube-baby-center-jaipur.jpg' },
  { file: 'location-pages/test-tube-baby-center-jodhpur.html', oldImg: '../images/test-tube-baby-center-jodhpur.webp', newImg: '../images/best-ivf-center-jodhpur-newborn.jpg' },
  { file: 'location-pages/top-ivf-clinic-jaipur.html', oldImg: '../images/top-ivf-clinic-jaipur-newborn.jpg', newImg: '../images/best-ivf-center-jaipur.jpg' },
  { file: 'test-tube-baby-center-jaipur.html', oldImg: 'images/hero-test-tube-baby-jaipur.jpg', newImg: 'images/test-tube-baby-center-jaipur.jpg' }
];

imgFixes.forEach(item => {
  if (fs.existsSync(item.file)) {
    let c = fs.readFileSync(item.file, 'utf8');
    c = c.replaceAll(item.oldImg, item.newImg);
    fs.writeFileSync(item.file, c, 'utf8');
    console.log(`Updated images in ${item.file}`);
  }
});
