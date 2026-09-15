const fs = require('fs');
const path = require('path');

const rootFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const locationFiles = fs.existsSync('location-pages') ? fs.readdirSync('location-pages').filter(f => f.endsWith('.html')) : [];
const postFiles = fs.existsSync('posts') ? fs.readdirSync('posts').filter(f => f.endsWith('.html')) : [];

console.log('Total root HTML files:', rootFiles.length);
console.log('Total location HTML files:', locationFiles.length);
console.log('Total post HTML files:', postFiles.length);

const duplicatesInRootAndLoc = rootFiles.filter(f => locationFiles.includes(f));
console.log('Files present in both Root and Location-pages:', duplicatesInRootAndLoc);

const duplicatesInRootAndPost = rootFiles.filter(f => postFiles.includes(f));
console.log('Files present in both Root and Posts:', duplicatesInRootAndPost);
