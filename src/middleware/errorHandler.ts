import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Error Handler Middleware Class
 * Handles all application errors
 */
export class ErrorHandler {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Main error handler middleware
   */
  public handle = (
    err: Error | any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void => {
    console.error("Error:", err);

    // Mongoose validation error
    if (err.name === "ValidationError") {
      this.handleValidationError(err, res);
      return;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      this.handleDuplicateKeyError(err, res);
      return;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      this.handleJWTError(res);
      return;
    }

    if (err.name === "TokenExpiredError") {
      this.handleJWTExpiredError(res);
      return;
    }

    // Default error
    this.handleDefaultError(err, res);
  };

  /**
   * Handle Mongoose validation errors
   */
  private handleValidationError(err: any, res: Response): void {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: Messages.ERROR.VALIDATION_ERROR,
      error: messages.join(", "),
    } as ApiResponse);
  }

  /**
   * Handle duplicate key errors
   */
  private handleDuplicateKeyError(err: any, res: Response): void {
    const field = Object.keys(err.keyPattern)[0];
    res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: Messages.ERROR.FIELD_ALREADY_EXISTS(field),
      error: Messages.ERROR.FIELD_ALREADY_REGISTERED(field),
    } as ApiResponse);
  }

  /**
   * Handle JWT errors
   */
  private handleJWTError(res: Response): void {
    res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: Messages.ERROR.INVALID_TOKEN,
      error: Messages.ERROR.INVALID_TOKEN_DESCRIPTION,
    } as ApiResponse);
  }

  /**
   * Handle JWT expired errors
   */
  private handleJWTExpiredError(res: Response): void {
    res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: Messages.ERROR.TOKEN_EXPIRED,
      error: Messages.ERROR.TOKEN_EXPIRED_DESCRIPTION,
    } as ApiResponse);
  }

  /**
   * Handle default errors
   */
  private handleDefaultError(err: Error | any, res: Response): void {
    res
      .status(err.statusCode || Constants.HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: err.message || Messages.ERROR.INTERNAL_SERVER_ERROR,
        error: this.isDevelopment ? err.stack : undefined,
      } as ApiResponse);
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export for backward compatibility
export const errorHandlerMiddleware = errorHandler.handle;
