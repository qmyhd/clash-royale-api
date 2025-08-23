# Clash Royale API - Cards Extraction Guide

This comprehensive guide explains how to extract all cards, their images, and descriptions from the Clash Royale API.

## 🏗️ API Architecture Overview

### Base URL
- Run locally: `http://localhost:8085`

### Authentication
Most endpoints require authentication. Include the Authorization header:
```
Authorization: Bearer <your-token>
```

## 📋 Card Data Structure

Each card contains the following properties:

```javascript
{
  "_id": "507f1f77bcf86cd799439011",        // MongoDB ObjectId
  "name": "Arrows",                          // Display name
  "idName": "arrows",                        // URL-safe identifier
  "rarity": "Common",                        // Common|Rare|Epic|Legendary
  "type": "Spell",                          // Troop|Building|Spell
  "description": "Arrows pepper a large area, damaging all enemies hit.", // Card description
  "arena": 1,                               // Arena level required
  "elixirCost": 3,                          // Elixir cost (1-10)
  "order": 1,                               // Sort order
  "copyId": 26000001                        // Game's internal ID
}
```

## 🚀 Key API Endpoints for Card Extraction

### 1. Get All Cards
```http
GET /api/cards
Authorization: Bearer <token>
```

**Response**: Array of all cards, sorted by `order` field
```javascript
[
  {
    "_id": "...",
    "name": "Knight",
    "idName": "knight",
    "rarity": "Common",
    "type": "Troop",
    "description": "A tough melee fighter...",
    "arena": 0,
    "elixirCost": 3,
    "order": 1,
    "copyId": 26000000
  },
  // ... more cards
]
```

### 2. Get Single Card by ID
```http
GET /api/cards/{card_id}
Authorization: Bearer <token>
```

### 3. Get Single Card by Name
```http
GET /api/cards/{idName}
Authorization: Bearer <token>
```

**Examples**:
- `/api/cards/arrows`
- `/api/cards/magic-archer`
- `/api/cards/baby-dragon`

### 4. Filter Cards by Properties
```http
GET /api/cards?rarity=Legendary
GET /api/cards?type=Spell
GET /api/cards?arena=1
```

### 5. Get Random Deck
```http
GET /api/random-deck
Authorization: Bearer <token>
```
Returns 8 random cards forming a deck.

## 🖼️ Card Images Extraction

### Image URL Pattern
```
/images/cards/{idName}.png
```

### Examples
- `http://localhost:8085/images/cards/arrows.png`
- `http://localhost:8085/images/cards/magic-archer.png`
- `http://localhost:8085/images/cards/baby-dragon.png`

### Image File Naming Convention
The `idName` is generated from the card name using these rules:
1. Convert to lowercase
2. Replace spaces with hyphens (`-`)
3. Remove periods (`.`)

**Examples**:
- "Magic Archer" → `magic-archer`
- "P.E.K.K.A" → `pekka`
- "Mega Knight" → `mega-knight`

## 💻 Complete Extraction Examples

### JavaScript/Node.js Example
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:8085';
const TOKEN = 'your-auth-token';

