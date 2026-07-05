import { randomUUID } from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { updateEventImage } from "../models/event.model.js";
import { uploadFile, getPublicUrl } from "../services/storage.service.js";

/**
 * @route   POST /api/events/:id/image
 * @access  Private (admin)
 */
const uploadEventImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.file) throw new ApiError(400, "No file uploaded. Attach a file under 'image'");

  const path = `${id}/${randomUUID()}-${req.file.originalname}`;
  await uploadFile({ bucket: "event-images", path, buffer: req.file.buffer, contentType: req.file.mimetype });
  const publicUrl = getPublicUrl("event-images", path);

  const updatedEvent = await updateEventImage(id, publicUrl);
  res.status(200).json(new ApiResponse(200, updatedEvent, "Event image uploaded successfully"));
});

export { uploadEventImage };