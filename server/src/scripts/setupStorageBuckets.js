import "dotenv/config";
import supabase from "../config/supabase.js";

const buckets = [
  { id: "avatars", public: true },
  { id: "id-cards", public: false },
  { id: "event-images", public: true },
  { id: "documents", public: false },
];

const run = async () => {
  for (const bucket of buckets) {
    const { error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: "10MB",
    });

    if (error && !error.message.includes("already exists")) {
      console.error(`❌ Failed to create bucket "${bucket.id}": ${error.message}`);
    } else {
      console.log(`✅ Bucket ready: ${bucket.id} (${bucket.public ? "public" : "private"})`);
    }
  }

  process.exit(0);
};

run();