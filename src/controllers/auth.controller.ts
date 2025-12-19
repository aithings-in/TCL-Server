import { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUserDocument } from "../models/User.model";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Authentication Controller Class
 * Handles user authentication operations
 */
export class AuthController {
  private jwtSecret: string;
  private jwtExpire: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    this.jwtExpire = process.env.JWT_EXPIRE || "7d";
  }

  /**
   * Generate JWT Token
   */
  private generateToken(id: string): string {
    const options: SignOptions = {
      expiresIn: parseInt(this.jwtExpire, 10),
    };
    return jwt.sign({ id }, this.jwtSecret, options);
  }

  /**
   * Register a new user
   * @route   POST /api/auth/register
   * @access  Public
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.AUTH.USER_ALREADY_EXISTS,
        } as ApiResponse);
        return;
      }

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        role: role || "user",
      });

      const token = this.generateToken(user._id.toString());

      res.status(Constants.HTTP_STATUS.CREATED).json({
        success: true,
        message: Messages.AUTH.USER_REGISTERED_SUCCESS,
        data: {
          user,
          token,
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.AUTH.REGISTRATION_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Login user
   * @route   POST /api/auth/login
   * @access  Public
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = (await User.findOne({ email }).select(
        "+password"
      )) as IUserDocument | null;
      if (!user) {
        res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: Messages.AUTH.INVALID_CREDENTIALS,
        } as ApiResponse);
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: Messages.AUTH.INVALID_CREDENTIALS,
        } as ApiResponse);
        return;
      }

      const token = this.generateToken(user._id.toString());

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.AUTH.LOGIN_SUCCESS,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.AUTH.LOGIN_FAILED,
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const authController = new AuthController();

// Export for backward compatibility
export const register = authController.register;
export const login = authController.login;
