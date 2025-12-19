import Joi from "joi";
import { Messages } from "../utils/messages";
import { Constants } from "../utils/constants";

/**
 * Registration Validation Schemas
 */
export class RegistrationValidation {
  /**
   * Create registration validation schema
   */
  public static createSchema = Joi.object({
    name: Joi.string().trim().required().messages({
      "any.required": Messages.VALIDATION.NAME_REQUIRED,
      "string.empty": Messages.VALIDATION.NAME_REQUIRED,
    }),
    age: Joi.number().integer().min(10).max(30).required().messages({
      "number.base": Messages.VALIDATION.AGE_RANGE,
      "number.min": Messages.VALIDATION.AGE_RANGE,
      "number.max": Messages.VALIDATION.AGE_RANGE,
      "any.required": Messages.VALIDATION.AGE_REQUIRED,
    }),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": Messages.VALIDATION.MOBILE_INVALID,
        "any.required": Messages.VALIDATION.MOBILE_INVALID,
      }),
    email: Joi.string().email().required().messages({
      "string.email": Messages.VALIDATION.EMAIL_INVALID,
      "any.required": Messages.VALIDATION.EMAIL_INVALID,
    }),
    district: Joi.string().trim().required().messages({
      "any.required": Messages.VALIDATION.DISTRICT_REQUIRED,
      "string.empty": Messages.VALIDATION.DISTRICT_REQUIRED,
    }),
    state: Joi.string().trim().required().messages({
      "any.required": Messages.VALIDATION.STATE_REQUIRED,
      "string.empty": Messages.VALIDATION.STATE_REQUIRED,
    }),
    role: Joi.string()
      .valid(...Object.values(Constants.CRICKET_ROLES))
      .required()
      .messages({
        "any.only": Messages.VALIDATION.ROLE_INVALID,
        "any.required": Messages.VALIDATION.ROLE_INVALID,
      }),
    profileImage: Joi.string().uri().optional().allow(null, ""),
    documents: Joi.array().items(Joi.string().uri()).optional().default([]),
  });

  /**
   * Update registration status validation schema
   */
  public static updateStatusSchema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(Constants.REGISTRATION_STATUS))
      .required()
      .messages({
        "any.only": Messages.REGISTRATION.INVALID_STATUS,
        "any.required": Messages.REGISTRATION.INVALID_STATUS,
      }),
  });

  /**
   * Get registrations query validation schema
   */
  public static getRegistrationsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    sort: Joi.string().optional().default("registeredAt"),
    order: Joi.string().valid("asc", "desc").optional().default("desc"),
    status: Joi.string()
      .valid(...Object.values(Constants.REGISTRATION_STATUS))
      .optional(),
  });
}
