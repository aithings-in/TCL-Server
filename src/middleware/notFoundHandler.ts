import { Request, Response } from "express";
import { ApiResponse } from "../types";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Not Found Handler Middleware Class
 * Handles 404 errors
 */
export class NotFoundHandler {
  /**
   * Handle 404 Not Found errors
   */
  public handle = (req: Request, res: Response): void => {
    res.status(Constants.HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: Messages.ERROR.ROUTE_NOT_FOUND(req.originalUrl),
      error: Messages.ERROR.RESOURCE_NOT_FOUND,
    } as ApiResponse);
  };
}

// Export singleton instance
export const notFoundHandler = new NotFoundHandler();

// Export for backward compatibility
export const notFoundHandlerMiddleware = notFoundHandler.handle;
