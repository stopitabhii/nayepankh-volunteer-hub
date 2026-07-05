import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

/**
 * Creates the linked volunteer profile row for a newly registered user.
 * Called immediately after createUser() during registration.
 */
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

/**
 * Finds a volunteer profile by the linked user_id.
 */
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

export { createVolunteerProfile, findVolunteerByUserId };