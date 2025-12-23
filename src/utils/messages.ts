/**
 * Application Messages Class
 * Contains all application messages (success, error, validation)
 */
export class Messages {
  /**
   * Authentication Messages
   */
  public static readonly AUTH = {
    USER_ALREADY_EXISTS: "User already exists with this email",
    USER_REGISTERED_SUCCESS: "User registered successfully",
    REGISTRATION_FAILED: "Registration failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    LOGIN_SUCCESS: "Login successful",
    LOGIN_FAILED: "Login failed",
    AUTHENTICATION_REQUIRED: "Authentication required. Please provide a token.",
    USER_NOT_FOUND: "User not found. Token is invalid.",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token.",
    AUTHENTICATION_REQUIRED_SHORT: "Authentication required.",
    PERMISSION_DENIED: "You do not have permission to perform this action.",
  } as const;

  /**
   * Registration Messages
   */
  public static readonly REGISTRATION = {
    EMAIL_ALREADY_REGISTERED: "This email has already been registered",
    PAYMENT_PENDING: "Payment is pending for this registration",
    REGISTRATION_SUCCESS: "Registration successful! We'll contact you soon.",
    REGISTRATION_FAILED: "Registration failed",
    REGISTRATIONS_RETRIEVED_SUCCESS: "Registrations retrieved successfully",
    FAILED_TO_RETRIEVE_REGISTRATIONS: "Failed to retrieve registrations",
    REGISTRATION_NOT_FOUND: "Registration not found",
    REGISTRATION_RETRIEVED_SUCCESS: "Registration retrieved successfully",
    FAILED_TO_RETRIEVE_REGISTRATION: "Failed to retrieve registration",
    INVALID_STATUS: "Invalid status. Must be pending, approved, or rejected",
    STATUS_UPDATED_SUCCESS: "Registration status updated successfully",
    FAILED_TO_UPDATE_STATUS: "Failed to update registration status",
    REGISTRATION_DELETED_SUCCESS: "Registration deleted successfully",
    FAILED_TO_DELETE_REGISTRATION: "Failed to delete registration",
  } as const;

  /**
   * Upload Messages
   */
  public static readonly UPLOAD = {
    NO_FILE_PROVIDED: "No file provided",
    FILE_UPLOADED_SUCCESS: "File uploaded successfully",
    FILE_UPLOAD_FAILED: "File upload failed",
    NO_FILES_PROVIDED: "No files provided",
    FILES_UPLOADED_SUCCESS: "Files uploaded successfully",
    FILE_KEY_REQUIRED: "File key is required",
    FILE_DELETED_SUCCESS: "File deleted successfully",
    FILE_DELETION_FAILED: "File deletion failed",
  } as const;

  /**
   * User Messages
   */
  public static readonly USER = {
    USER_NOT_FOUND: "User not found",
    USER_RETRIEVED_SUCCESS: "User retrieved successfully",
    FAILED_TO_RETRIEVE_USER: "Failed to retrieve user",
    USERS_RETRIEVED_SUCCESS: "Users retrieved successfully",
    FAILED_TO_RETRIEVE_USERS: "Failed to retrieve users",
  } as const;

  /**
   * Error Messages
   */
  public static readonly ERROR = {
    VALIDATION_ERROR: "Validation Error",
    FIELD_ALREADY_EXISTS: (field: string) => `${field} already exists`,
    FIELD_ALREADY_REGISTERED: (field: string) =>
      `This ${field} is already registered`,
    INVALID_TOKEN: "Invalid token",
    INVALID_TOKEN_DESCRIPTION: "Please provide a valid authentication token",
    TOKEN_EXPIRED: "Token expired",
    TOKEN_EXPIRED_DESCRIPTION: "Please login again",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    ROUTE_NOT_FOUND: (route: string) => `Route ${route} not found`,
    RESOURCE_NOT_FOUND: "The requested resource does not exist",
    VALIDATION_FAILED: "Validation failed",
  } as const;

  /**
   * Server Messages
   */
  public static readonly SERVER = {
    SERVER_RUNNING: "Server is running",
    TOO_MANY_REQUESTS:
      "Too many requests from this IP, please try again later.",
  } as const;

  /**
   * Validation Messages
   */
  public static readonly VALIDATION = {
    EMAIL_INVALID: "Please provide a valid email",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
    NAME_REQUIRED: "Name is required",
    PASSWORD_REQUIRED: "Password is required",
    AGE_REQUIRED: "Age is required",
    AGE_RANGE: "Age must be between 10 and 30",
    MOBILE_INVALID: "Mobile must be a valid 10-digit number",
    DISTRICT_REQUIRED: "District is required",
    STATE_REQUIRED: "State is required",
    ROLE_INVALID: "Invalid role selected",
  } as const;
}

// Export for backward compatibility
export const AUTH_MESSAGES = Messages.AUTH;
export const REGISTRATION_MESSAGES = Messages.REGISTRATION;
export const UPLOAD_MESSAGES = Messages.UPLOAD;
export const USER_MESSAGES = Messages.USER;
export const ERROR_MESSAGES = Messages.ERROR;
export const SERVER_MESSAGES = Messages.SERVER;
export const VALIDATION_MESSAGES = Messages.VALIDATION;
