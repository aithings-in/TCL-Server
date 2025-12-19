import Joi from "joi";
import { Messages } from "../utils/messages";

/**
 * Authentication Validation Schemas
 */
export class AuthValidation {
  /**
   * Register validation schema
   */
  public static registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": Messages.VALIDATION.EMAIL_INVALID,
      "any.required": Messages.VALIDATION.EMAIL_INVALID,
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": Messages.VALIDATION.PASSWORD_MIN_LENGTH,
      "any.required": Messages.VALIDATION.PASSWORD_REQUIRED,
    }),
    name: Joi.string().trim().required().messages({
      "any.required": Messages.VALIDATION.NAME_REQUIRED,
      "string.empty": Messages.VALIDATION.NAME_REQUIRED,
    }),
    role: Joi.string()
      .valid("admin", "user", "moderator")
      .optional()
      .default("user"),
  });

  /**
   * Login validation schema
   */
  public static loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": Messages.VALIDATION.EMAIL_INVALID,
      "any.required": Messages.VALIDATION.EMAIL_INVALID,
    }),
    password: Joi.string().required().messages({
      "any.required": Messages.VALIDATION.PASSWORD_REQUIRED,
    }),
  });
}
