import { ApiError } from "../utils/apiResponse.js";

/**
 * Restricts a route to specific roles.
 * Usage: router.get("/admin-only", verifyToken, requireRole("admin"), handler)
 * Must run AFTER verifyToken, since it relies on req.user.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }

    next();
  };
};

export default requireRole;