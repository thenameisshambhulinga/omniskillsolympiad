import fs from "node:fs";
import { execSync } from "node:child_process";

const status = execSync("git status --porcelain", {
  encoding: "utf8",
});

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

const forbiddenFiles = [
  "build-error.log",
  "typecheck-error.log",
];

for (const file of forbiddenFiles) {
  if (fs.existsSync(file)) {
    console.error(`❌ Temporary log should not be committed: ${file}`);
    process.exit(1);
  }
}

const forbiddenDirs = [
  ".rescue",
];

for (const dir of forbiddenDirs) {
  if (fs.existsSync(dir)) {
    console.error(`❌ Temporary rescue folder should not remain: ${dir}`);
    process.exit(1);
  }
}

console.log("GIT SAFETY AUDIT PASSED");
