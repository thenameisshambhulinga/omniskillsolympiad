import fs from "node:fs";
import { execSync } from "node:child_process";

const checks = [
  {
    file: "lib/server/runtime-response.ts",
    mustContain: [
      "runtimeSuccess",
      "runtimeError",
      "runtimeUnauthorized",
      "runtimeForbidden",
      "runtimeBadRequest",
      "X-Content-Type-Options",
      "no-store",
    ],
  },
  {
    file: "lib/server/runtime-env.ts",
    mustContain: [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "getRuntimeEnvReport",
      "missingRequired",
    ],
    mustNotContain: [
      "process.env.DATABASE_URL!",
      "process.env.NEXTAUTH_SECRET!",
    ],
  },
  {
    file: "app/api/health/runtime/route.ts",
    mustContain: [
      'runtime = "nodejs"',
      'dynamic = "force-dynamic"',
      "revalidate = 0",
      "getRuntimeEnvReport",
      "prisma.$queryRaw",
      "runtimeSuccess",
      "runtimeError",
    ],
    mustNotContain: [
      "DATABASE_URL:",
      "NEXTAUTH_SECRET:",
      "SUPABASE_SERVICE_ROLE_KEY:",
    ],
  },
];

const status = execSync("git status --porcelain", { encoding: "utf8" });
const conflictLines = status
  .split("\n")
  .filter(Boolean)
  .filter((line) =>
    ["UU", "AA", "DD", "UD", "DU", "AU", "UA"].includes(line.slice(0, 2)),
  );

if (conflictLines.length > 0) {
  console.error("❌ Git conflict state detected:");
  console.error(conflictLines.join("\n"));
  process.exit(1);
}

let failed = false;

for (const check of checks) {
  if (!fs.existsSync(check.file)) {
    console.error(`❌ Missing runtime hardening file: ${check.file}`);
    failed = true;
    continue;
  }

  const text = fs.readFileSync(check.file, "utf8");

  for (const needle of check.mustContain ?? []) {
    if (!text.includes(needle)) {
      console.error(`❌ ${check.file} must contain: ${needle}`);
      failed = true;
    }
  }

  for (const forbidden of check.mustNotContain ?? []) {
    if (text.includes(forbidden)) {
      console.error(`❌ ${check.file} must NOT contain: ${forbidden}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nRUNTIME HARDENING AUDIT FAILED");
  process.exit(1);
}

console.log("RUNTIME HARDENING AUDIT PASSED");
