import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "dist", "build"].includes(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function parseEnvLine(line) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) return null;

  const index = trimmed.indexOf("=");

  if (index === -1) return null;

  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (!key) return null;

  return [key, value];
}

function loadEnvFile(fileName) {
  const filePath = path.join(root, fileName);

  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);

    if (!parsed) continue;

    const [key, value] = parsed;

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

/**
 * Local audit should behave like Next.js:
 * load .env files for validation, but never print secret values.
 */
loadEnvFile(".env");
loadEnvFile(".env.local");
loadEnvFile(".env.production");

const apiPages = walk(path.join(root, "app", "api")).filter((file) =>
  file.endsWith(`${path.sep}page.tsx`),
);

if (apiPages.length > 0) {
  fail(`page.tsx found inside app/api:\n${apiPages.join("\n")}`);
}

const apiClientFiles = walk(path.join(root, "app", "api")).filter((file) => {
  const base = path.basename(file);

  return (
    /\.(tsx|jsx)$/.test(file) &&
    base !== "route.tsx" &&
    base !== "route.jsx"
  );
});

if (apiClientFiles.length > 0) {
  fail(`Client/UI files found inside app/api:\n${apiClientFiles.join("\n")}`);
}

function requireAny(label, keys) {
  const found = keys.some((key) => Boolean(process.env[key]));

  if (!found) {
    fail(`Missing environment variable: ${label} (${keys.join(" or ")})`);
  }
}

function requireOne(key) {
  if (!process.env[key]) {
    fail(`Missing environment variable: ${key}`);
  }
}

requireOne("DATABASE_URL");
requireOne("DIRECT_URL");
requireAny("AUTH_SECRET", ["AUTH_SECRET", "NEXTAUTH_SECRET"]);
requireAny("APP_URL", ["NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL"]);
requireOne("GOOGLE_CLIENT_ID");
requireOne("GOOGLE_CLIENT_SECRET");
requireOne("SUPABASE_URL");
requireOne("SUPABASE_SERVICE_ROLE_KEY");

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

const databaseUrl = process.env.DATABASE_URL || "";
const directUrl = process.env.DIRECT_URL || "";
const supabaseUrl = process.env.SUPABASE_URL || "";

if (databaseUrl.startsWith("https://") || databaseUrl.includes("/rest/v1")) {
  fail("DATABASE_URL must be a PostgreSQL connection string, not a Supabase REST/API URL.");
}

if (directUrl.startsWith("https://") || directUrl.includes("/rest/v1")) {
  fail("DIRECT_URL must be a direct PostgreSQL connection string, not a Supabase REST/API URL.");
}

if (databaseUrl && !databaseUrl.includes("pgbouncer=true")) {
  warn("DATABASE_URL should use the pooler URL with pgbouncer=true for serverless hosting.");
}

if (databaseUrl && !databaseUrl.includes("connection_limit=")) {
  warn("DATABASE_URL should include connection_limit=1 or connection_limit=2 to avoid pool exhaustion on hosting.");
}

const parsedSupabaseUrl = safeUrl(supabaseUrl);

if (supabaseUrl && (!parsedSupabaseUrl || parsedSupabaseUrl.protocol !== "https:")) {
  fail("SUPABASE_URL must be an HTTPS Project API URL like https://xxxx.supabase.co.");
}

if (supabaseUrl && (supabaseUrl.includes("/rest/v1") || supabaseUrl.includes(":5432") || supabaseUrl.includes(":6543") || supabaseUrl.includes("pooler") || supabaseUrl.includes("postgres"))) {
  fail("SUPABASE_URL must be the Project API URL only. Do not paste database, pooler, or /rest/v1 URLs here.");
}

for (const key of ["NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL"]) {
  if (process.env[key] && !safeUrl(process.env[key])) {
    fail(`${key} must be a valid absolute URL.`);
  }
}

for (const key of Object.keys(process.env)) {
  if (
    key.startsWith("NEXT_PUBLIC_") &&
    (key.includes("SECRET") ||
      key.includes("SERVICE_ROLE") ||
      key.includes("PRIVATE") ||
      key.includes("TOKEN"))
  ) {
    fail(`Secret-like variable is public: ${key}`);
  }
}

const gitignorePath = path.join(root, ".gitignore");
const gitignore = fs.existsSync(gitignorePath)
  ? fs.readFileSync(gitignorePath, "utf8")
  : "";

const gitignoreChecks = [".env", ".env.local", ".env.production"];

for (const item of gitignoreChecks) {
  if (!gitignore.includes(item)) {
    fail(`.gitignore must include ${item}`);
  }
}

const localEnvFiles = [".env", ".env.local", ".env.production"].filter((file) =>
  fs.existsSync(path.join(root, file)),
);

if (localEnvFiles.length > 0) {
  warn(
    `Local env file found: ${localEnvFiles.join(
      ", ",
    )}. This is OK locally, but never upload/commit these files.`,
  );
}

if (failures.length > 0) {
  console.error("\nHOSTING AUDIT FAILED\n");

  for (const item of failures) {
    console.error(`- ${item}`);
  }

  if (warnings.length > 0) {
    console.warn("\nWarnings\n");

    for (const item of warnings) {
      console.warn(`- ${item}`);
    }
  }

  process.exit(1);
}

console.log("\nHOSTING AUDIT PASSED\n");

if (warnings.length > 0) {
  console.warn("Warnings\n");

  for (const item of warnings) {
    console.warn(`- ${item}`);
  }
}
