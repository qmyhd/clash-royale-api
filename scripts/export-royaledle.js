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

    const enriched = cards.map((c) => ({
      name: c.name,
      idName: c.idName,
      rarity: c.rarity,
      type: c.type,
      description: c.description,
      arena: c.arena,
      elixirCost: c.elixirCost,
      image: `/images/cards/${c.idName}.png`,
      targets: null,
      rangeType: null,
      hitSpeed: null,
      speed: null,
      releaseDate: null,
      emojiHints: [],
    }));

    const outDir = path.resolve(__dirname, '../data');
    const outPath = path.join(outDir, 'cards-royaledle.json');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(enriched, null, 2));

    console.log(`Exported ${enriched.length} enriched cards to ${outPath}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Failed to export Royaledle cards:', err);
    process.exit(1);
  }
})();
