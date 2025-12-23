import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "TCL Server API",
    version: "1.0.0",
    description: "API documentation for Turbo Cricket League Server",
    contact: {
      name: "TCL Support",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}`,
      description: "Development server",
    },
    {
      url: "https://api.tcl.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
          data: {
            type: "object",
          },
          error: {
            type: "string",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          name: {
            type: "string",
          },
          role: {
            type: "string",
            enum: ["admin", "user", "moderator"],
          },
        },
      },
      Registration: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          age: {
            type: "number",
            minimum: 10,
            maximum: 30,
          },
          mobile: {
            type: "string",
            pattern: "^[0-9]{10}$",
          },
          email: {
            type: "string",
            format: "email",
          },
          district: {
            type: "string",
          },
          state: {
            type: "string",
          },
          role: {
            type: "string",
            enum: ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
          },
          profileImage: {
            type: "string",
            format: "uri",
            nullable: true,
          },
          documents: {
            type: "array",
            items: {
              type: "string",
              format: "uri",
            },
          },
          status: {
            type: "string",
            enum: ["pending", "approved", "rejected"],
            default: "pending",
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Registrations",
      description: "Registration management endpoints",
    },
    {
      name: "Upload",
      description: "File upload endpoints",
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
