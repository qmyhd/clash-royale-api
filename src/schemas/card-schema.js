const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({

  name: {
    type: String,
    unique: true,
    require: true,
  },

  idName: {
    type: String,
    unique: true,
    require: true,
  },

  rarity: {
    type: String,
    enum: 'Common Rare Epic Legendary'.split(' '),
    require: true,
  },

  type: {
    type: String,
    enum: 'Troop Building Spell'.split(' '),
    require: true,
  },

  description: {
    type: String,
    require: true,
  },

  arena: {
    type: Number,
    require: true,
  },

  elixirCost: {
    type: Number,
    require: true,
  },

  order: {
    type: Number,
    require: true,
  },

  copyId: {
    type: Number,
    require: true,
  },

  // Royaledle enrichment fields
  targets: {
    type: String,
  },

  rangeType: {
    type: String,
  },

  hitSpeed: {
    type: Number,
  },

  speed: {
    type: String,
  },

  releaseDate: {
    type: String,
  },

  emojiHints: [String],

  image: {
    type: String,
  },

});

CardSchema.pre('save', function preSave(next) {
  if (!this.idName) {
    this.idName = JSON.parse(JSON.stringify(this.name.toLowerCase()));
    this.idName = this.idName.replace(/ /g, '-');
    this.idName = this.idName.replace(/\./g, '');
  }
  next();
});

module.exports = mongoose.model('Card', CardSchema);
