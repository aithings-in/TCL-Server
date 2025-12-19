import mongoose from "mongoose";

/**
 * Database Configuration Class
 * Handles MongoDB connection and management
 */
export class DatabaseConfig {
  private connection: typeof mongoose.connection | null = null;

  /**
   * Connect to MongoDB database
   */
  public async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI_PROD;

      if (!mongoUri) {
        throw new Error("MongoDB URI is not defined in environment variables");
      }

      const options: mongoose.ConnectOptions = {
        // These options are recommended for Mongoose 6+
      };

      await mongoose.connect(mongoUri, options);

      this.connection = mongoose.connection;

      console.log("✅ MongoDB connected successfully");

      // Handle connection events
      this.setupEventHandlers();

      // Graceful shutdown
      this.setupGracefulShutdown();
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  /**
   * Setup MongoDB connection event handlers
   */
  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    this.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });
  }

  /**
   * Setup graceful shutdown handler
   */
  private setupGracefulShutdown(): void {
    process.on("SIGINT", async () => {
      await this.disconnect();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  /**
   * Get MongoDB connection instance
   */
  public getConnection(): typeof mongoose.connection | null {
    return this.connection;
  }
}

// Export singleton instance
export const databaseConfig = new DatabaseConfig();

// Export for backward compatibility
export const connectDatabase = async (): Promise<void> => {
  await databaseConfig.connect();
};
