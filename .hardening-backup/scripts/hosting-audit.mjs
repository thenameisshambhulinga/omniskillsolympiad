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
