import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

interface TokenPayload {
  walletAddress: string;
  iat?: number;
  exp?: number;
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiration: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiration = process.env.JWT_EXPIRATION || '7d';
  }

  generateToken(walletAddress: string): string {
    const payload: TokenPayload = {
      walletAddress,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  verifySignature(message: string, signature: string): string | null {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress;
    } catch (error) {
      return null;
    }
  }

  createSignatureMessage(walletAddress: string, timestamp: number = Date.now()): string {
    return `I am signing this message to log into Arcano.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
  }

  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}
