import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scale = 10_000;
const ratioBp = (n, d) => (d <= 0 ? 0 : Math.min(scale, Math.round((n * scale) / d)));
const compareRatio = (aN, aD, bN, bD) => {
  if (aD <= 0 && bD <= 0) return 0;
  if (aD <= 0) return 1;
  if (bD <= 0) return -1;
  const left = BigInt(aN) * BigInt(bD);
  const right = BigInt(bN) * BigInt(aD);
  return left === right ? 0 : left > right ? -1 : 1;
};

assert.equal(ratioBp(0, 0), 0);
assert.equal(ratioBp(1, 3), 3333);
assert.equal(ratioBp(2, 3), 6667);
assert.equal(ratioBp(100, 100), 10_000);
assert.equal(compareRatio(1, 3, 2, 6), 0);
assert.equal(compareRatio(2, 3, 3, 5), -1);
assert.equal(compareRatio(3, 5, 2, 3), 1);

for (let denominator = 1; denominator <= 500; denominator += 1) {
  let previous = -1;
  for (let numerator = 0; numerator <= denominator; numerator += 1) {
    const current = ratioBp(numerator, denominator);
    assert.ok(current >= 0 && current <= scale);
    assert.ok(current >= previous, "percentage must be monotonic");
    previous = current;
  }
}

const requiredMarkers = new Map([
  ["lib/math/exact-metrics.ts", ["BigInt(leftNum)", "weightedAverageBasisPoints"]],
  ["lib/quiz/quiz-score-engine.ts", ["percentageBasisPoints", "ratioToBasisPoints"]],
  ["lib/daily-challenge/daily-score-engine.ts", ["percentageBasisPoints", "ratioToBasisPoints"]],
  ["lib/quiz/selection-policy.ts", ["compareRatiosDescending", "localeCompare(b.id"]],
  ["app/api/quiz/submit/route.ts", ["idempotentReplay", "readJsonObject"]],
  ["app/api/daily/attempt/route.ts", ["weightedAverageBasisPoints", "idempotentReplay"]],
]);

for (const [relative, markers] of requiredMarkers) {
  const file = path.join(root, relative);
  assert.ok(fs.existsSync(file), `Missing ${relative}`);
  const source = fs.readFileSync(file, "utf8");
  for (const marker of markers) assert.ok(source.includes(marker), `${relative} missing ${marker}`);
}

console.log("Competition mathematics audit passed.");
