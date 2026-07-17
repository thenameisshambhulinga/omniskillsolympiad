import fs from "node:fs";

const checks = [
  ["proxy.ts", /daily-quizzes/],
  ["app/daily-quizzes/page.tsx", /requireOnboardedPageUser/],
  ["app/daily-challenges/page.tsx", /requireOnboardedPageUser/],
  ["app/daily-challenges/[challengeId]/page.tsx", /requireOnboardedPageUser/],
  ["app/quiz/page.tsx", /requireOnboardedPageUser/],
  ["app/quiz/[quizId]/page.tsx", /requireOnboardedPageUser/],
  ["app/api/public/protected-tests/route.ts", /requireApiOnboardedUser/],
  ["app/api/daily/start/route.ts", /requireApiOnboardedUser/],
  ["app/api/daily/attempt/route.ts", /requireApiOnboardedUser/],
  ["app/api/quiz/start/route.ts", /requireApiOnboardedUser/],
  ["app/api/quiz/autosave/route.ts", /requireApiOnboardedUser/],
  ["app/api/quiz/submit/route.ts", /requireApiOnboardedUser/],
  ["app/api/quiz/abandon/route.ts", /requireApiOnboardedUser/],
];

const failures = [];
for (const [file, pattern] of checks) {
  const text = fs.readFileSync(file, "utf8");
  if (!pattern.test(text)) failures.push(`${file}: missing ${pattern}`);
}

if (failures.length) {
  console.error("Assessment authorization audit failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("Assessment authorization audit passed.");
