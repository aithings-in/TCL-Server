import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import User from "../models/User.model";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Authentication Middleware Class
 * Handles JWT authentication and authorization
 */
export class AuthMiddleware {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
  }

  /**
   * Authenticate user via JWT token
   */
  public authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: Messages.AUTH.AUTHENTICATION_REQUIRED,
        });
        return;
      }

      const decoded = jwt.verify(token, this.jwtSecret) as { id: string };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: Messages.AUTH.USER_NOT_FOUND,
        });
        return;
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: Messages.AUTH.INVALID_OR_EXPIRED_TOKEN,
      });
    }
  };

  /**
   * Authorize user based on roles
   */
  public authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: Messages.AUTH.AUTHENTICATION_REQUIRED_SHORT,
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(Constants.HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: Messages.AUTH.PERMISSION_DENIED,
        });
        return;
      }

      next();
    };
  };
}

// Export singleton instance
export const authMiddleware = new AuthMiddleware();

// Export for backward compatibility
export const authenticate = authMiddleware.authenticate;
export const authorize = authMiddleware.authorize.bind(authMiddleware);
