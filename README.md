# GalaChain Game Backend API

A clean, structured Express.js backend in TypeScript for a GalaChain blockchain game. Built with best practices including layered architecture, TypeScript types, proper validation, error handling, and scalable folder structure.

## 🏗️ Architecture

This backend follows a **layered architecture** pattern:

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Database access layer
├── models/          # TypeORM entities
├── routes/          # Express route definitions
├── utils/           # Utility functions (validation, errors, file upload)
├── middlewares/     # Express middlewares (error handling)
├── config/          # Configuration files (database, etc.)
└── types/           # TypeScript type definitions
```

## 🚀 Features

- ✅ **Express.js** with TypeScript
- ✅ **TypeORM** for MySQL database operations
- ✅ **Zod** for input validation
- ✅ **GalaChain SDK** integration for blockchain interactions
- ✅ **Multer** for file uploads (profile pictures)
- ✅ Comprehensive error handling
- ✅ RESTful API design
- ✅ Production-ready code structure

## 📋 Requirements

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn

## 📦 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=galachain_game
   DB_CA_CERT_BASE64= # base64 of your MySQL CA PEM (for managed services)
   DB_CA_CERT_BASE64= # base64 of your MySQL CA PEM (for managed services)

   # GalaChain Configuration
   GALACHAIN_NETWORK=testnet
   GALACHAIN_API_KEY=your_api_key_here
   GALACHAIN_RPC_URL=https://api.galachain.com

   # File Upload Configuration
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Set up the database:**
   ```sql
   CREATE DATABASE galachain_game;
   ```

5. **Build the project:**
   ```bash
   npm run build
   ```

6. **Run migrations** (if using TypeORM migrations):
   ```bash
   npm run migration:run
   ```

7. **Start the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Production mode
   npm start
   ```

## 🗄️ Database Schema

### Profile Table

```typescript
Profile {
  id: UUID (PK)
  playerId: string (unique)              // GalaChain wallet identity
  nickName: string
  profilePicture: string | null
  xp: number (default 0)
  level: number (default 0)
  galaBalance: number                     // from GalaChain SDK
  inventory: JSON                         // [{ instanceId: string, equipped: boolean }]
  cooldowns: JSON                         // { battle: number | null, hatch: number | null }
  lastLogin: Date
  createdAt: Date
  inventoryCacheUpdatedAt: Date
}
```

## 📡 API Endpoints

### Profile Management

#### POST /profile/login
Create or fetch profile by playerId.

**Request Body:**
```json
{
  "playerId": "0x1234567890abcdef..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "0x1234567890abcdef...",
    "nickName": "Player_12345678",
    "profilePicture": null,
    "xp": 0,
    "level": 0,
    "galaBalance": 0,
    "inventory": [],
    "cooldowns": { "battle": null, "hatch": null },
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "inventoryCacheUpdatedAt": null
  },
  "message": "Profile created or retrieved successfully"
}
```

