import process from "node:process";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const failures = [];
const warnings = [];

function value(name) {
  return process.env[name]?.trim() ?? "";
}

function requireValue(name) {
  const current = value(name);
  if (!current) failures.push(`Missing ${name}.`);
  return current;
}

function parseUrl(name, raw, protocols) {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (!protocols.includes(parsed.protocol)) {
      failures.push(`${name} must use ${protocols.join(" or ")}.`);
    }
    if (parsed.username && !parsed.password) {
      warnings.push(`${name} contains a username but no password.`);
    }
    return parsed;
  } catch {
    failures.push(`${name} is not a valid URL.`);
    return null;
  }
}

const databaseUrl = requireValue("DATABASE_URL");
const directUrl = requireValue("DIRECT_URL");
const nextAuthUrl = requireValue("NEXTAUTH_URL");
const nextAuthSecret = value("NEXTAUTH_SECRET");
const legacySecret = value("AUTH_SECRET");
const googleClientId = requireValue("GOOGLE_CLIENT_ID");
const googleClientSecret = requireValue("GOOGLE_CLIENT_SECRET");

if (!nextAuthSecret && !legacySecret) {
  failures.push("Missing NEXTAUTH_SECRET.");
}

if (nextAuthSecret && nextAuthSecret.length < 32) {
  failures.push("NEXTAUTH_SECRET must contain at least 32 characters.");
}

if (!nextAuthSecret && legacySecret) {
  warnings.push(
    "AUTH_SECRET is being used only for compatibility. Copy the same value to NEXTAUTH_SECRET.",
  );
}

if (nextAuthSecret && legacySecret && nextAuthSecret !== legacySecret) {
  failures.push("NEXTAUTH_SECRET and AUTH_SECRET do not match.");
}

const database = parseUrl("DATABASE_URL", databaseUrl, ["postgresql:", "postgres:"]);
const direct = parseUrl("DIRECT_URL", directUrl, ["postgresql:", "postgres:"]);
const application = parseUrl("NEXTAUTH_URL", nextAuthUrl, ["http:", "https:"]);
const publicApplication = value("NEXT_PUBLIC_APP_URL")
  ? parseUrl("NEXT_PUBLIC_APP_URL", value("NEXT_PUBLIC_APP_URL"), ["http:", "https:"])
  : null;

if (application) {
  if (application.pathname !== "/" || application.search || application.hash) {
    failures.push("NEXTAUTH_URL must contain only the application origin.");
  }

  if (process.env.NODE_ENV === "production" && application.protocol !== "https:") {
    failures.push("NEXTAUTH_URL must use HTTPS in production.");
  }
}

if (application && publicApplication && application.origin !== publicApplication.origin) {
  failures.push("NEXT_PUBLIC_APP_URL and NEXTAUTH_URL must use the same origin.");
}

if (database && !database.searchParams.has("connection_limit")) {
  warnings.push("DATABASE_URL has no connection_limit; verify pool sizing for your host.");
}

if (database && !database.searchParams.has("pool_timeout")) {
  warnings.push("DATABASE_URL has no pool_timeout; define a bounded wait time.");
}

if (direct?.searchParams.get("pgbouncer") === "true") {
  failures.push("DIRECT_URL must be a direct database connection, not PgBouncer.");
}

if (googleClientId && !googleClientId.endsWith(".apps.googleusercontent.com")) {
  failures.push("GOOGLE_CLIENT_ID is not a Google OAuth web client ID.");
}

if (googleClientSecret && googleClientSecret.length < 16) {
  failures.push("GOOGLE_CLIENT_SECRET appears incomplete.");
}

const report = {
  ready: failures.length === 0,
  environment: process.env.NODE_ENV ?? "development",
  checks: {
    databaseUrl: Boolean(database),
    directUrl: Boolean(direct),
    nextAuthUrl: Boolean(application),
    nextAuthSecret: Boolean(nextAuthSecret || legacySecret),
    googleOAuth: Boolean(googleClientId && googleClientSecret),
  },
  expectedGoogleCallback: application
    ? `${application.origin}/api/auth/callback/google`
    : null,
  warnings,
  failures,
};

console.log(JSON.stringify(report, null, 2));
process.exit(report.ready ? 0 : 1);
