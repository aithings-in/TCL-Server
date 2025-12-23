import Joi from "joi";

/**
 * Payment Validation Schemas
 */
export class PaymentValidation {
  /**
   * Initialize payment validation schema
   */
  public static initializeSchema = Joi.object({
    registrationId: Joi.string().required().messages({
      "any.required": "Registration ID is required",
      "string.empty": "Registration ID cannot be empty",
    }),
  });

  /**
   * Verify payment validation schema
   */
  public static verifySchema = Joi.object({
    razorpay_order_id: Joi.string().required().messages({
      "any.required": "Razorpay order ID is required",
    }),
    razorpay_payment_id: Joi.string().required().messages({
      "any.required": "Razorpay payment ID is required",
    }),
    razorpay_signature: Joi.string().required().messages({
      "any.required": "Razorpay signature is required",
    }),
    paymentId: Joi.string().required().messages({
      "any.required": "Payment ID is required",
    }),
  });
}

