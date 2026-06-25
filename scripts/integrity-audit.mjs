import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

const ignoredDirs = new Set(["node_modules", ".next", ".git", "dist", "build", ".hardening-backup"]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json"]);

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function read(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function fileExistsForAlias(specifier) {
  const base = path.join(root, specifier.slice(2));
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx"),
    path.join(base, "index.js"),
    path.join(base, "index.jsx"),
    path.join(base, "index.mjs"),
  ];

  return candidates.some((candidate) => fs.existsSync(candidate));
}

const files = walk(root);
const sourceFiles = files.filter((file) => sourceExtensions.has(path.extname(file)));

for (const rel of ["tatus", "tatus --short", "components/admin/xyz", "components/layout/cxx"]) {
  if (fs.existsSync(path.join(root, rel))) {
    fail(`Accidental scratch file should not be deployed: ${rel}`);
  }
}

for (const file of sourceFiles) {
  const content = read(file);
  const relative = path.relative(root, file);

  for (const match of content.matchAll(/(?:import|export)\s+(?:[^'\"]*?\s+from\s+)?[\"']([^\"']+)[\"']|import\([\"']([^\"']+)[\"']\)/g)) {
    const specifier = match[1] || match[2];

    if (specifier?.startsWith("@/") && !fileExistsForAlias(specifier)) {
      fail(`Missing alias import ${specifier} in ${relative}`);
    }
  }

  for (const match of content.matchAll(/["'](\/[^"']+?\.(?:png|jpg|jpeg|webp|svg|gif|avif|mp4))["']/g)) {
    const publicPath = match[1].split("?")[0];
    const actualPath = path.join(root, "public", publicPath.slice(1));

    if (!fs.existsSync(actualPath)) {
      fail(`Missing public asset ${publicPath} referenced in ${relative}`);
    }
  }
}

for (const file of walk(path.join(root, "app"))) {
  if (!file.endsWith("page.tsx") && !file.endsWith("route.ts")) continue;

  const content = read(file);
  const relative = path.relative(root, file);
  const usesDbOrSession =
    content.includes("prisma.") ||
    content.includes("getServerSession") ||
    content.includes("requireAdmin") ||
    content.includes("requireApi") ||
    content.includes("requireUser") ||
    content.includes("requireOnboardedUser");

  if (usesDbOrSession && !content.includes("export const dynamic")) {
    fail(`DB/session-backed route is missing dynamic flag: ${relative}`);
  }

  if (file.endsWith("route.ts") && !content.includes("export const runtime")) {
    fail(`API route is missing runtime declaration: ${relative}`);
  }
}

for (const file of walk(path.join(root, "app", "api", "admin"))) {
  if (!file.endsWith("route.ts")) continue;

  const content = read(file);
  const relative = path.relative(root, file);

  if (content.includes("isAdminEmail")) {
    fail(`Admin API must use DB role checks, not env email-only checks: ${relative}`);
  }
}

const pkg = JSON.parse(read(path.join(root, "package.json")));

if (pkg.scripts?.lint === "next lint") {
  fail("package.json lint script still uses deprecated next lint. Use eslint .");
}

if (!pkg.scripts?.["audit:integrity"]) {
  fail("package.json is missing audit:integrity script.");
}

for (const file of files) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  if (!rel.startsWith("app/") || (!rel.endsWith("page.tsx") && !rel.endsWith("route.ts"))) continue;

  const source = fs.readFileSync(file, "utf8");
  for (const marker of ["export const dynamic", "export const runtime", "export const revalidate"]) {
    const count = (source.match(new RegExp(marker.replaceAll(" ", "\\s+"), "g")) ?? []).length;
    if (count > 1) {
      fail(`${rel} declares ${marker} more than once.`);
    }
  }
}

if (failures.length > 0) {
  console.error("\nINTEGRITY AUDIT FAILED\n");
  for (const item of failures) console.error(`- ${item}`);

  if (warnings.length > 0) {
    console.warn("\nWarnings\n");
    for (const item of warnings) console.warn(`- ${item}`);
  }

  process.exit(1);
}

console.log("\nINTEGRITY AUDIT PASSED\n");

if (warnings.length > 0) {
  console.warn("Warnings\n");
  for (const item of warnings) console.warn(`- ${item}`);
}
