import jwt from "jsonwebtoken";

/**
 * Signs a JWT containing the user's id and role.
 * Role is embedded so role.middleware.js can authorize without
 * an extra DB lookup on every request.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export default generateToken;