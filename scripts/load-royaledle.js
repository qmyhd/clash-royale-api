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

    const dataPath = path.resolve(__dirname, '../data/cards-royaledle.json');
    const cards = JSON.parse(fs.readFileSync(dataPath));

    for (const card of cards) {
      await Card.updateOne({ idName: card.idName }, card, { upsert: true });
    }

    console.log(`Loaded ${cards.length} cards from ${dataPath}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to load Royaledle cards:', err);
    process.exit(1);
  }
})();