// Get all cards with descriptions
async function getAllCards() {
  try {
    const response = await axios.get(`${API_BASE}/api/cards`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    
    return response.data.map(card => ({
      id: card._id,
      name: card.name,
      description: card.description,
      rarity: card.rarity,
      type: card.type,
      elixirCost: card.elixirCost,
      arena: card.arena,
      imageUrl: `${API_BASE}/images/cards/${card.idName}.png`
    }));
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}

// Download card image
async function downloadCardImage(idName) {
  const imageUrl = `${API_BASE}/images/cards/${idName}.png`;
  const response = await axios.get(imageUrl, { responseType: 'stream' });
  return response.data;
}

// Usage
getAllCards().then(cards => {
  console.log(`Found ${cards.length} cards`);
  cards.forEach(card => {
    console.log(`${card.name}: ${card.description}`);
    console.log(`Image: ${card.imageUrl}`);
  });
});
```

### Python Example
```python
import requests
import json

API_BASE = 'http://localhost:8085'
TOKEN = 'your-auth-token'

def get_all_cards():
    headers = {'Authorization': f'Bearer {TOKEN}'}
    response = requests.get(f'{API_BASE}/api/cards', headers=headers)
    
    if response.status_code == 200:
        cards = response.json()
        return [{
            'id': card['_id'],
            'name': card['name'],
            'description': card['description'],
            'rarity': card['rarity'],
            'type': card['type'],
            'elixir_cost': card['elixirCost'],
            'arena': card['arena'],
            'image_url': f"{API_BASE}/images/cards/{card['idName']}.png"
        } for card in cards]
    return None

def download_card_image(id_name, save_path):
    image_url = f'{API_BASE}/images/cards/{id_name}.png'
    response = requests.get(image_url)
    
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            f.write(response.content)
        return True
    return False

# Usage
cards = get_all_cards()
if cards:
    print(f"Found {len(cards)} cards")
    for card in cards:
        print(f"{card['name']}: {card['description']}")
        # Download image
        download_card_image(card['id_name'], f"images/{card['id_name']}.png")
```

### cURL Examples
```bash
# Get all cards
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8085/api/cards"

# Get specific card
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8085/api/cards/arrows"

# Download card image
curl "http://localhost:8085/images/cards/arrows.png" \
     --output arrows.png

# Filter by rarity
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://localhost:8085/api/cards?rarity=Legendary"
```

## 🎯 Important Features & Capabilities

### 1. **Flexible Card Lookup**
- By MongoDB ObjectId: `/api/cards/507f1f77bcf86cd799439011`
- By idName: `/api/cards/arrows`

### 2. **Sorting & Filtering**
- Cards returned sorted by `order` field
- Filter by `rarity`, `type`, `arena`, etc.

### 3. **Random Deck Generation**
- Endpoint: `/api/random-deck`
- Returns 8 random cards forming a valid deck

### 4. **Rich Card Metadata**
- Complete descriptions
- Rarity classification
- Type categorization (Troop/Building/Spell)
- Arena unlock level
- Elixir cost

### 5. **Image Assets**
- High-quality PNG images
- Consistent naming convention
- Direct URL access (no auth required for images)

## 🗂️ Available Image Categories

Beyond cards, the API also provides:
- **Arenas**: `/images/arenas/{idName}.png`
- **Chests**: `/images/chests/{idName}.png` 
- **Leagues**: `/images/leagues/{idName}.png`

## 🔧 Local Development Setup

1. **Prerequisites**:
   - Node.js
   - MongoDB
   - Nodemon (optional)

2. **Installation**:
   ```bash
   git clone https://github.com/martincarrera/clash-royale-api.git
   cd clash-royale-api
   npm install
   ```

3. **Run**:
   ```bash
   mongod  # Start MongoDB
   npm run dev  # Start development server
   ```

4. **Test**:
   ```bash
   npm test
   ```

## 📁 Repository Structure

```
clash-royale-api/
├── public/
│   └── images/
│       ├── cards/          # Card images (*.png)
│       ├── arenas/         # Arena images
│       ├── chests/         # Chest images
│       └── leagues/        # League images
├── src/
│   ├── controllers/
│   │   └── card-controller.js    # Card API logic
│   ├── models/
│   │   └── card-model.js         # Card database model
│   ├── routes/
│   │   └── card-route.js         # Card API routes
│   └── schemas/
│       └── card-schema.js        # Card data schema
└── tests/
    └── cards.spec.js             # Card API tests
```

## 🚨 Important Notes

1. **Authentication Required**: Most API endpoints require a valid Bearer token
2. **Rate Limiting**: Be respectful with API calls
3. **Image Access**: Images can be accessed directly without authentication
4. **CORS**: API supports cross-origin requests
5. **Sorting**: Cards are automatically sorted by the `order` field
6. **idName Generation**: Automatic conversion from display name to URL-safe identifier

## 🎮 Real-World Usage Examples

This API is used by various apps:
- **Deck Generators**: Random deck creation tools
- **Card Databases**: Complete card information apps  
- **Discord Bots**: Clash Royale information bots
- **Mobile Apps**: Deck building and strategy apps

## 📞 Support & Community

- **GitHub**: [martincarrera/clash-royale-api](https://github.com/martincarrera/clash-royale-api)
- **Issues**: Report bugs or request features on GitHub
- **Contributions**: Pull requests welcome

---

*This API is fan-made and not affiliated with Supercell. See [Supercell's Fan Content Policy](http://www.supercell.com/fan-content-policy) for more information.*