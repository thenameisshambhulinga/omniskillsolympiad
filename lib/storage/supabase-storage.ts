import { createClient } from "@supabase/supabase-js";

function cleanEnv(value: string | undefined) {
  return (value || "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
}

const SUPABASE_URL = cleanEnv(process.env.SUPABASE_URL);
const SUPABASE_SERVICE_ROLE_KEY = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const POSTER_STORAGE_BUCKET =
  cleanEnv(process.env.SUPABASE_POSTER_BUCKET) || "announcement-posters";

function assertSupabaseUrl() {
  if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL is missing.");
  }

  if (!SUPABASE_URL.startsWith("https://") || !SUPABASE_URL.endsWith(".supabase.co")) {
    throw new Error(
      "SUPABASE_URL must be the Supabase Project API URL like https://xxxx.supabase.co.",
    );
  }

  if (
    SUPABASE_URL.includes("pooler") ||
    SUPABASE_URL.includes("postgres") ||
    SUPABASE_URL.includes(":5432") ||
    SUPABASE_URL.includes(":6543")
  ) {
    throw new Error(
      "SUPABASE_URL is using a database/pooler URL. Use Project Settings → API → Project URL.",
    );
  }
}

export function getSupabaseStorageAdmin() {
  assertSupabaseUrl();

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function ensurePosterBucket() {
  const supabase = getSupabaseStorageAdmin();

  const { data: existingBucket, error: readError } =
    await supabase.storage.getBucket(POSTER_STORAGE_BUCKET);

  if (existingBucket) {
    return supabase;
  }

  if (readError && !readError.message.toLowerCase().includes("not found")) {
    throw new Error(`Supabase bucket check failed: ${readError.message}`);
  }

  const { error } = await supabase.storage.createBucket(POSTER_STORAGE_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
  });

  if (error) {
    throw new Error(`Supabase bucket create failed: ${error.message}`);
  }

  return supabase;
}
