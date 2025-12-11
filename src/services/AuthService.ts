/**
 * Authentication Service
 * Handles JWT token generation, verification, and Gala wallet signature validation
 */

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

  /**
   * Generate JWT token for authenticated user
   */
  generateToken(walletAddress: string): string {
    const payload: TokenPayload = {
      walletAddress,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify signed message from Gala wallet
   * Validates that the signature was created by the wallet address
   * Uses ethers signature verification (secp256k1)
   * 
   * @param message - Original message that was signed
   * @param signature - Signature from wallet (hex format with recovery param)
   * @returns walletAddress if signature is valid, null otherwise
   */
  verifySignature(message: string, signature: string): string | null {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase();
    } catch (error) {
      return null;
    }
  }

  /**
   * Create a message to be signed by the wallet
   * This message should be signed with the user's private key
   */
  createSignatureMessage(walletAddress: string, timestamp: number = Date.now()): string {
    return `I am signing this message to log into Arcano.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
  }

  /**
   * Extract token from Authorization header
   */
  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}
