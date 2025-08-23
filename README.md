# Clash Royale API

A self-hosted [Clash Royale](http://supercell.com/en/games/clashroyale/) API that exposes game data and images.

> The original public endpoint (clashapi.xyz) is no longer available. Run this project locally to access data or export it for offline use.

## Content

1. [How to use](#how-to-use)
    1. [Endpoints](#endpoints)
    2. [Images](#images)
2. [Comprehensive Guides](#comprehensive-guides)
3. [Want to help](#want-to-help)
4. [Development](#development)
    1. [Install](#install)
    2. [Run](#run)
    3. [Test](#test)
5. [Apps that use this API](#apps-that-use-this-api)

## How to use

Consume the API to get all the information you need from these routes.

### Endpoints

[Base route](http://localhost:8085).

| Route | HTTP Verb | Description |
|---|---|---|
| [`/api/arenas`][1] | `GET` | All Arenas information |
| `/api/arenas/:id` | `GET` | Single Arena information |
| `/api/arenas/:idName` | `GET` | Single Arena information |
| [`/api/cards`][2] | `GET` | All Cards information |
| `/api/cards/:id` | `GET` | Single Card information |
| `/api/cards/:idName` | `GET` | Single Card information |
| [`/api/chests`][3] | `GET` | All Chests information |
| `/api/chests/:id` | `GET` | Single Chest information |
| `/api/chests/:idName` | `GET` | Single Chest information |
| [`/api/leagues`][4] | `GET` | All Leagues information |
| `/api/leagues/:id` | `GET` | Single League information |
| `/api/leagues/:idName` | `GET` | Single League information |
| [`/api/players`][5] | `GET` | All Players levels information |
| `/api/players/:id` | `GET` | Player level information |
| `/api/players/:idName` | `GET` | Player level information |
| [`/api/random-deck`][6] | `GET` | Get a Random deck! |

[1]: http://localhost:8085/api/arenas
[2]: http://localhost:8085/api/cards
[3]: http://localhost:8085/api/chests
[4]: http://localhost:8085/api/leagues
[5]: http://localhost:8085/api/players
[6]: http://localhost:8085/api/random-deck

### Images

You can get the images too! Thank you [MaherFa](https://github.com/MaherFa)!

| Route | Description |
|---|---|
| [`/images/arenas/${idName}.png`][7] | Arenas images |
| [`/images/cards/${idName}.png`][8] | Cards images |
| [`/images/chests/${idName}.png`][9] | Chests images |
| [`/images/leagues/${idName}.png`][10] | Leagues images |

[7]: http://localhost:8085/images/arenas/royal-arena.png
[8]: http://localhost:8085/images/cards/arrows.png
[9]: http://localhost:8085/images/chests/super-magical-chest.png
[10]: http://localhost:8085/images/leagues/ultimate-champion.png

## Comprehensive Guides

For detailed information on extracting cards, images, and descriptions:

📚 **[Complete Cards Extraction Guide](CARDS_EXTRACTION_GUIDE.md)** - Comprehensive guide covering:
- API architecture and authentication
- Card data structure and properties  
- All extraction endpoints with examples
- Code samples in JavaScript, Python, and cURL
- Image extraction methods
- Important features and capabilities

🖼️ **[Card Images Reference](CARD_IMAGES_REFERENCE.md)** - Quick reference for all available cards:
- Complete list of 80+ card images
- Image naming conventions
- Batch download scripts
- Card categorization

🧪 **[API Testing Guide](API_TESTING_GUIDE.md)** - Testing and verification guide:
- Quick testing commands
- Local setup instructions
- Verification checklists
- Common issues and solutions

🎮 **[Royaledle Build Guide](ROYALEDELE_GUIDE.md)** - Roadmap for recreating the daily wordle-style card game:
- Dataset export and enrichment
- Implementation tips for Classic, Pixel, Emoji and Description modes
- Daily puzzle logic and sharing results

For building offline tools like a Royaledle clone, you can export the card data to a local JSON file:

```bash
npm run export:cards
```

The command writes `data/cards-base.json` with all fields defined in [`card-schema.js`](src/schemas/card-schema.js).  You can enrich this dataset with additional properties—such as `targets`, `rangeType`, `hitSpeed`, `speed`, or `releaseDate`—and serve it alongside the images in `public/images/cards`.

To jump‑start that enrichment, there's also a helper script that pre-populates those extra fields with `null` values for manual editing:

```bash
npm run export:royaledle
```

This creates `data/cards-royaledle.json`, which mirrors the schema above and adds `targets`, `rangeType`, `hitSpeed`, `speed`, `releaseDate`, and an `emojiHints` array for use in Royaledle-style games.

After you populate those extra fields, you can load the enriched dataset back into MongoDB:

```bash
npm run load:royaledle
```

The command reads `data/cards-royaledle.json` and upserts each record into the `cards` collection, enabling local experimentation with the additional Royaledle attributes.

To pick a deterministic "card of the day" for a Royaledle-style daily puzzle, run:

```bash
npm run daily:card
```

The helper uses the current day of the year to select a card from `cards-royaledle.json` (falling back to `cards-base.json` if needed) and prints the card's slug and image path. Use this to keep all four puzzle modes in sync each day.

For a full walkthrough of building the game around this dataset, see the [Royaledle Build Guide](ROYALEDELE_GUIDE.md).

## Want to help

If you like the API, please star this repository.

If you create an app using the API, please mention this repository and add it in the table below.

If you want to contribute to the API, feel free to create a pull request.

If you :heart: the API, [help me pay the hosting](https://www.paypal.me/MartinCarrera)!

## Development

Make sure you have installed all these prerequisites on your development machine.

* [Node.js](https://nodejs.org/en/download/)
* [MongoDB](https://www.mongodb.org/)
* [Nodemon](https://nodemon.io/)

### Install

```bash
> git clone https://github.com/martincarrera/clash-royale-api.git
> cd clash-royale-api
> npm install
```

### Run

```bash
> mongod
> cd clash-royale-api
> npm run dev
```

If you don't have `Nodemon` installed

```bash
> mongod
> cd clash-royale-api
> npm i -g nodemon
> npm run dev
```

### Test

No automated test suite is bundled yet. Running the command below simply prints a placeholder message.

```bash
> npm test
```

## Apps that use this API

| APP | DESCRIPTION | LINK |
|:---:|:---:|:---:|
| Randeck | Simple web app that generates random decks. | [Go!](http://randeck.xyz) |
| Royale Plus | Facebook for Clash Royale players. | [Git!](https://github.com/AmirSavand/royale-plus) [Go!](http://royplus.herokuapp.com/)|
| BarrePolice | A Telegram Bot based on plugins written in Lua |[Go!](https://t.me/BarrePolice_Bot) _& send /cr_ |
| Clashapi | NPM package to consume this API | [Go!](https://www.npmjs.com/package/clashapi) |
| Deck it | Deck builder app designed for Android | [Go!](https://play.google.com/store/apps/details?id=com.oryginal.deckit) |
| Deck Generator for Echo Devices | Alexa skill to suggest a deck for clash royale for Amazon's Echo devices | [Go!](https://alexa.amazon.in/spa/index.html#skills/dp/B078WSRZWV/?ref=skill_dsk_skb_ca_24) |
| Clash Royale Discord Bot | A Discord bot that displays informations depending of commands | [Go!](https://github.com/TorzuoliH/clash-royale-discord-bot) |
| Deck Royale | A SPA using Vue that generates random decks. | [Git!](https://github.com/ikenami/Deck-Royale) [Go!](http://deck-royale-ultimate.herokuapp.com/) |
| ClashElite | Simple app that gives info on chest cycles and generates random decks with copy and share feature. | [Go!](https://play.google.com/store/apps/details?id=com.wordpress.redmanandroid.clashelite) |

Made with :heart: by clash fans.

----------
This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see [Supercell’s Fan Content Policy](http://www.supercell.com/fan-content-policy).
