/**
 * Standardized success response shape used across all controllers.
 * Keeping this consistent means the frontend can rely on one response contract.
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
      this.statusCode = statusCode;
      this.success = statusCode < 400;
      this.message = message;
      this.data = data;
    }
  }
  
  /**
   * Standardized error shape, thrown from controllers/services and
   * caught by the centralized error middleware.
   */
  class ApiError extends Error {
    constructor(statusCode, message = "Something went wrong", errors = []) {
      super(message);
      this.statusCode = statusCode;
      this.success = false;
      this.errors = errors;
      this.data = null;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export { ApiResponse, ApiError };