#### GET /profile/:playerId
Get profile by playerId.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "playerId": "0x1234567890abcdef...",
    "nickName": "MyNickname",
    ...
  }
}
```

#### PATCH /profile/:playerId/nickname
Update nickname.

**Request Body:**
```json
{
  "nickName": "NewNickname"
}
```

#### PATCH /profile/:playerId/profile-picture
Update profile picture (multipart/form-data).

**Request:** Form-data with field `profilePicture` (image file)

**Response:**
```json
{
  "success": true,
  "data": {
    "profilePicture": "/uploads/profile_playerId_timestamp.jpg",
    ...
  },
  "message": "Profile picture updated successfully"
}
```

#### POST /profile/:playerId/sync-balance
Sync GALA balance from blockchain.

**Response:**
```json
{
  "success": true,
  "data": {
    "galaBalance": 123.456789,
    ...
  },
  "message": "Balance synced successfully"
}
```

### Inventory Management

#### GET /profile/:playerId/inventory
Get inventory from database.

**Response:**
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

#### POST /profile/:playerId/inventory/refresh
Refresh inventory from blockchain.

**Response:**
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

#### POST /profile/:playerId/inventory/equip
Equip an item.

**Request Body:**
```json
{
  "instanceId": "item_123_001"
}
```

#### POST /profile/:playerId/inventory/unequip
Unequip an item.

**Request Body:**
```json
{
  "instanceId": "item_123_001"
}
```

### Cooldown Management

#### POST /profile/:playerId/cooldown
Set cooldown.

**Request Body:**
```json
{
  "type": "battle",
  "seconds": 300
}
```

#### GET /profile/:playerId/cooldown/:type
Check cooldown status.

**Response:**
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

## 🔧 Available Functions (Service Layer)

All 14 required functions are implemented in `ProfileService`:

1. `createProfile(playerId)` - Create a new profile
2. `getProfile(playerId)` - Get profile by playerId
3. `updateNickName(playerId, nickName)` - Update nickname
4. `updateProfilePicture(playerId, file)` - Update profile picture
5. `syncGalaBalance(playerId)` - Sync GALA balance from blockchain
6. `getInventory(playerId)` - Get inventory from database
7. `refreshInventoryFromChain(playerId)` - Refresh inventory from blockchain
8. `equipItem(playerId, instanceId)` - Equip an item
9. `unequipItem(playerId, instanceId)` - Unequip an item
10. `setCooldown(playerId, type, seconds)` - Set cooldown
11. `checkCooldown(playerId, type)` - Check cooldown status
12. `updateLastLogin(playerId)` - Update last login timestamp
13. `incrementXP(playerId, amount)` - Increment XP
14. `levelUp(playerId)` - Level up player

## 🔗 GalaChain SDK Integration

The `GalaChainService` class handles blockchain interactions. Currently, it contains mock implementations. Replace the mock code in `src/services/GalaChainService.ts` with actual GalaChain SDK calls:

```typescript
// Example: Replace mock with actual SDK call
const sdk = new GalaChainSDK({ 
  apiKey: this.apiKey, 
  network: this.network 
});
const balance = await sdk.getBalance(playerId);
```

## 🧪 Testing

Test the API using tools like Postman, cURL, or any HTTP client:

```bash
# Health check
curl http://localhost:3000/health

# Create/login profile
curl -X POST http://localhost:3000/profile/login \
  -H "Content-Type: application/json" \
  -d '{"playerId": "0x1234567890abcdef"}'

# Get profile
curl http://localhost:3000/profile/0x1234567890abcdef
```

## 📝 Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run typeorm` - Run TypeORM CLI commands
- `npm run migration:generate` - Generate migration
- `npm run migration:run` - Run migrations
- `npm run migration:revert` - Revert last migration

## 🛠️ Development

### Project Structure

```
backend/
├── src/
│   ├── controllers/       # HTTP request handlers
│   │   └── ProfileController.ts
│   ├── services/          # Business logic
│   │   ├── ProfileService.ts
│   │   └── GalaChainService.ts
│   ├── repositories/      # Database access
│   │   └── ProfileRepository.ts
│   ├── models/            # TypeORM entities
│   │   └── Profile.ts
│   ├── routes/            # Express routes
│   │   └── profileRoutes.ts
│   ├── utils/             # Utilities
│   │   ├── validation.ts
│   │   ├── errors.ts
│   │   └── fileUpload.ts
│   ├── middlewares/       # Express middlewares
│   │   └── errorHandler.ts
│   ├── config/            # Configuration
│   │   └── database.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── uploads/               # Uploaded files directory
├── dist/                  # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Security Considerations

- Use environment variables for sensitive data
- Implement proper authentication/authorization
- Validate all inputs using Zod schemas
- Use helmet for security headers
- Configure CORS appropriately for production
- Sanitize file uploads
- Use HTTPS in production
- For managed MySQL (Aiven/Render), set `DB_CA_CERT_BASE64` to the base64-encoded CA PEM (e.g., `base64 -w0 ca.pem` on Ubuntu). The app will write it to a temp file and enable TLS.

## 📚 Dependencies

### Production
- `express` - Web framework
- `typeorm` - ORM for TypeScript
- `mysql2` - MySQL driver
- `zod` - Schema validation
- `uuid` - UUID generation
- `dotenv` - Environment variables
- `multer` - File upload handling
- `reflect-metadata` - Required for TypeORM decorators
- `cors` - CORS middleware
- `helmet` - Security middleware

### Development
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server with hot reload
- `@types/*` - TypeScript type definitions

## 🐛 Error Handling

The application includes comprehensive error handling:

- Custom error classes (`AppError`, `NotFoundError`, `ValidationError`, etc.)
- Error handling middleware
- Proper HTTP status codes
- Detailed error messages in development
- Sanitized error messages in production

## 📄 License

ISC

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include validation for new endpoints
4. Update documentation
5. Write tests (when test suite is added)

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for GalaChain blockchain gaming

