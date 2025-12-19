import { Response } from "express";
import { AuthRequest } from "../types";
import User from "../models/User.model";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * User Controller Class
 * Handles user operations
 */
export class UserController {
  /**
   * Get current user profile
   * @route   GET /api/users/me
   * @access  Private
   */
  public getCurrentUser = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const user = await User.findById(req.user?.id);

      if (!user) {
        res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: Messages.USER.USER_NOT_FOUND,
        } as ApiResponse);
        return;
      }

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.USER.USER_RETRIEVED_SUCCESS,
        data: user,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.USER.FAILED_TO_RETRIEVE_USER,
        error: error.message,
      } as ApiResponse);
    }
  };

  /**
   * Get all users
   * @route   GET /api/users
   * @access  Private (Admin)
   */
  public getAllUsers = async (
    _req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const users = await User.find().select("-password");

      res.status(Constants.HTTP_STATUS.OK).json({
        success: true,
        message: Messages.USER.USERS_RETRIEVED_SUCCESS,
        data: users,
      } as ApiResponse);
    } catch (error: any) {
      res.status(Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: Messages.USER.FAILED_TO_RETRIEVE_USERS,
        error: error.message,
      } as ApiResponse);
    }
  };
}

// Export singleton instance
export const userController = new UserController();

// Export for backward compatibility
export const getCurrentUser = userController.getCurrentUser;
export const getAllUsers = userController.getAllUsers;
