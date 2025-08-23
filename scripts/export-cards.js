#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../src/config/config');
const Card = require('../src/schemas/card-schema');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const cards = await Card.find().sort({ order: 1 }).lean().exec();

    const outDir = path.resolve(__dirname, '../data');
    const outPath = path.join(outDir, 'cards-base.json');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(cards, null, 2));

    console.log(`Exported ${cards.length} cards to ${outPath}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to export cards:', err);
    process.exit(1);
  }
})();
