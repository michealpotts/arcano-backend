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
   * Create or fetch profile by playerId
   * 
   * Request Body:
   * {
   *   "playerId": "string"
   * }
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "playerId": "string",
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
      const { playerId } = req.body;
      const profile = await this.profileService.createProfile(playerId);
      await this.profileService.updateLastLogin(playerId);

      // Convert profilePicture to absolute URL for frontend
      if (profile && profile.profilePicture) {
        // @ts-ignore mutate for response
        profile.profilePicture = this.makeAbsoluteUrl(req, profile.profilePicture) as any;
      }

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
   * GET /profile/:playerId
   * Get profile by playerId
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "playerId": "string",
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
      const { playerId } = req.params;
      const profile = await this.profileService.getProfile(playerId);

      if (profile && profile.profilePicture) {
        // @ts-ignore
        profile.profilePicture = this.makeAbsoluteUrl(req, profile.profilePicture) as any;
      }

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /profile/:playerId/nickname
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
   *     "playerId": "string",
   *     "nickName": "updated nickname",
   *     ...
   *   },
   *   "message": "Nickname updated successfully"
   * }
   */
  updateNickName = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const { nickName } = req.body;
      const profile = await this.profileService.updateNickName(playerId, nickName);

      if (profile && profile.profilePicture) {
        // @ts-ignore
        profile.profilePicture = this.makeAbsoluteUrl(req, profile.profilePicture) as any;
      }

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
   * PATCH /profile/:playerId/profile-picture
   * Update profile picture
   * 
   * Request: multipart/form-data with file field "profilePicture"
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "playerId": "string",
   *     "profilePicture": "/uploads/profile_playerId_timestamp.jpg",
   *     ...
   *   },
   *   "message": "Profile picture updated successfully"
   * }
   */
  updateProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      // Generate file URL/path
      const filePath = `/uploads/${file.filename}`;
      const profile = await this.profileService.updateProfilePicture(playerId, filePath);

      if (profile && profile.profilePicture) {
        // @ts-ignore
        profile.profilePicture = this.makeAbsoluteUrl(req, profile.profilePicture) as any;
      }

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
   * POST /profile/:playerId/sync-balance
   * Sync GALA balance from blockchain
   * 
   * Response:
   * {
   *   "success": true,
   *   "data": {
   *     "id": "uuid",
   *     "playerId": "string",
   *     "galaBalance": 123.456789,
   *     ...
   *   },
   *   "message": "Balance synced successfully"
   * }
   */
  syncGalaBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const profile = await this.profileService.syncGalaBalance(playerId);

      if (profile && profile.profilePicture) {
        // @ts-ignore
        profile.profilePicture = this.makeAbsoluteUrl(req, profile.profilePicture) as any;
      }

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
   * GET /profile/:playerId/inventory
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
      const { playerId } = req.params;
      const inventory = await this.profileService.getInventory(playerId);
      
      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /profile/:playerId/inventory/refresh
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
      const { playerId } = req.params;
      const inventory = await this.profileService.refreshInventoryFromChain(playerId);
      
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
   * POST /profile/:playerId/inventory/equip
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
   *     "playerId": "string",
   *     "inventory": [...],
   *     ...
   *   },
   *   "message": "Item equipped successfully"
   * }
   */
  equipItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const { instanceId } = req.body;
      const profile = await this.profileService.equipItem(playerId, instanceId);
      
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
   * POST /profile/:playerId/inventory/unequip
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
   *     "playerId": "string",
   *     "inventory": [...],
   *     ...
   *   },
   *   "message": "Item unequipped successfully"
   * }
   */
  unequipItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const { instanceId } = req.body;
      const profile = await this.profileService.unequipItem(playerId, instanceId);
      
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
   * POST /profile/:playerId/cooldown
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
   *     "playerId": "string",
   *     "cooldowns": { "battle": 1704067200000, "hatch": null },
   *     ...
   *   },
   *   "message": "Cooldown set successfully"
   * }
   */
  setCooldown = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { playerId } = req.params;
      const { type, seconds } = req.body;
      const profile = await this.profileService.setCooldown(playerId, type, seconds);
      
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
   * GET /profile/:playerId/cooldown/:type
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
      const { playerId, type } = req.params;
      
      if (type !== 'battle' && type !== 'hatch') {
        return res.status(400).json({
          success: false,
          error: 'Invalid cooldown type. Must be "battle" or "hatch"',
        });
      }

      const remainingSeconds = await this.profileService.checkCooldown(
        playerId,
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

