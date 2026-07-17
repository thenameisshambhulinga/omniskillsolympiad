import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packageJson = JSON.parse(read("package.json"));
const dependencies = packageJson.dependencies ?? {};
const authSource = read("lib/auth.ts");
const authRoute = read("app/api/auth/[...nextauth]/route.ts");
const prismaRunner = read("scripts/run-prisma-with-env.mjs");

if (dependencies["@auth/core"]) failures.push("Remove direct @auth/core dependency.");
if (dependencies["@auth/prisma-adapter"]) failures.push("Remove v5 @auth/prisma-adapter from NextAuth v4.");
if (dependencies["@next-auth/prisma-adapter"] !== "1.0.7") {
  failures.push("Pin @next-auth/prisma-adapter to 1.0.7.");
}
if (dependencies["next-auth"] !== "4.24.14") {
  failures.push("Pin next-auth to 4.24.14 for deterministic Phase 1 behavior.");
}
if (!authSource.includes('from "@next-auth/prisma-adapter"')) {
  failures.push("lib/auth.ts must use the NextAuth v4 Prisma adapter.");
}
if (authSource.includes("as unknown as Adapter")) {
  failures.push("Unsafe adapter type cast remains.");
}
if (!authSource.includes("email_verified")) {
  failures.push("Google verified-email enforcement is missing.");
}
if (!authSource.includes("ROLE_REFRESH_INTERVAL_MS")) {
  failures.push("Database-backed role refresh is missing.");
}
if (!authRoute.includes('runtime = "nodejs"')) {
  failures.push("Auth route must use the Node.js runtime.");
}
if (!authRoute.includes("handler as GET") || !authRoute.includes("handler as POST")) {
  failures.push("Auth route must export GET and POST handlers.");
}
if (!prismaRunner.includes("schemaOnlyCommands")) {
  failures.push("Prisma schema-only commands are not decoupled from live credentials.");
}
if (fs.existsSync(path.join(root, "types/prisma-client-default.d.ts"))) {
  failures.push("Obsolete Prisma v7 declaration shim still exists.");
}

if (failures.length > 0) {
  console.error("AUTH CONFIG SMOKE TEST FAILED\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("AUTH CONFIG SMOKE TEST PASSED");
