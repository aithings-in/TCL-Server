import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Joi Validator Middleware Class
 * Validates request data using Joi schemas
 */
export class JoiValidatorMiddleware {
  /**
   * Validate request body
   */
  public validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.ERROR.VALIDATION_FAILED,
          errors,
        });
        return;
      }

      req.body = value;
      next();
    };
  };

  /**
   * Validate request query parameters
   */
  public validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error, value } = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.ERROR.VALIDATION_FAILED,
          errors,
        });
        return;
      }

      req.query = value;
      next();
    };
  };

  /**
   * Validate request parameters
   */
  public validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error, value } = schema.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = error.details.map((detail) => detail.message);
        res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: Messages.ERROR.VALIDATION_FAILED,
          errors,
        });
        return;
      }

      req.params = value;
      next();
    };
  };
}

// Export singleton instance
export const joiValidator = new JoiValidatorMiddleware();
