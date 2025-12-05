# Environment Setup Guide

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password_here
DB_DATABASE=galachain_game

# GalaChain Configuration
GALACHAIN_NETWORK=testnet
GALACHAIN_API_KEY=your_api_key_here
GALACHAIN_RPC_URL=https://api.galachain.com

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

## Setup Steps

1. Copy the content above into a new `.env` file
2. Replace `your_password_here` with your MySQL root password
3. Replace `your_api_key_here` with your GalaChain API key
4. Adjust other values as needed for your environment

## Database Setup

1. Make sure MySQL is running
2. Create the database:
   ```sql
   CREATE DATABASE galachain_game;
   ```
3. The application will auto-create tables in development mode (synchronize: true)

## Notes

- Never commit the `.env` file to version control (it's in `.gitignore`)
- In production, set `NODE_ENV=production` and disable `synchronize` in database config
- Adjust `MAX_FILE_SIZE` (in bytes) based on your needs (default is 5MB)

