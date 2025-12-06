/**
 * Authentication Controller
 * Handles login, logout, and wallet signature verification
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';
import { AppError } from '../utils/errors';

export class AuthController {
  private authService: AuthService;
  private profileService: ProfileService;

  constructor() {
    this.authService = new AuthService();
    this.profileService = new ProfileService();
  }

  /**
   * POST /auth/sign-message
   * Generate a message to be signed by the user's wallet
   * 
   * Request Body:
   * {
   *   "walletAddress": "0x..."
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "message": "I am signing this message to log into Arcano...",
   *     "timestamp": 1234567890
   *   }
   * }
   */
  signMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        throw new AppError('Wallet address is required', 400);
      }

      const timestamp = Date.now();
      const message = this.authService.createSignatureMessage(walletAddress, timestamp);

      res.status(200).json({
        success: true,
        data: {
          message,
          timestamp,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /auth/login
   * Verify wallet signature and authenticate user
   * 
   * Request Body:
   * {
   *   "walletAddress": "0x...",
   *   "message": "I am signing this message...",
   *   "signature": "0x...",
   *   "playerId": "optional-player-id"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "token": "jwt-token",
   *     "profile": { profile data }
   *   }
   * }
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress, message, signature, playerId } = req.body;
        
      // Validate inputs
      if (!walletAddress || !message || !signature) {
        throw new AppError('Wallet address, message, and signature are required', 400);
      }

      // Verify the signature
      const isValidSignature = this.authService.verifySignature(message, signature, walletAddress);

      if (!isValidSignature) {
        throw new AppError('Invalid signature', 401);
      }

      // Use provided playerId or wallet address as default
      const actualPlayerId = playerId || walletAddress;

      // Create or get profile
      const profile = await this.profileService.createProfile(actualPlayerId);
      await this.profileService.updateLastLogin(actualPlayerId);

      // Generate JWT token
      const token = this.authService.generateToken(profile.id, actualPlayerId);

      res.status(200).json({
        success: true,
        data: {
          token,
          profile,
        },
        message: 'Authentication successful',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /auth/verify
   * Verify current token is valid
   * Requires: Authorization header with Bearer token
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "playerId": "...",
   *     "walletAddress": "0x..."
   *   }
   * }
   */
  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId || !req.walletAddress) {
        throw new AppError('Not authenticated', 401);
      }

      res.status(200).json({
        success: true,
        data: {
          playerId: req.userId,
          walletAddress: req.walletAddress,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
