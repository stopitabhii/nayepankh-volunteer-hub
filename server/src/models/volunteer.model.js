import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

const createVolunteerProfile = async (userId) => {
  const { data, error } = await supabase
    .from("volunteers")
    .insert({ user_id: userId })
    .select("id, user_id, status, total_hours, created_at")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to create volunteer profile: ${error.message}`);
  }

  return data;
};

const findVolunteerByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Failed to look up volunteer profile: ${error.message}`);
  }

  return data;
};

const updateVolunteerProfile = async (userId, { bio, skills, availability }) => {
  const updates = {};
  if (bio !== undefined) updates.bio = bio;
  if (skills !== undefined) updates.skills = skills;
  if (availability !== undefined) updates.availability = availability;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided to update");
  }

  const { data, error } = await supabase
    .from("volunteers")
    .update(updates)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to update volunteer profile: ${error.message}`);
  }

  return data;
};

/** Sets or clears (pass null) the volunteer's ID card file path. */
const updateIdCardUrl = async (userId, idCardPath) => {
  const { data, error } = await supabase
    .from("volunteers")
    .update({ id_card_url: idCardPath })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to save ID card: ${error.message}`);
  }

  return data;
};

/** Sets or clears (pass null) the volunteer's supporting document file path. */
const updateDocumentUrl = async (userId, documentPath) => {
  const { data, error } = await supabase
    .from("volunteers")
    .update({ document_url: documentPath })
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to save document: ${error.message}`);
  }

  return data;
};

export {
  createVolunteerProfile,
  findVolunteerByUserId,
  updateVolunteerProfile,
  updateIdCardUrl,
  updateDocumentUrl,
};