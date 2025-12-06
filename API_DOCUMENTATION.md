# GalaChain Backend API Documentation

**Base URL:** `http://localhost:3000` (or your server URL)

**Base Path for all routes:** `/profile`

---

## Table of Contents
1. [Health Check](#health-check)
2. [Profile Management](#profile-management)
3. [Inventory Management](#inventory-management)
4. [Cooldowns](#cooldowns)
5. [Error Handling](#error-handling)

---

## Health Check

### GET /health
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## Profile Management

### 1. POST /profile/login
Create or fetch a player profile.

**Request:**
```json
{
  "playerId": "string"
}
```

**Parameters:**
- `playerId` (required, string): Unique player identifier

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "nickName": "string",
    "profilePicture": null,
    "xp": 0,
    "level": 0,
    "galaBalance": 0,
    "inventory": [],
    "cooldowns": {
      "battle": null,
      "hatch": null
    },
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "inventoryCacheUpdatedAt": null
  },
  "message": "Profile created or retrieved successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ playerId: 'player123' })
});
const data = await response.json();
```

---

### 2. GET /profile/:playerId
Retrieve a player's profile.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "nickName": "string",
    "profilePicture": null,
    "xp": 0,
    "level": 0,
    "galaBalance": 0,
    "inventory": [],
    "cooldowns": {
      "battle": null,
      "hatch": null
    },
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "inventoryCacheUpdatedAt": null
  }
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123');
const data = await response.json();
```

---

### 3. PATCH /profile/:playerId/nickname
Update player's nickname.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Request:**
```json
{
  "nickName": "string"
}
```

**Body Parameters:**
- `nickName` (required, string): New nickname (1-100 characters)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "nickName": "updated nickname",
    ...
  },
  "message": "Nickname updated successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/nickname', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nickName: 'NewNickname' })
});
const data = await response.json();
```

---

### 4. PATCH /profile/:playerId/profile-picture
Update player's profile picture.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Request:**
- Content-Type: `multipart/form-data`
- Form field: `profilePicture` (required, file)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "profilePicture": "/uploads/profile_playerId_timestamp.jpg",
    ...
  },
  "message": "Profile picture updated successfully"
}
```

**Example:**
```javascript
const formData = new FormData();
const fileInput = document.getElementById('fileInput');
formData.append('profilePicture', fileInput.files[0]);

const response = await fetch('http://localhost:3000/profile/player123/profile-picture', {
  method: 'PATCH',
  body: formData
});
const data = await response.json();
```

---

### 5. POST /profile/:playerId/sync-balance
Sync GALA balance from blockchain.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "galaBalance": 123.456789,
    ...
  },
  "message": "Balance synced successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/sync-balance', {
  method: 'POST'
});
const data = await response.json();
```

---

## Inventory Management

### 6. GET /profile/:playerId/inventory
Retrieve player's inventory from database.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "instanceId": "item_123_001",
      "equipped": false
    },
    {
      "instanceId": "item_123_002",
      "equipped": true
    }
  ]
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/inventory');
const data = await response.json();
```

---

### 7. POST /profile/:playerId/inventory/refresh
Refresh inventory from blockchain.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "instanceId": "item_123_001",
      "equipped": false
    }
  ],
  "message": "Inventory refreshed from blockchain"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/inventory/refresh', {
  method: 'POST'
});
const data = await response.json();
```

---

### 8. POST /profile/:playerId/inventory/equip
Equip an item from inventory.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Request:**
```json
{
  "instanceId": "string"
}
```

**Body Parameters:**
- `instanceId` (required, string): Item instance ID to equip

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "inventory": [
      {
        "instanceId": "item_123_001",
        "equipped": true
      }
    ],
    ...
  },
  "message": "Item equipped successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/inventory/equip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ instanceId: 'item_123_001' })
});
const data = await response.json();
```

---

### 9. POST /profile/:playerId/inventory/unequip
Unequip an item from inventory.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Request:**
```json
{
  "instanceId": "string"
}
```

