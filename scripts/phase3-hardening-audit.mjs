import fs from "node:fs";

const checks = [
  ["lib/security/request-guard.ts", ["readJsonObjectWithLimit", "ORIGIN_REQUIRED", "X-Request-Id"]],
  ["app/api/admin/announcement-posters/route.ts", ["rejectCrossSiteMutation", "take: 100", "readJsonObjectWithLimit"]],
  ["app/api/admin/announcement-posters/[posterId]/route.ts", ["admin-posters-delete", "enforceJsonContentType"]],
  ["prisma/migrations/20260717000100_announcement_poster_schema_repair/migration.sql", ["ADD COLUMN IF NOT EXISTS \"slug\"", "CREATE UNIQUE INDEX IF NOT EXISTS"]],
];

const failures = [];
for (const [file, needles] of checks) {
  if (!fs.existsSync(file)) {
    failures.push(`${file}: missing`);
    continue;
  }
  const text = fs.readFileSync(file, "utf8");
  for (const needle of needles) if (!text.includes(needle)) failures.push(`${file}: missing ${needle}`);
}

if (failures.length) {
  console.error("PHASE 3 HARDENING AUDIT FAILED");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("PHASE 3 HARDENING AUDIT PASSED");
