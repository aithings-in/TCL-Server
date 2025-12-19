import rateLimit from "express-rate-limit";
import { Messages } from "../utils/messages";

/**
 * Rate Limiter Middleware Class
 * Handles API rate limiting
 */
export class RateLimiter {
  private windowMs: number;
  private maxRequests: number;

  constructor() {
    this.windowMs =
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10) ||
      15 * 60 * 1000; // 15 minutes
    this.maxRequests =
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10) || 100;
  }

  /**
   * Get rate limiter middleware
   */
  public getMiddleware() {
    return rateLimit({
      windowMs: this.windowMs,
      max: this.maxRequests,
      message: {
        success: false,
        message: Messages.SERVER.TOO_MANY_REQUESTS,
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Export for backward compatibility
export const rateLimiterMiddleware = rateLimiter.getMiddleware();
