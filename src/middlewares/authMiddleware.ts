/**
 * JWT Authentication Middleware
 * Verifies JWT tokens on protected routes
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      walletAddress?: string;
    }
  }
}

export class AuthMiddleware {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Verify JWT token middleware
   * Expected header: Authorization: Bearer <token>
   */
  verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        throw new AppError('Authorization header missing', 401);
      }

      const token = this.authService.extractToken(authHeader);
      if (!token) {
        throw new AppError('Invalid authorization format', 401);
      }

      const payload = this.authService.verifyToken(token);
      if (!payload) {
        throw new AppError('Invalid or expired token', 401);
      }

      // Attach user info to request
      req.userId = payload.playerId;
      req.walletAddress = payload.walletAddress;

      next();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Authentication failed',
        });
      }
    }
  };
}

export const createAuthMiddleware = () => new AuthMiddleware();
