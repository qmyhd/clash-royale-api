# Clash Royale API - Quick Testing Guide

This guide helps you quickly test the API endpoints and verify card data extraction.

## 🚀 Quick Start Testing

### 1. Test Image Access (No Auth Required)
```bash
# Test if images are accessible
curl -I "http://www.clashapi.xyz/images/cards/arrows.png"
curl -I "http://www.clashapi.xyz/images/cards/knight.png"
curl -I "http://www.clashapi.xyz/images/cards/magic-archer.png"

# Download a test image
curl "http://www.clashapi.xyz/images/cards/arrows.png" --output test_arrow.png
```

### 2. Test API Endpoints (Auth Required)
```bash
# Note: You'll need to obtain a valid auth token first

# Test getting all cards
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://www.clashapi.xyz/api/cards"

# Test getting a specific card by name
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://www.clashapi.xyz/api/cards/arrows"

# Test filtering by rarity
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://www.clashapi.xyz/api/cards?rarity=Legendary"

# Test random deck generation
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://www.clashapi.xyz/api/random-deck"
```

## 🧪 Local Testing Setup

### 1. Clone and Setup
```bash
git clone https://github.com/martincarrera/clash-royale-api.git
cd clash-royale-api
npm install
```

### 2. Start MongoDB (Required)
```bash
# Option 1: Local MongoDB
mongod

# Option 2: Docker MongoDB
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### 3. Run the API
```bash
# Development mode
npm run dev

# Or production mode
npm start
```

### 4. Test Local Endpoints
```bash
# Test image access (should work immediately)
curl -I "http://localhost:3000/images/cards/arrows.png"

# Test API endpoints (may need setup/auth)
curl "http://localhost:3000/api/cards"
```

## 🔍 Verification Checklist

### ✅ Images Verification
- [ ] Card images are accessible at `/images/cards/{idName}.png`
- [ ] Images return HTTP 200 status
- [ ] Images are valid PNG files
- [ ] All 80+ card images are present

### ✅ API Verification
- [ ] `/api/cards` returns array of card objects
- [ ] Each card has required properties: name, idName, description, rarity, type, etc.
- [ ] Cards are sorted by `order` field
- [ ] Individual card lookup works: `/api/cards/{idName}`
- [ ] Filtering works: `/api/cards?rarity=Epic`
- [ ] Random deck returns 8 cards

### ✅ Data Consistency
- [ ] `idName` matches image filename (without .png)
- [ ] All cards have descriptions
- [ ] Rarity values are: Common, Rare, Epic, Legendary
- [ ] Type values are: Troop, Building, Spell
- [ ] ElixirCost is between 1-10

## 🐛 Common Issues & Solutions

### Issue: "Authentication Required"
**Solution**: Most endpoints require a valid Bearer token
```bash
# You need to obtain a token first (check auth endpoints)
curl -H "Authorization: Bearer YOUR_TOKEN" "http://www.clashapi.xyz/api/cards"
```

### Issue: "Connection Refused" 
**Solution**: Make sure the API server is running
```bash
# For local testing
npm run dev
```

### Issue: "Image Not Found"
**Solution**: Verify the idName format
```bash
# Correct format (lowercase, hyphens, no periods)
curl "http://www.clashapi.xyz/images/cards/magic-archer.png"  # ✓
curl "http://www.clashapi.xyz/images/cards/Magic-Archer.png"  # ✗
```

### Issue: "Empty Response"
**Solution**: Check if database is populated with card data

## 📝 Sample Response Formats

### GET /api/cards Response
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Knight",
    "idName": "knight",
    "rarity": "Common",
    "type": "Troop",
    "description": "A tough melee fighter. The Barbarian's handsome, cultured cousin. Rumor has it that he was knighted based on the sheer awesomeness of his mustache alone.",
    "arena": 0,
    "elixirCost": 3,
    "order": 1,
    "copyId": 26000000
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Archers",
    "idName": "archers",
    "rarity": "Common",
    "type": "Troop",
    "description": "A pair of lightly armored ranged attackers. They'll help you take down ground and air units, but you're on your own with hair advice.",
    "arena": 0,
    "elixirCost": 3,
    "order": 2,
    "copyId": 26000001
  }
]
```

### GET /api/cards/knight Response
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Knight",
  "idName": "knight",
  "rarity": "Common",
  "type": "Troop",
  "description": "A tough melee fighter. The Barbarian's handsome, cultured cousin. Rumor has it that he was knighted based on the sheer awesomeness of his mustache alone.",
  "arena": 0,
  "elixirCost": 3,
  "order": 1,
  "copyId": 26000000
}
```

### GET /api/random-deck Response
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Knight",
    "idName": "knight",
    // ... card details
  },
  // ... 7 more random cards
]
```

## 🛠️ Testing Tools

### Postman Collection
Create a Postman collection with these requests:
1. **GET** `{{baseUrl}}/images/cards/arrows.png`
2. **GET** `{{baseUrl}}/api/cards` (with auth header)
3. **GET** `{{baseUrl}}/api/cards/knight` (with auth header)
4. **GET** `{{baseUrl}}/api/cards?rarity=Legendary` (with auth header)
5. **GET** `{{baseUrl}}/api/random-deck` (with auth header)

### Node.js Test Script
```javascript
const axios = require('axios');

const BASE_URL = 'http://www.clashapi.xyz';
const TOKEN = 'your-auth-token';

async function testAPI() {
  try {
    // Test image access
    const imageResponse = await axios.head(`${BASE_URL}/images/cards/arrows.png`);
    console.log('✓ Images accessible:', imageResponse.status === 200);

    // Test API endpoints
    const headers = { Authorization: `Bearer ${TOKEN}` };
    
    const cardsResponse = await axios.get(`${BASE_URL}/api/cards`, { headers });
    console.log('✓ Cards API working:', cardsResponse.data.length > 0);
    
    const cardResponse = await axios.get(`${BASE_URL}/api/cards/knight`, { headers });
    console.log('✓ Single card lookup:', cardResponse.data.name === 'Knight');
    
    const deckResponse = await axios.get(`${BASE_URL}/api/random-deck`, { headers });
    console.log('✓ Random deck generation:', deckResponse.data.length === 8);
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testAPI();
```

## 📊 Performance Testing

### Load Testing with curl
```bash
# Test concurrent requests
for i in {1..10}; do
  curl -H "Authorization: Bearer YOUR_TOKEN" \
       "http://www.clashapi.xyz/api/cards" &
done
wait
```

### Image Download Speed Test
```bash
# Time image downloads
time curl "http://www.clashapi.xyz/images/cards/arrows.png" -o /dev/null
time curl "http://www.clashapi.xyz/images/cards/knight.png" -o /dev/null
```

## 🔐 Authentication Testing

### Check if Auth is Required
```bash
# Should return 401 Unauthorized
curl "http://www.clashapi.xyz/api/cards"

# Should return 200 OK (if you have valid token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "http://www.clashapi.xyz/api/cards"
```

### Test Invalid Token
```bash
# Should return 401 Unauthorized
curl -H "Authorization: Bearer invalid-token" \
     "http://www.clashapi.xyz/api/cards"
```

---

This testing guide helps you verify that the Clash Royale API is working correctly and that you can successfully extract all card data and images.