import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ProfileService } from '../services/ProfileService';
import { WalletService } from "../services/WalletService";
import { GalaChainService } from "../services/GalaChainService";
import { AppError } from '../utils/errors';

const signatureMessage = "Arcano Authentication Message";

export class AuthController {
  private authService: AuthService;
  private profileService: ProfileService;
  private walletService: WalletService;
  private galaChainService: GalaChainService;

  constructor() {
    this.authService = new AuthService();
    this.profileService = new ProfileService();
    this.walletService = new WalletService();
    this.galaChainService = new GalaChainService();
  }

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

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress, message, signature } = req.body;
      if (!walletAddress || !message || !signature) {
        throw new AppError(400, 'Wallet address, message, and signature are required');
      }    
      const recoveredWalletAddress = this.walletService.verifySignature(message, signature);
      if(!recoveredWalletAddress){
        throw new AppError(401, 'Invalid signature');
      }
      const isRegistrated = await this.galaChainService.isRegistrated(recoveredWalletAddress);
      let playerId = "eth|"+walletAddress.replace(/^0x/i, "");
      if(!isRegistrated){
        const publicKey = this.walletService.getPublickey(message,signature);
        let id = await this.galaChainService.registerUser(publicKey);
        if(id){
          playerId=id;
        }
      }

      // Create or get profile using walletAddress
      const profile = await this.profileService.createProfile(recoveredWalletAddress, playerId);
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
