import supabase from "../config/supabase.js";
import { ApiError } from "../utils/apiResponse.js";

/**
 * Creates a new user row.
 * password should already be hashed before calling this.
 */
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
    .select("id, name, email, phone, role, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      // Postgres unique violation
      throw new ApiError(409, "An account with this email already exists");
    }
    throw new ApiError(500, `Failed to create user: ${error.message}`);
  }

  return data;
};

/**
 * Finds a user by email. Returns the full row (including password_hash)
 * because this is used internally for login verification.
 * NEVER return password_hash directly to the client from a controller.
 */
const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Failed to look up user: ${error.message}`);
  }

  return data; // null if not found
};

/**
 * Finds a user by id. Excludes password_hash — safe to return to client.
 */
const findUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Failed to look up user: ${error.message}`);
  }

  return data;
};

export { createUser, findUserByEmail, findUserById };