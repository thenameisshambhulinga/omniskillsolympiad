import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const require = createRequire(import.meta.url);

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const prismaArguments = process.argv.slice(2);

if (prismaArguments.length === 0) {
  console.error("Usage: node scripts/run-prisma-with-env.mjs <prisma command>");
  process.exit(1);
}

const command = prismaArguments[0];
const schemaOnlyCommands = new Set(["format", "generate", "validate"]);
const placeholderUrl =
  "postgresql://prisma:prisma@127.0.0.1:5432/prisma?schema=public";

if (schemaOnlyCommands.has(command)) {
  process.env.DATABASE_URL ||= placeholderUrl;
  process.env.DIRECT_URL ||= placeholderUrl;
} else {
  const missingDatabaseKeys = ["DATABASE_URL", "DIRECT_URL"].filter(
    (key) => !process.env[key]?.trim(),
  );

  if (missingDatabaseKeys.length > 0) {
    console.error(
      `Missing Prisma environment variable(s): ${missingDatabaseKeys.join(", ")}`,
    );
    process.exit(1);
  }
}

const prismaPackageJson = require.resolve("prisma/package.json");
const prismaCliPath = path.join(
  path.dirname(prismaPackageJson),
  "build",
  "index.js",
);

const result = spawnSync(process.execPath, [prismaCliPath, ...prismaArguments], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  windowsHide: true,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(typeof result.status === "number" ? result.status : 1);
