import express from "express";
import { uploadEventImage } from "../controllers/event.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import requireRole from "../middleware/role.middleware.js";
import { imageUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/:id/image", verifyToken, requireRole("admin"), imageUpload.single("image"), uploadEventImage);

export default router;