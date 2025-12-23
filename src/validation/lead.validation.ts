import Joi from "joi";
import { Messages } from "../utils/messages";

/**
 * Lead Validation Schemas
 */
export class LeadValidation {
  /**
   * Create lead validation schema
   */
  public static createSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      "any.required": Messages.VALIDATION.NAME_REQUIRED,
      "string.empty": Messages.VALIDATION.NAME_REQUIRED,
    }),
    email: Joi.string().email().required().messages({
      "string.email": Messages.VALIDATION.EMAIL_INVALID,
      "any.required": Messages.VALIDATION.EMAIL_INVALID,
    }),
    message: Joi.string().trim().required().min(10).messages({
      "any.required": "Message is required",
      "string.empty": "Message cannot be empty",
      "string.min": "Message must be at least 10 characters",
    }),
  });
}

