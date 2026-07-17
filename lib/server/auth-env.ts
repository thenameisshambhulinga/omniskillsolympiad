import "server-only";

type AuthRuntimeConfig = {
  appUrl: string;
  googleClientId: string;
  googleClientSecret: string;
  secret: string;
};

let cachedConfig: AuthRuntimeConfig | null = null;

function readNonEmpty(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

function parseApplicationUrl(value: string) {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("NEXTAUTH_URL must be a valid absolute URL.");
  }

  if (parsed.username || parsed.password) {
    throw new Error("NEXTAUTH_URL must not contain embedded credentials.");
  }

  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("NEXTAUTH_URL must contain only the application origin.");
  }

  if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("NEXTAUTH_URL must use HTTPS in production.");
  }

  return parsed.origin;
}

function resolveSecret() {
  const canonical = process.env.NEXTAUTH_SECRET?.trim();
  const legacy = process.env.AUTH_SECRET?.trim();

  if (canonical && legacy && canonical !== legacy) {
    throw new Error(
      "NEXTAUTH_SECRET and AUTH_SECRET are both configured but do not match. " +
        "Keep NEXTAUTH_SECRET as the canonical value before signing in.",
    );
  }

  const secret = canonical || legacy;

  if (!secret) {
    throw new Error("Missing required server environment variable: NEXTAUTH_SECRET");
  }

  if (secret.length < 32) {
    throw new Error("NEXTAUTH_SECRET must contain at least 32 characters.");
  }

  return secret;
}

export function getAuthRuntimeConfig(): AuthRuntimeConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const appUrl = parseApplicationUrl(
    process.env.NEXTAUTH_URL?.trim() ||
      (process.env.NODE_ENV === "production"
        ? readNonEmpty("NEXTAUTH_URL")
        : "http://localhost:3000"),
  );

  const publicAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (publicAppUrl) {
    let publicOrigin: string;

    try {
      publicOrigin = new URL(publicAppUrl).origin;
    } catch {
      throw new Error("NEXT_PUBLIC_APP_URL must be a valid absolute URL.");
    }

    if (publicOrigin !== appUrl) {
      throw new Error(
        "NEXT_PUBLIC_APP_URL and NEXTAUTH_URL must use the same origin.",
      );
    }
  }

  const googleClientId = readNonEmpty("GOOGLE_CLIENT_ID");
  const googleClientSecret = readNonEmpty("GOOGLE_CLIENT_SECRET");

  if (!googleClientId.endsWith(".apps.googleusercontent.com")) {
    throw new Error("GOOGLE_CLIENT_ID is not a valid Google OAuth web client ID.");
  }

  if (googleClientSecret.length < 16) {
    throw new Error("GOOGLE_CLIENT_SECRET appears incomplete.");
  }

  cachedConfig = Object.freeze({
    appUrl,
    googleClientId,
    googleClientSecret,
    secret: resolveSecret(),
  });

  return cachedConfig;
}
