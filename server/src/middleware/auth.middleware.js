import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiResponse.js";
import { findUserById } from "../models/user.model.js";

/**
 * Verifies the JWT from either the httpOnly cookie or Authorization header.
 * On success, attaches the full user object (minus password_hash) to req.user.
 */
const verifyToken = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await findUserById(decoded.id);
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});

export default verifyToken;