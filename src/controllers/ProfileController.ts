/**
 * Profile Controller - Handles HTTP requests for profile endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/ProfileService';

export class ProfileController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * POST /profile/login
   * Create or fetch profile by walletAddress
   * 
   * Request Body:
   * {
   *   "walletAddress": "string"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "nickName": "string",
   *     "profilePicture": "string | null",
   *     "xp": 0,
   *     "level": 0,
   *     "galaBalance": 0,
   *     "inventory": [],
   *     "cooldowns": { "battle": null, "hatch": null },
   *     "lastLogin": "2024-01-01T00:00:00.000Z",
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "inventoryCacheUpdatedAt": null
   *   }
   * }
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.body;
      const profile = await this.profileService.createProfile(walletAddress);
      await this.profileService.updateLastLogin(walletAddress);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile created or retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /profile/:walletAddress
   * Get profile by walletAddress
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "nickName": "string",
   *     "profilePicture": "string | null",
   *     "xp": 0,
   *     "level": 0,
   *     "galaBalance": 0,
   *     "inventory": [],
   *     "cooldowns": { "battle": null, "hatch": null },
   *     "lastLogin": "2024-01-01T00:00:00.000Z",
   *     "createdAt": "2024-01-01T00:00:00.000Z",
   *     "inventoryCacheUpdatedAt": null
   *   }
   * }
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const profile = await this.profileService.getProfile(walletAddress);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /profile/:walletAddress/nickname
   * Update nickname
   * 
   * Request Body:
   * {
   *   "nickName": "string"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "nickName": "updated nickname",
   *     ...
   *   },
   *   "message": "Nickname updated successfully"
   * }
   */
  updateNickName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const { nickName } = req.body;
      const profile = await this.profileService.updateNickName(walletAddress, nickName);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Nickname updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /profile/:walletAddress/profile-picture
   * Update profile picture
   * 
   * Request: multipart/form-data with file field "profilePicture"
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "profilePicture": "/uploads/profile_walletAddress_timestamp.jpg",
   *     ...
   *   },
   *   "message": "Profile picture updated successfully"
   * }
   */
  updateProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const file = req.file;
      
      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
        return;
      }

      // Generate file URL/path
      const filePath = `/uploads/${file.filename}`;
      const profile = await this.profileService.updateProfilePicture(walletAddress, filePath);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile picture updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:walletAddress/sync-balance
   * Sync GALA balance from blockchain
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "galaBalance": 123.456789,
   *     ...
   *   },
   *   "message": "Balance synced successfully"
   * }
   */
  syncGalaBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const profile = await this.profileService.syncGalaBalance(walletAddress);

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Balance synced successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /profile/:walletAddress/inventory
   * Get inventory from database
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "instanceId": "item_123_001",
   *       "equipped": false
   *     },
   *     {
   *       "instanceId": "item_123_002",
   *       "equipped": true
   *     }
   *   ]
   * }
   */
  getInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const inventory = await this.profileService.getInventory(walletAddress);
      
      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:walletAddress/inventory/refresh
   * Refresh inventory from blockchain
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": [
   *     {
   *       "instanceId": "item_123_001",
   *       "equipped": false
   *     }
   *   ],
   *   "message": "Inventory refreshed from blockchain"
   * }
   */
  refreshInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const inventory = await this.profileService.refreshInventoryFromChain(walletAddress);
      
      res.status(200).json({
        success: true,
        data: inventory,
        message: 'Inventory refreshed from blockchain',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:walletAddress/inventory/equip
   * Equip an item
   * 
   * Request Body:
   * {
   *   "instanceId": "string"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "inventory": [...],
   *     ...
   *   },
   *   "message": "Item equipped successfully"
   * }
   */
  equipItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const { instanceId } = req.body;
      const profile = await this.profileService.equipItem(walletAddress, instanceId);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: 'Item equipped successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:walletAddress/inventory/unequip
   * Unequip an item
   * 
   * Request Body:
   * {
   *   "instanceId": "string"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "inventory": [...],
   *     ...
   *   },
   *   "message": "Item unequipped successfully"
   * }
   */
  unequipItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const { instanceId } = req.body;
      const profile = await this.profileService.unequipItem(walletAddress, instanceId);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: 'Item unequipped successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:walletAddress/cooldown
   * Set cooldown
   * 
   * Request Body:
   * {
   *   "type": "battle" | "hatch",
   *   "seconds": 300
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "walletAddress": "string",
   *     "cooldowns": { "battle": 1704067200000, "hatch": null },
   *     ...
   *   },
   *   "message": "Cooldown set successfully"
   * }
   */
  setCooldown = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress } = req.params;
      const { type, seconds } = req.body;
      const profile = await this.profileService.setCooldown(walletAddress, type, seconds);
      
      res.status(200).json({
        success: true,
        data: profile,
        message: 'Cooldown set successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /profile/:walletAddress/cooldown/:type
   * Check cooldown status
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "type": "battle",
   *     "remainingSeconds": 250,
   *     "isActive": true
   *   }
   * }
   * OR
   * {
   *   "success": true,
   *   "data": {
   *     "type": "battle",
   *     "remainingSeconds": null,
   *     "isActive": false
   *   }
   * }
   */
  checkCooldown = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletAddress, type } = req.params;
      
      if (type !== 'battle' && type !== 'hatch') {
        res.status(400).json({
          success: false,
          error: 'Invalid cooldown type. Must be "battle" or "hatch"',
        });
        return;
      }

      const remainingSeconds = await this.profileService.checkCooldown(
        walletAddress,
        type as 'battle' | 'hatch'
      );
      
      res.status(200).json({
        success: true,
        data: {
          type,
          remainingSeconds,
          isActive: remainingSeconds !== null,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

