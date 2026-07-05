import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiResponse.js";

/**
 * Runs after validator chains (e.g. registerValidator) have executed.
 * If any validation rule failed, collects all error messages and
 * throws a single ApiError — keeping controllers free of validation logic.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return next(new ApiError(400, "Validation failed", messages));
  }

  next();
};

export default validate;