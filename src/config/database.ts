/**
 * TypeORM Data Source Configuration
 */

import { DataSource } from 'typeorm';
import { Profile } from '../models/Profile';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

/**
 * Decode base64 CA certificate from environment, persist to a temp file,
 * and return the file path. This allows MySQL clients to read the CA
 * when connecting to managed services (e.g., Aiven, Render).
 */
const getCaCertPath = (): string | undefined => {
  const base64 = process.env.DB_CA_CERT_BASE64;
  if (!base64) return undefined;

  const caDir = path.join(os.tmpdir(), 'galachain-db-ca');
  const caPath = path.join(caDir, 'mysql-ca.pem');

  try {
    fs.mkdirSync(caDir, { recursive: true });
    const pem = Buffer.from(base64, 'base64').toString('utf8');
    fs.writeFileSync(caPath, pem);
    return caPath;
  } catch (error) {
    console.error('❌ Failed to write CA certificate file:', error);
    return undefined;
  }
};

const caCertPath = getCaCertPath();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'galachain_game',
  ssl: caCertPath
    ? {
        ca: fs.readFileSync(caCertPath, 'utf8'),
        rejectUnauthorized: true,
      }
    : undefined,
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [Profile],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

// Initialize database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

