import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { Constants } from "../utils/constants";
import { Messages } from "../utils/messages";

/**
 * Validator Middleware Class
 * Handles request validation
 */
export class ValidatorMiddleware {
  /**
   * Validate request based on validation chains
   */
  public validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Run all validations
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: Messages.ERROR.VALIDATION_FAILED,
        errors: errors.array(),
      });
    };
  };
}

// Export singleton instance
export const validatorMiddleware = new ValidatorMiddleware();

// Export for backward compatibility
export const validate = validatorMiddleware.validate.bind(validatorMiddleware);
