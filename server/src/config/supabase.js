import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file."
  );
}

/**
 * Server-side Supabase client using the SERVICE ROLE key.
 * This bypasses Row Level Security — appropriate here because
 * our Express layer handles authentication/authorization itself.
 * NEVER import this client or the service role key into frontend code.
 */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export default supabase;