**Body Parameters:**
- `instanceId` (required, string): Item instance ID to unequip

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "inventory": [
      {
        "instanceId": "item_123_001",
        "equipped": false
      }
    ],
    ...
  },
  "message": "Item unequipped successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/inventory/unequip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ instanceId: 'item_123_001' })
});
const data = await response.json();
```

---

## Cooldowns

### 10. POST /profile/:playerId/cooldown
Set a cooldown for a player action.

**Parameters:**
- `playerId` (path, required, string): Player ID

**Request:**
```json
{
  "type": "battle" | "hatch",
  "seconds": 300
}
```

**Body Parameters:**
- `type` (required, enum): Cooldown type - "battle" or "hatch"
- `seconds` (required, integer): Duration in seconds (non-negative)

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "string",
    "cooldowns": {
      "battle": 1704067200000,
      "hatch": null
    },
    ...
  },
  "message": "Cooldown set successfully"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/cooldown', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'battle', seconds: 300 })
});
const data = await response.json();
```

---

### 11. GET /profile/:playerId/cooldown/:type
Check cooldown status for a specific action type.

**Parameters:**
- `playerId` (path, required, string): Player ID
- `type` (path, required, enum): Cooldown type - "battle" or "hatch"

**Response (Success - 200):**

**When cooldown is active:**
```json
{
  "success": true,
  "data": {
    "type": "battle",
    "remainingSeconds": 250,
    "isActive": true
  }
}
```

**When cooldown is inactive:**
```json
{
  "success": true,
  "data": {
    "type": "battle",
    "remainingSeconds": null,
    "isActive": false
  }
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3000/profile/player123/cooldown/battle');
const data = await response.json();
```

---

## Error Handling

All endpoints return error responses in the following format:

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common Error Codes:**
- `400 Bad Request`: Invalid parameters or validation failed
- `404 Not Found`: Player or resource not found
- `500 Internal Server Error`: Server-side error

**Example Error:**
```json
{
  "success": false,
  "error": "Nickname cannot exceed 100 characters"
}
```

---

## Request/Response Headers

**Recommended Headers:**
```
Content-Type: application/json
Accept: application/json
```

**CORS Configuration:**
- Origin: Configurable via `CORS_ORIGIN` env variable (default: "*")
- Credentials: Enabled

---

## Environment Variables

The backend uses the following environment variables:

```env
CORS_ORIGIN=http://localhost:3000    # CORS origin for frontend
UPLOAD_DIR=./uploads                  # Directory for file uploads
DATABASE_URL=mysql://...              # Database connection
```

---

## Integration Checklist

- [ ] Replace `localhost:3000` with your actual backend URL
- [ ] Set `playerId` from your authentication system
- [ ] Implement error handling for all requests
- [ ] Cache profile data appropriately
- [ ] Handle file uploads for profile pictures
- [ ] Monitor cooldown timers on frontend
- [ ] Refresh inventory periodically or on demand

---

## Example Integration (React)

```javascript
// Profile Service
const ProfileAPI = {
  async login(playerId) {
    const res = await fetch('http://localhost:3000/profile/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId })
    });
    return res.json();
  },

  async getProfile(playerId) {
    const res = await fetch(`http://localhost:3000/profile/${playerId}`);
    return res.json();
  },

  async updateNickname(playerId, nickName) {
    const res = await fetch(`http://localhost:3000/profile/${playerId}/nickname`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickName })
    });
    return res.json();
  },

  async getInventory(playerId) {
    const res = await fetch(`http://localhost:3000/profile/${playerId}/inventory`);
    return res.json();
  },

  async checkCooldown(playerId, type) {
    const res = await fetch(`http://localhost:3000/profile/${playerId}/cooldown/${type}`);
    return res.json();
  }
};

// Usage
const data = await ProfileAPI.getProfile('player123');
console.log(data);
```

---

Generated: December 5, 2025
