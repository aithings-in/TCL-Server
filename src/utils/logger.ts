import fs from "fs";
import path from "path";

/**
 * Logger Utility Class
 * Handles application logging
 */
export class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), "logs");
    this.ensureLogDirectory();
  }

  /**
   * Ensure logs directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Log info message
   */
  public info(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`, ...args);
  }

  /**
   * Log error message
   */
  public error(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, ...args);
  }

  /**
   * Log warning message
   */
  public warn(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`, ...args);
  }

  /**
   * Log debug message (only in development)
   */
  public debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] ${timestamp} - ${message}`, ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
