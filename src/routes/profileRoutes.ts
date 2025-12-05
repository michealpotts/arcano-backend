/**
 * Profile Routes - API endpoint definitions
 */

import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { validate, validateParams, createProfileSchema, updateNickNameSchema, equipItemSchema, setCooldownSchema, playerIdSchema } from '../utils/validation';
import { upload, handleUploadError } from '../utils/fileUpload';
import { z } from 'zod';

const router = Router();
const profileController = new ProfileController();

// PlayerId param validation schema
const playerIdParamSchema = z.object({
  playerId: playerIdSchema,
});

// Cooldown type param validation schema
const cooldownTypeParamSchema = z.object({
  playerId: playerIdSchema,
  type: z.enum(['battle', 'hatch']),
});

/**
 * POST /profile/login
 * Create or fetch profile by playerId
 */
router.post(
  '/login',
  validate(createProfileSchema),
  profileController.login
);

/**
 * GET /profile/:playerId
 * Get profile by playerId
 */
router.get(
  '/:playerId',
  validateParams(playerIdParamSchema),
  profileController.getProfile
);

/**
 * PATCH /profile/:playerId/nickname
 * Update nickname
 */
router.patch(
  '/:playerId/nickname',
  validateParams(playerIdParamSchema),
  validate(updateNickNameSchema),
  profileController.updateNickName
);

/**
 * PATCH /profile/:playerId/profile-picture
 * Update profile picture (file upload)
 */
router.patch(
  '/:playerId/profile-picture',
  validateParams(playerIdParamSchema),
  upload.single('profilePicture'),
  handleUploadError,
  profileController.updateProfilePicture
);

/**
 * POST /profile/:playerId/sync-balance
 * Sync GALA balance from blockchain
 */
router.post(
  '/:playerId/sync-balance',
  validateParams(playerIdParamSchema),
  profileController.syncGalaBalance
);

/**
 * GET /profile/:playerId/inventory
 * Get inventory from database
 */
router.get(
  '/:playerId/inventory',
  validateParams(playerIdParamSchema),
  profileController.getInventory
);

/**
 * POST /profile/:playerId/inventory/refresh
 * Refresh inventory from blockchain
 */
router.post(
  '/:playerId/inventory/refresh',
  validateParams(playerIdParamSchema),
  profileController.refreshInventory
);

/**
 * POST /profile/:playerId/inventory/equip
 * Equip an item
 */
router.post(
  '/:playerId/inventory/equip',
  validateParams(playerIdParamSchema),
  validate(equipItemSchema),
  profileController.equipItem
);

/**
 * POST /profile/:playerId/inventory/unequip
 * Unequip an item
 */
router.post(
  '/:playerId/inventory/unequip',
  validateParams(playerIdParamSchema),
  validate(equipItemSchema), // Uses same schema as equip (just instanceId)
  profileController.unequipItem
);

/**
 * POST /profile/:playerId/cooldown
 * Set cooldown
 */
router.post(
  '/:playerId/cooldown',
  validateParams(playerIdParamSchema),
  validate(setCooldownSchema),
  profileController.setCooldown
);

/**
 * GET /profile/:playerId/cooldown/:type
 * Check cooldown status
 */
router.get(
  '/:playerId/cooldown/:type',
  validateParams(cooldownTypeParamSchema),
  profileController.checkCooldown
);

export default router;

