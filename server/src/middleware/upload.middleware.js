import multer from "multer";
import { ApiError } from "../utils/apiResponse.js";

const storage = multer.memoryStorage();

const createUploader = (allowedTypes, maxSizeMB = 5) => {
  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new ApiError(400, `Invalid file type. Allowed: ${allowedTypes.join(", ")}`),
          false
        );
      }
      cb(null, true);
    },
  });
};

const imageUpload = createUploader(["image/jpeg", "image/png", "image/webp"]);
const documentUpload = createUploader(["application/pdf"], 10);
const idCardUpload = createUploader(
  ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  10
);

export { imageUpload, documentUpload, idCardUpload };