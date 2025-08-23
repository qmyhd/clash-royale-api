#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dataPaths = [
  path.resolve(__dirname, '../data/cards-royaledle.json'),
  path.resolve(__dirname, '../data/cards-base.json'),
];

let cards;
for (const p of dataPaths) {
  if (fs.existsSync(p)) {
    cards = JSON.parse(fs.readFileSync(p));
    break;
  }
}

if (!cards) {
  console.error('No card dataset found. Run `npm run export:cards` or `npm run export:royaledle` first.');
  process.exit(1);
}

const now = new Date();
const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
const dayOfYear = Math.floor((now - yearStart) / (1000 * 60 * 60 * 24));
const index = dayOfYear % cards.length;
const card = cards[index];

console.log(`Day ${dayOfYear} of ${now.getUTCFullYear()} -> ${card.idName} (${card.name})`);
console.log(`Image: /images/cards/${card.idName}.png`);
