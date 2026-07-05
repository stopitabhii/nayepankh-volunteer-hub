import supabase from "./supabase.js";

/**
 * Verifies the backend can reach Supabase Postgres before the server
 * starts accepting requests. Fails fast if credentials or network are bad.
 */
const connectDB = async () => {
  try {
    const { error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      throw new Error(error.message);
    }

    console.log("✅ Supabase connection verified");
  } catch (error) {
    console.error(`❌ Failed to connect to Supabase: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;