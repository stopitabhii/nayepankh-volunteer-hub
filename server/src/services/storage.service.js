import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

/**
 * Uploads a buffer (from multer memoryStorage) to a Supabase Storage bucket.
 * upsert: true allows overwriting if the same path is reused.
 */
const uploadFile = async ({ bucket, path, buffer, contentType }) => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) {
    throw new ApiError(500, `Failed to upload file to ${bucket}: ${error.message}`);
  }

  return path;
};

/** For PUBLIC buckets only — returns a permanent public URL. */
const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/** For PRIVATE buckets — generates a temporary, expiring signed URL. */
const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new ApiError(500, `Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
};

const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new ApiError(500, `Failed to delete file from ${bucket}: ${error.message}`);
  }
};

export { uploadFile, getPublicUrl, getSignedUrl, deleteFile };