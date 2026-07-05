import { ApiError } from "../utils/apiResponse.js";

/**
 * Centralized error-handling middleware.
 * Must be registered LAST in app.js, after all routes.
 *
 * Handles:
 *  - Custom ApiError instances (thrown deliberately in controllers)
 *  - Mongoose validation errors
 *  - Mongoose duplicate key errors (e.g. email already exists)
 *  - JWT errors
 *  - Any unexpected/unhandled errors (falls back to 500)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => val.message);
    message = "Validation failed";
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with this ${field} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again";
  }

  if (process.env.NODE_ENV === "development" && !(err instanceof ApiError)) {
    console.error("🔥 Unhandled Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Catches requests to undefined routes (404).
 * Registered right before errorHandler in app.js.
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};

export { errorHandler, notFound };