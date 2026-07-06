import dns from "node:dns/promises";
import net from "node:net";
import process from "node:process";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
import { PrismaClient } from "@prisma/client";

loadEnvConfig(
  process.cwd(),
  process.env.NODE_ENV !== "production",
);

const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_POSTER_BUCKET",
];

const missing = required.filter((key) => !process.env[key]);

const hasSupabaseUrl = Boolean(
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

const hasGoogleCredentials = Boolean(
  (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
  ) ||
  (
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET
  ),
);

const hasAuthSecret = Boolean(
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET,
);

if (!hasSupabaseUrl) {
  missing.push("SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL");
}

if (!hasGoogleCredentials) {
  missing.push(
    "Google OAuth client ID and secret",
  );
}

if (!hasAuthSecret) {
  missing.push("AUTH_SECRET or NEXTAUTH_SECRET");
}

if (missing.length > 0) {
  console.error("Environment validation failed.");
  console.error("Missing runtime variables:");

  for (const key of missing) {
    console.error(`  - ${key}`);
  }

  process.exit(1);
}

function safeDatabaseDetails(value) {
  const parsed = new URL(value);

  return {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    port:
      Number(parsed.port) ||
      (parsed.protocol === "postgresql:" ? 5432 : 5432),
    database: parsed.pathname.replace(/^\//, ""),
    usernamePresent: Boolean(parsed.username),
    passwordPresent: Boolean(parsed.password),
  };
}

function tcpCheck(host, port, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port });

    const cleanup = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.setTimeout(timeoutMs);

    socket.once("connect", () => {
      cleanup();
      resolve();
    });

    socket.once("timeout", () => {
      cleanup();
      reject(new Error(`TCP timeout after ${timeoutMs}ms`));
    });

    socket.once("error", (error) => {
      cleanup();
      reject(error);
    });
  });
}

const database = safeDatabaseDetails(process.env.DATABASE_URL);
const direct = safeDatabaseDetails(process.env.DIRECT_URL);

console.log("Effective Next.js runtime environment:");
console.log({
  database: {
    hostname: database.hostname,
    port: database.port,
    database: database.database,
    usernamePresent: database.usernamePresent,
    passwordPresent: database.passwordPresent,
  },
  directDatabase: {
    hostname: direct.hostname,
    port: direct.port,
    database: direct.database,
    usernamePresent: direct.usernamePresent,
    passwordPresent: direct.passwordPresent,
  },
  googleCredentialsPresent: hasGoogleCredentials,
  authSecretPresent: hasAuthSecret,
  supabaseUrlPresent: hasSupabaseUrl,
  serviceRoleKeyPresent: true,
  posterBucketPresent: true,
});

try {
  const addresses = await dns.lookup(database.hostname, { all: true });

  console.log(
    `PASS: DNS resolved ${database.hostname} to ` +
      `${addresses.length} address(es).`,
  );
} catch (error) {
  console.error(
    `FAIL: DNS could not resolve ${database.hostname}.`,
  );
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
}

try {
  await tcpCheck(database.hostname, database.port);

  console.log(
    `PASS: TCP connection reached ` +
      `${database.hostname}:${database.port}.`,
  );
} catch (error) {
  console.error(
    `FAIL: Cannot reach ${database.hostname}:${database.port}.`,
  );
  console.error(error instanceof Error ? error.message : error);
  console.error(
    "The environment is loaded correctly, but the Supabase host " +
      "is unavailable, paused, blocked, or no longer current.",
  );
  process.exit(3);
}

const prisma = new PrismaClient({
  log: ["error"],
});

try {
  await prisma.$queryRawUnsafe("SELECT 1");

  console.log("PASS: Prisma successfully queried the database.");
} catch (error) {
  console.error("FAIL: Prisma could not query the database.");

  if (error && typeof error === "object" && "code" in error) {
    console.error(`Prisma code: ${String(error.code)}`);
  }

  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 4;
} finally {
  await prisma.$disconnect();
}
