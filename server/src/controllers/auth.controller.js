import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import generateToken from "../utils/generateToken.js";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { createVolunteerProfile } from "../models/volunteer.model.js";

const SALT_ROUNDS = 12;

/**
 * @route   POST /api/auth/register
 * @access  Public
 * Creates a user + linked volunteer profile, returns a JWT.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await createUser({ name, email, passwordHash, phone, role: "volunteer" });
  await createVolunteerProfile(user.id);

  const token = generateToken(user);

  // httpOnly cookie — not readable by client-side JS, mitigates XSS token theft
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res
    .status(201)
    .json(new ApiResponse(201, { user, token }, "Registration successful"));
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user);

  // Strip password_hash before sending user back to client
  const { password_hash, ...safeUser } = user;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { user: safeUser, token }, "Login successful"));
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 * Returns the currently authenticated user (req.user set by verifyToken middleware).
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

export { register, login, logout, getMe };