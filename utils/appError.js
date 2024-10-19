// utils/AppError.js
class AppError extends Error {
  constructor(statusCode, message, errorCode = "UNKNOWN_ERROR", details = null) {
    super(message);
    this.statusCode = statusCode || 500;
    this.errorCode = errorCode; // Custom error code
    this.details = details || "Something went wrong!"; // Optional: can include extra context for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
