import Joi from "joi";

/**
 * Upload Validation Schemas
 */
export class UploadValidation {
  /**
   * Upload file body validation schema
   */
  public static uploadBodySchema = Joi.object({
    folder: Joi.string().trim().optional().default("uploads"),
  });

  /**
   * Delete file params validation schema
   */
  public static deleteFileParamsSchema = Joi.object({
    key: Joi.string().required().messages({
      "any.required": "File key is required",
    }),
  });
}
