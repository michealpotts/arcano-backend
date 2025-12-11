/**
 * Authentication Controller
 * Handles login, logout, and wallet signature verification
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';
import { AppError } from '../utils/errors';

const signatureMessage = "Arcano Authentication Message";

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
        throw new AppError(400, 'Wallet address is required');
      }

      const timestamp = Date.now();
      const message = signatureMessage;

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
   *   "signature": "0x..."
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
      const { walletAddress, message, signature } = req.body;
        
      // Validate inputs
      if (!walletAddress || !message || !signature) {
        throw new AppError(400, 'Wallet address, message, and signature are required');
      }

      // Verify the signature and get the recovered wallet address
      const recoveredWalletAddress = this.authService.verifySignature(message, signature);
      
      if (!recoveredWalletAddress) {
        throw new AppError(401, 'Invalid signature');
      }

      // Create or get profile using walletAddress
      const profile = await this.profileService.createProfile(recoveredWalletAddress, walletAddress);
      await this.profileService.updateLastLogin(recoveredWalletAddress);

      // Generate JWT token
      const token = this.authService.generateToken(profile.walletAddress);

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
   *     "walletAddress": "0x..."
   *   }
   * }
   */
  verify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.walletAddress) {
        throw new AppError(401, 'Not authenticated');
      }

      res.status(200).json({
        success: true,
        data: {
          walletAddress: req.walletAddress,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
