/**
 * Validation schemas using Zod
 */

import { z } from 'zod';

// WalletAddress validation (Ethereum address format)
export const walletAddressSchema = z.string().min(1, 'Wallet address is required');

// Profile schemas
export const createProfileSchema = z.object({
  walletAddress: walletAddressSchema,
});

export const updateNickNameSchema = z.object({
  nickName: z
    .string()
    .min(1, 'Nickname is required')
    .max(100, 'Nickname cannot exceed 100 characters')
    .trim(),
});

export const equipItemSchema = z.object({
  instanceId: z.string().min(1, 'InstanceId is required'),
});

export const setCooldownSchema = z.object({
  type: z.enum(['battle', 'hatch'], {
    errorMap: () => ({ message: 'Type must be either "battle" or "hatch"' }),
  }),
  seconds: z
    .number()
    .int('Seconds must be an integer')
    .min(0, 'Seconds cannot be negative'),
});

export const incrementXPSchema = z.object({
  amount: z
    .number()
    .int('Amount must be an integer')
    .min(1, 'Amount must be at least 1'),
});

/**
 * Validate request body against a schema
 */
export const validate = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};

/**
 * Validate request params
 */
export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Invalid parameters',
          details: error.errors,
        });
      }
      next(error);
    }
  };
};

