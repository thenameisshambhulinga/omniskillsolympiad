import fs from "node:fs";
import dns from "node:dns/promises";
import { createClient } from "@supabase/supabase-js";

function loadEnv(fileName) {
  if (!fs.existsSync(fileName)) return;

  const content = fs.readFileSync(fileName, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#") || !clean.includes("=")) continue;

    const [key, ...rest] = clean.split("=");

    if (!process.env[key]) {
      process.env[key] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

loadEnv(".env");
loadEnv(".env.local");

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BUCKET = process.env.SUPABASE_POSTER_BUCKET || "announcement-posters";

console.log("\nSupabase Storage Diagnostic\n");

if (!SUPABASE_URL) throw new Error("SUPABASE_URL missing in .env");
if (!SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing in .env");

if (!SUPABASE_URL.startsWith("https://") || !SUPABASE_URL.endsWith(".supabase.co")) {
  throw new Error("SUPABASE_URL must look like https://xxxx.supabase.co");
}

const url = new URL(SUPABASE_URL);

console.log("SUPABASE_URL host check:", url.hostname);
console.log("DNS lookup:", url.hostname);

const addresses = await dns.lookup(url.hostname);
console.log("DNS OK:", addresses.address);

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log("Checking bucket:", BUCKET);

const { data: existingBucket, error: bucketReadError } =
  await supabase.storage.getBucket(BUCKET);

if (existingBucket) {
  console.log("Bucket exists:", existingBucket.name);
} else {
  const message = bucketReadError?.message || "";

  if (!message.toLowerCase().includes("not found")) {
    throw new Error(`Bucket check failed: ${message}`);
  }

  console.log("Bucket not found. Creating bucket now...");

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  });

  if (createError) {
    throw new Error(`Bucket create failed: ${createError.message}`);
  }

  console.log("Bucket created:", BUCKET);
}

const pngBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

const testPath = `health-check/${Date.now()}-poster-check.png`;

console.log("Uploading test image...");

const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(testPath, pngBytes, {
    contentType: "image/png",
    cacheControl: "60",
    upsert: false,
  });

if (uploadError) {
  throw new Error(`Upload failed: ${uploadError.message}`);
}

const { data: publicData } = supabase.storage
  .from(BUCKET)
  .getPublicUrl(testPath);

console.log("Upload OK.");
console.log("Public URL OK:", Boolean(publicData.publicUrl));

await supabase.storage.from(BUCKET).remove([testPath]);

console.log("\nPoster storage is ready.\n");
