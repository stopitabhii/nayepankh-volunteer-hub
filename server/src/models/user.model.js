import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

const createUser = async ({ name, email, passwordHash, phone, role = "volunteer" }) => {
  const { data, error } = await supabase
    .from("users")
    .insert({
      name,
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      phone: phone || null,
      role,
    })
    .select("id, name, email, phone, avatar_url, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ApiError(409, "An account with this email already exists");
    }
    throw new ApiError(500, `Failed to create user: ${error.message}`);
  }

  return data;
};

const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Failed to look up user: ${error.message}`);
  }

  return data;
};

const findUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, avatar_url, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Failed to look up user: ${error.message}`);
  }

  return data;
};

/** Sets or clears (pass null) the user's avatar URL. */
const updateAvatarUrl = async (userId, avatarUrl) => {
  const { data, error } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId)
    .select("id, name, email, phone, avatar_url, role, created_at")
    .single();

  if (error) {
    throw new ApiError(500, `Failed to update avatar: ${error.message}`);
  }

  return data;
};

export { createUser, findUserByEmail, findUserById, updateAvatarUrl };