/**
 * Authentication Routes
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { z } from 'zod';
import { validate } from '../utils/validation';

const router = Router();
const authController = new AuthController();
const authMiddleware = createAuthMiddleware();

// Validation schemas
const signMessageSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
});

const loginSchema = z.object({
  walletAddress: z.string().min(1, 'Wallet address is required'),
  message: z.string().min(1, 'Message is required'),
  signature: z.string().min(1, 'Signature is required'),
});


router.post(
  '/sign-message',
  validate(signMessageSchema),
  authController.signMessage
);

router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

router.get(
  '/verify',
  authMiddleware.verifyToken,
  authController.verify
);

export default router;
