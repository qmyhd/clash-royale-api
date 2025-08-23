# Royaledle Build Guide

This repository contains everything needed to assemble a local dataset for a Royaledle‑style guessing game.  The steps below show how to extract card data, enrich it with additional attributes, and supply assets for the four daily puzzle modes.

## 1. Clone and Install

```bash
git clone https://github.com/qmyhd/clash-royale-api.git
cd clash-royale-api
npm install
```

Card images live under `public/images/cards`.  Filenames such as `hog-rider.png` correspond to the card slug (`idName`).

## 2. Export Card Data

Dump all cards from MongoDB into `data/cards-base.json`:

```bash
npm run export:cards
```

Each record contains `name`, `idName`, `rarity`, `type`, `description`, `arena`, `elixirCost`, `order`, and `copyId` from [`src/schemas/card-schema.js`](src/schemas/card-schema.js).

## 3. Enrich for Royaledle

Generate a scaffold with extra fields needed for Royaledle modes:

```bash
npm run export:royaledle
```

This produces `data/cards-royaledle.json` with placeholders for:

- `targets`
- `rangeType`
- `hitSpeed`
- `speed`
- `releaseDate`
- `emojiHints` (array)
- `image` (pre-filled with `/images/cards/{idName}.png`)

Populate these fields manually or via a script that scrapes public Clash Royale resources.  Consider keeping this file as your canonical dataset; the game can also read it directly without a database.

Once the extra fields are populated you can reload the enriched dataset into MongoDB:

```bash
npm run load:royaledle
```

## 4. Card of the Day

To keep all four puzzle modes synced, determine the daily solution with:

```bash
npm run daily:card
```

The helper selects a card based on the day of the year and prints the slug and image path.

## 5. Implementing Game Modes

Use the enriched dataset and images to build the four Royaledle modes:

### Classic
1. Present a search bar that filters cards by `name` or `idName`.
2. After each guess, render a table row with columns for:
   `Card`, `Elixir`, `Rarity`, `Type`, `Targets`, `Range Type`, `Hit Speed`, `Speed`, `Release Date`.
3. For categorical fields highlight correct values in green; show red otherwise.
4. For numeric or ordered fields display ▲/▼ arrows to indicate higher or lower compared to the answer.

Persist guesses in `localStorage` so a refresh keeps the table intact.

### Pixel
1. Draw `/images/cards/{idName}.png` onto a `<canvas>` at a very low resolution and scale it up with `imageSmoothingEnabled = false` to create large pixel blocks.
2. Start with a high block size (e.g. 10 px). After each wrong guess shrink the block size to reveal more detail.
3. Optionally add a *Hardcore* toggle that applies a grayscale filter and uses smaller decrements.
4. Show thumbnails of all guesses below the canvas for quick review.

### Emoji
1. Store a short emoji array for every `idName` in the dataset (`emojiHints`).
2. Display only the first emoji initially; reveal the next emoji after each wrong guess.
3. When a card is guessed correctly show all emojis and mark the puzzle complete.

### Description
1. Split the card `description` into an array of words.
2. Replace hidden words with underscores and reveal one additional word per wrong guess.
3. On success reveal the full description and celebrate the win.

## 6. Daily Puzzle Logic
1. Compute a zero‑based day‑of‑year index and select a card from the dataset (`index % cards.length`).
2. Store the answer and guess history for each mode in `localStorage` using keys like `royaledle-{mode}-answer` and `royaledle-{mode}-guesses`.
3. Clear those keys at local midnight to rotate the puzzle.

## 7. Share Results & Polish
After the puzzle resolves:

1. Generate an emoji string summarizing the player's attempts (similar to Wordle's grid) and copy it to the clipboard.
2. Update a home‑screen progress indicator showing how many of the four modes were cleared.
3. Ensure buttons and inputs are keyboard accessible and the layout responds well on mobile devices.

With these pieces, the `clash-royale-api` repository can serve as a full offline data source for recreating the Royaledle experience.
