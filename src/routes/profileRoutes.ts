/**
 * Profile Routes - API endpoint definitions
 */

import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { validate, validateParams, createProfileSchema, updateNickNameSchema, equipItemSchema, setCooldownSchema, walletAddressSchema } from '../utils/validation';
import { upload, handleUploadError } from '../utils/fileUpload';
import { z } from 'zod';

const router = Router();
const profileController = new ProfileController();

// WalletAddress param validation schema
const walletAddressParamSchema = z.object({
  walletAddress: walletAddressSchema,
});

// Cooldown type param validation schema
const cooldownTypeParamSchema = z.object({
  walletAddress: walletAddressSchema,
  type: z.enum(['battle', 'hatch']),
});

/**
 * POST /profile/login
 * Create or fetch profile by walletAddress
 */
router.post(
  '/login',
  validate(createProfileSchema),
  profileController.login
);

/**
 * GET /profile/:walletAddress
 * Get profile by walletAddress
 */
router.get(
  '/:walletAddress',
  validateParams(walletAddressParamSchema),
  profileController.getProfile
);

/**
 * PATCH /profile/:walletAddress/nickname
 * Update nickname
 */
router.patch(
  '/:walletAddress/nickname',
  validateParams(walletAddressParamSchema),
  validate(updateNickNameSchema),
  profileController.updateNickName
);

/**
 * PATCH /profile/:walletAddress/profile-picture
 * Update profile picture (file upload)
 */
router.patch(
  '/:walletAddress/profile-picture',
  validateParams(walletAddressParamSchema),
  upload.single('profilePicture'),
  handleUploadError,
  profileController.updateProfilePicture
);

/**
 * POST /profile/:walletAddress/sync-balance
 * Sync GALA balance from blockchain
 */
router.post(
  '/:walletAddress/sync-balance',
  validateParams(walletAddressParamSchema),
  profileController.syncGalaBalance
);

/**
 * GET /profile/:walletAddress/inventory
 * Get inventory from database
 */
router.get(
  '/:walletAddress/inventory',
  validateParams(walletAddressParamSchema),
  profileController.getInventory
);

/**
 * POST /profile/:walletAddress/inventory/refresh
 * Refresh inventory from blockchain
 */
router.post(
  '/:walletAddress/inventory/refresh',
  validateParams(walletAddressParamSchema),
  profileController.refreshInventory
);

/**
 * POST /profile/:walletAddress/inventory/equip
 * Equip an item
 */
router.post(
  '/:walletAddress/inventory/equip',
  validateParams(walletAddressParamSchema),
  validate(equipItemSchema),
  profileController.equipItem
);

/**
 * POST /profile/:walletAddress/inventory/unequip
 * Unequip an item
 */
router.post(
  '/:walletAddress/inventory/unequip',
  validateParams(walletAddressParamSchema),
  validate(equipItemSchema), // Uses same schema as equip (just instanceId)
  profileController.unequipItem
);

/**
 * POST /profile/:walletAddress/cooldown
 * Set cooldown
 */
router.post(
  '/:walletAddress/cooldown',
  validateParams(walletAddressParamSchema),
  validate(setCooldownSchema),
  profileController.setCooldown
);

/**
 * GET /profile/:walletAddress/cooldown/:type
 * Check cooldown status
 */
router.get(
  '/:walletAddress/cooldown/:type',
  validateParams(cooldownTypeParamSchema),
  profileController.checkCooldown
);

export default router;

