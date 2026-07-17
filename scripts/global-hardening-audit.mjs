import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const apiRoot = path.join(root, "app", "api");
const mutationPattern = /export\s+(?:async\s+function|const)\s+(POST|PUT|PATCH|DELETE)\b/g;
const activeAuth = /(requireApiUser|requireApiAdmin|requireApiOnboardedUser|requireAdmin|getServerSession)/;
const mutationGuard = /(guardMutationRequest|rejectCrossSiteMutation)/;
const boundedBody = /(readJsonObjectWithLimit|request\.formData\(\)|ROUTE_DISABLED|inactive|disabled)/;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const failures = [];
const warnings = [];
const rows = [];
for (const file of walk(apiRoot).filter((item) => item.endsWith("route.ts"))) {
  const source = fs.readFileSync(file, "utf8");
  const methods = [...source.matchAll(mutationPattern)].map((match) => match[1]);
  if (methods.length === 0) continue;

  const relative = path.relative(root, file).replaceAll("\\", "/");
  const disabled = /ROUTE_DISABLED|This route is inactive|duplicate route is disabled/.test(source);
  const auth = activeAuth.test(source);
  const guard = mutationGuard.test(source);
  const body = boundedBody.test(source);

  rows.push({ route: relative, methods, disabled, auth, guard, boundedBody: body });
  if (!disabled && !auth) failures.push(`${relative}: missing authentication/authorization`);
  if (!disabled && !guard) failures.push(`${relative}: missing mutation origin/rate/size guard`);
  if (!disabled && methods.some((method) => method !== "DELETE") && !body) warnings.push(`${relative}: body parsing still relies on declared Content-Length; migrate to readJsonObjectWithLimit`);
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), mutationRoutes: rows.length, routes: rows, warnings, failures }, null, 2));
if (failures.length > 0) process.exit(1);
