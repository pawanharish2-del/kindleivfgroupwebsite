const fs = require('fs');

const css = `
/* Global Location Nav Footer Block */
.global-location-nav {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 40px;
}

.global-location-nav h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--bg-pure-white);
    margin-bottom: 20px;
}

.global-location-nav h4 {
    font-size: 15px;
    color: #e5dcd9;
    margin-bottom: 12px;
}

.location-links-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    align-items: center;
}

.location-links-inline a {
    color: #c9b4a4;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
    position: relative;
}

.location-links-inline a:hover {
    color: var(--bg-pure-white);
}

.location-links-inline a:not(:last-child)::after {
    content: '|';
    position: absolute;
    right: -14px;
    color: rgba(255,255,255,0.15);
}
`;

fs.appendFileSync('global.css', css);
console.log("CSS Appended!");
