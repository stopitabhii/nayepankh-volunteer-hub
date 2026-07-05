import express from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

export default router;