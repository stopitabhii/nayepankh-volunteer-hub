import { randomUUID } from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import {
  findVolunteerByUserId,
  updateVolunteerProfile,
  updateIdCardUrl,
  updateDocumentUrl,
} from "../models/volunteer.model.js";
import { updateAvatarUrl } from "../models/user.model.js";
import { uploadFile, getPublicUrl, getSignedUrl, deleteFile } from "../services/storage.service.js";

/**
 * @route   GET /api/volunteers/profile
 * @access  Private
 * Private-bucket files (id card, document) are returned as fresh,
 * short-lived signed URLs — never as permanent links.
 */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await findVolunteerByUserId(req.user.id);
  if (!profile) throw new ApiError(404, "Volunteer profile not found");

  const idCardSignedUrl = profile.id_card_url
    ? await getSignedUrl("id-cards", profile.id_card_url)
    : null;

  const documentSignedUrl = profile.document_url
    ? await getSignedUrl("documents", profile.document_url)
    : null;

  res.status(200).json(
    new ApiResponse(
      200,
      { user: req.user, profile: { ...profile, id_card_signed_url: idCardSignedUrl, document_signed_url: documentSignedUrl } },
      "Profile fetched"
    )
  );
});

/**
 * @route   PATCH /api/volunteers/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { bio, skills, availability } = req.body;
  const updatedProfile = await updateVolunteerProfile(req.user.id, { bio, skills, availability });
  res.status(200).json(new ApiResponse(200, updatedProfile, "Profile updated successfully"));
});

/**
 * @route   POST /api/volunteers/avatar
 * @access  Private
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded. Attach a file under 'avatar'");

  const path = `${req.user.id}/${randomUUID()}-${req.file.originalname}`;
  await uploadFile({ bucket: "avatars", path, buffer: req.file.buffer, contentType: req.file.mimetype });
  const publicUrl = getPublicUrl("avatars", path);

  const updatedUser = await updateAvatarUrl(req.user.id, publicUrl);
  res.status(200).json(new ApiResponse(200, updatedUser, "Avatar uploaded successfully"));
});

/**
 * @route   DELETE /api/volunteers/avatar
 * @access  Private
 */
const removeAvatar = asyncHandler(async (req, res) => {
  const updatedUser = await updateAvatarUrl(req.user.id, null);
  res.status(200).json(new ApiResponse(200, updatedUser, "Avatar removed"));
});

/**
 * @route   POST /api/volunteers/id-card
 * @access  Private
 */
const uploadIdCard = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded. Attach a file under 'idCard'");

  const path = `${req.user.id}/${randomUUID()}-${req.file.originalname}`;
  await uploadFile({ bucket: "id-cards", path, buffer: req.file.buffer, contentType: req.file.mimetype });

  const updatedProfile = await updateIdCardUrl(req.user.id, path);
  res.status(200).json(new ApiResponse(200, updatedProfile, "ID card uploaded successfully"));
});

/**
 * @route   DELETE /api/volunteers/id-card
 * @access  Private
 */
const removeIdCard = asyncHandler(async (req, res) => {
  const profile = await findVolunteerByUserId(req.user.id);
  if (profile?.id_card_url) {
    await deleteFile("id-cards", profile.id_card_url);
  }
  const updatedProfile = await updateIdCardUrl(req.user.id, null);
  res.status(200).json(new ApiResponse(200, updatedProfile, "ID card removed"));
});

/**
 * @route   POST /api/volunteers/document
 * @access  Private
 */
const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded. Attach a file under 'document'");

  const path = `${req.user.id}/${randomUUID()}-${req.file.originalname}`;
  await uploadFile({ bucket: "documents", path, buffer: req.file.buffer, contentType: req.file.mimetype });

  const updatedProfile = await updateDocumentUrl(req.user.id, path);
  res.status(200).json(new ApiResponse(200, updatedProfile, "Document uploaded successfully"));
});

/**
 * @route   DELETE /api/volunteers/document
 * @access  Private
 */
const removeDocument = asyncHandler(async (req, res) => {
  const profile = await findVolunteerByUserId(req.user.id);
  if (profile?.document_url) {
    await deleteFile("documents", profile.document_url);
  }
  const updatedProfile = await updateDocumentUrl(req.user.id, null);
  res.status(200).json(new ApiResponse(200, updatedProfile, "Document removed"));
});

export {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  uploadIdCard,
  removeIdCard,
  uploadDocument,
  removeDocument,
};