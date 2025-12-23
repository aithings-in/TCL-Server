// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { databaseConfig } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { Constants } from "./utils/constants";
import { Messages } from "./utils/messages";
import { swaggerSpec } from "./config/swagger";

// Import routes
import registrationRoutes from "./routes/registration.routes";
import uploadRoutes from "./routes/upload.routes";
import paymentRoutes from "./routes/payment.routes";
import leadRoutes from "./routes/lead.routes";
import emailRoutes from "./routes/email.routes";

/**
 * Application Class
 * Main application setup and configuration
 */
class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "8000", 10);
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize all middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
      })
    );

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }

    // Rate limiting
    this.app.use(rateLimiter.getMiddleware());
  }

  /**
   * Initialize all routes
   */
  private initializeRoutes(): void {
    // Swagger documentation
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Health check endpoint
    this.app.get("/", (_: Request, res: Response) => {
      res.status(Constants.HTTP_STATUS.OK).json({
        status: "OK",
        message: Messages.SERVER.SERVER_RUNNING,
        timestamp: new Date().toISOString(),
      });
    });

    // API routes
    this.app.use("/api/registrations", registrationRoutes);
    this.app.use("/api/upload", uploadRoutes);
    this.app.use("/api/payments", paymentRoutes);
    this.app.use("/api/leads", leadRoutes);
    this.app.use("/api/emails", emailRoutes);
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // Error handling middleware (must be last)
    this.app.use(notFoundHandler.handle);
    this.app.use(errorHandler.handle);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to MongoDB
      await databaseConfig.connect();

      // Start listening
      this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`🔗 Health check: http://localhost:${this.port}/`);
        console.log(
          `📚 API Documentation: http://localhost:${this.port}/api-docs`
        );
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start();

export default app.app;
