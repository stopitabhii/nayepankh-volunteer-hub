import express from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  uploadIdCard,
  removeIdCard,
  uploadDocument,
  removeDocument,
} from "../controllers/volunteer.controller.js";
import { updateProfileValidator } from "../validators/volunteer.validator.js";
import validate from "../middleware/validate.middleware.js";
import verifyToken from "../middleware/auth.middleware.js";
import { imageUpload, documentUpload, idCardUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getProfile);
router.patch("/profile", updateProfileValidator, validate, updateProfile);

router.post("/avatar", imageUpload.single("avatar"), uploadAvatar);
router.delete("/avatar", removeAvatar);

router.post("/id-card", idCardUpload.single("idCard"), uploadIdCard);
router.delete("/id-card", removeIdCard);

router.post("/document", documentUpload.single("document"), uploadDocument);
router.delete("/document", removeDocument);

export default router;