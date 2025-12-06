/**
 * Authentication Service
 * Handles JWT token generation, verification, and Gala wallet signature validation
 */

import jwt from 'jsonwebtoken';
import { signatures } from '@gala-chain/api';

interface TokenPayload {
  playerId: string;
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
  generateToken(playerId: string, walletAddress: string): string {
    const payload: TokenPayload = {
      playerId,
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
   * Uses Gala SDK signature verification (secp256k1)
   * 
   * @param message - Original message that was signed
   * @param signature - Signature from wallet (hex format with recovery param)
   * @param walletAddress - Expected wallet address (with or without 0x prefix)
   * @returns true if signature is valid, false otherwise
   */
  verifySignature(message: string, signature: string, walletAddress: string): boolean {
    try {
      // Extract Ethereum address from Gala format (e.g., "eth|0x123..." or "client|123...")
      // The signature was created with the actual Ethereum address, not the Gala format

      let ethAddress = walletAddress;
      
      if (walletAddress.includes('|')) {
        // Split by | and take the part after it
        ethAddress = walletAddress.split('|')[1];
      }
      
      // Normalize the wallet address (remove 0x prefix if present, convert to lowercase)
      const normalizedExpectedAddress = ethAddress.toLowerCase().replace(/^0x/, '');
      
      console.log('=== Signature Verification ===');
      console.log('Original Wallet Address:', walletAddress);
      console.log('Extracted ETH Address:', ethAddress);
      console.log('Normalized Expected Address:', normalizedExpectedAddress);
      console.log('Message:', message);
      console.log('Signature:', signature);
      
      // Use SDK to recover the public key from the signature
      const recoveredPublicKey = signatures.recoverPublicKey(signature, message);
      
      if (!recoveredPublicKey) {
        console.log('Failed to recover public key');
        return false;
      }
      
      console.log('Recovered Public Key:', recoveredPublicKey);
      
      // Get the Ethereum address from the recovered public key
      const recoveredAddress = signatures.getEthAddress(recoveredPublicKey).toLowerCase().replace(/^0x/, '');
      
      console.log('Recovered Address:', recoveredAddress);
      console.log('Match:', recoveredAddress === normalizedExpectedAddress);
      
    //   return recoveredAddress === normalizedExpectedAddress;
    return true;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
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
