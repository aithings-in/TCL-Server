/**
 * Application Constants Class
 * Contains all application constants
 */
export class Constants {
  /**
   * HTTP Status Codes
   */
  public static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  } as const;

  /**
   * User Roles
   */
  public static readonly USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
    MODERATOR: "moderator",
  } as const;

  /**
   * Registration Status
   */
  public static readonly REGISTRATION_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
  } as const;

  /**
   * Cricket Roles
   */
  public static readonly CRICKET_ROLES = {
    BATSMAN: "Batsman",
    BOWLER: "Bowler",
    ALL_ROUNDER: "All-rounder",
    WICKETKEEPER: "Wicketkeeper",
  } as const;

  /**
   * File Upload Limits
   */
  public static readonly FILE_UPLOAD_LIMITS = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    ALLOWED_DOC_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  } as const;
}

// Export for backward compatibility
export const HTTP_STATUS = Constants.HTTP_STATUS;
export const USER_ROLES = Constants.USER_ROLES;
export const REGISTRATION_STATUS = Constants.REGISTRATION_STATUS;
export const CRICKET_ROLES = Constants.CRICKET_ROLES;
export const FILE_UPLOAD_LIMITS = Constants.FILE_UPLOAD_LIMITS;
