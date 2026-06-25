from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path.cwd()


def fail(message: str) -> None:
    raise SystemExit(f"[hardening] {message}")


def ensure_project_root() -> None:
    required = [ROOT / "package.json", ROOT / "app", ROOT / "lib", ROOT / "prisma" / "schema.prisma"]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        fail("Run this script from the Silicon Skillathon project root. Missing: " + ", ".join(missing))


def backup_file(path: Path) -> None:
    if not path.exists():
        return
    backup_root = ROOT / ".hardening-backup"
    backup_path = backup_root / path.relative_to(ROOT)
    backup_path.parent.mkdir(parents=True, exist_ok=True)
    if not backup_path.exists():
        shutil.copy2(path, backup_path)


def write(rel: str, content: str) -> None:
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    backup_file(path)
    path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"[write] {rel}")


def patch_text(rel: str, patcher) -> None:
    path = ROOT / rel
    if not path.exists():
        fail(f"Cannot patch missing file: {rel}")
    backup_file(path)
    old = path.read_text(encoding="utf-8-sig")
    new = patcher(old)
    if new != old:
        path.write_text(new, encoding="utf-8")
        print(f"[patch] {rel}")
    else:
        print(f"[skip] {rel}")


def replace_exact(rel: str, old: str, new: str) -> None:
    def patcher(text: str) -> str:
        if old not in text:
            if new in text:
                return text
            fail(f"Expected text not found in {rel}: {old[:80]!r}")
        return text.replace(old, new, 1)
    patch_text(rel, patcher)


def add_after_imports(rel: str, export_lines: str) -> None:
    def patcher(text: str) -> str:
        requested = [line.strip() for line in export_lines.splitlines() if line.strip()]
        missing = [line for line in requested if line not in text]
        if not missing:
            return text

        lines = text.splitlines()
        insert_at = 0
        for i, line in enumerate(lines):
            if line.startswith("import ") or line.strip() == "" or line.startswith("//"):
                insert_at = i + 1
                continue
            break
        lines.insert(insert_at, "\n".join(missing))
        return "\n".join(lines) + "\n"
    patch_text(rel, patcher)


ensure_project_root()

# Remove accidental scratch files that were present in the ZIP and should not be hosted.
for rel in ["tatus", "tatus --short", "components/admin/xyz", "components/layout/cxx"]:
    path = ROOT / rel
    if path.exists() and path.is_file():
        backup_file(path)
        path.unlink()
        print(f"[remove] {rel}")

write("lib/security/request-guard.ts", r'''
import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __osoRateLimit?: Map<string, Bucket>;
  __osoRateLimitSweep?: number;
};

const MAX_BUCKETS = 10_000;

function getBuckets() {
  if (!globalRateLimit.__osoRateLimit) {
    globalRateLimit.__osoRateLimit = new Map<string, Bucket>();
  }

  return globalRateLimit.__osoRateLimit;
}

function pruneExpiredBuckets(buckets: Map<string, Bucket>, now: number) {
  globalRateLimit.__osoRateLimitSweep =
    (globalRateLimit.__osoRateLimitSweep ?? 0) + 1;

  if (
    buckets.size < MAX_BUCKETS &&
    globalRateLimit.__osoRateLimitSweep % 100 !== 0
  ) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

function noStore(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-vercel-forwarded-for") ||
    "unknown"
  );
}

function getAllowedOrigins(request: Request) {
  const allowed = new Set<string>();
  const host = request.headers.get("host");

  if (host) {
    allowed.add(`https://${host}`);

    if (process.env.NODE_ENV !== "production") {
      allowed.add(`http://${host}`);
    }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL;

  if (appUrl) {
    try {
      allowed.add(new URL(appUrl).origin);
    } catch {
      // Optional env only. Hosting audit validates malformed URLs.
    }
  }

  return allowed;
}

export function rejectCrossSiteMutation(request: Request) {
  const method = request.method.toUpperCase();

  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const secFetchSite = request.headers.get("sec-fetch-site");

  if (secFetchSite === "cross-site") {
    return noStore(
      {
        ok: false,
        success: false,
        error: "Cross-site request blocked.",
      },
      {
        status: 403,
      },
    );
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  if (!getAllowedOrigins(request).has(origin)) {
    return noStore(
      {
        ok: false,
        success: false,
        error: "Invalid request origin.",
      },
      {
        status: 403,
      },
    );
  }

  return null;
}

export function enforceContentLength(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");

  if (!contentLength) {
    return null;
  }

  const parsed = Number(contentLength);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return noStore(
      {
        ok: false,
        success: false,
        error: "Invalid Content-Length header.",
      },
      {
        status: 400,
      },
    );
  }

  if (parsed > maxBytes) {
    return noStore(
      {
        ok: false,
        success: false,
        error: "Request payload is too large.",
      },
      {
        status: 413,
      },
    );
  }

  return null;
}

export function enforceRateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs: number,
) {
  const buckets = getBuckets();
  const now = Date.now();

  pruneExpiredBuckets(buckets, now);

  const ip = getClientIp(request);
  const bucketKey = `${key}:${ip}`;
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(bucketKey, {
      count: 1,
      resetAt: now + windowMs,
    });

    return null;
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    return noStore(
      {
        ok: false,
        success: false,
        error: "Too many requests. Try again shortly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  return null;
}

export function noStoreJson(data: unknown, init?: ResponseInit) {
  return noStore(data, init);
}
''')

write("lib/server/route-hardening.ts", r'''
import { NextResponse } from "next/server";

import {
  enforceContentLength,
  enforceRateLimit,
  rejectCrossSiteMutation,
} from "@/lib/security/request-guard";

export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

type MutationGuardOptions = {
  key: string;
  limit?: number;
  windowMs?: number;
  maxBytes?: number;
};

export function guardMutationRequest(
  request: Request,
  {
    key,
    limit = 80,
    windowMs = 60_000,
    maxBytes = 512 * 1024,
  }: MutationGuardOptions,
) {
  return (
    rejectCrossSiteMutation(request) ??
    enforceContentLength(request, maxBytes) ??
    enforceRateLimit(request, key, limit, windowMs)
  );
}

export function jsonNoStore(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...NO_STORE_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

export function jsonError(
  error: string,
  status = 500,
  extra?: Record<string, unknown>,
) {
  return jsonNoStore(
    {
      ok: false,
      success: false,
      error,
      ...(extra ?? {}),
    },
    {
      status,
    },
  );
}

export function jsonOk(payload: Record<string, unknown>, init?: ResponseInit) {
  return jsonNoStore(
    {
      ok: true,
      success: true,
      ...payload,
    },
    init,
  );
}
''')

write("lib/prisma.ts", r'''
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prismaLogLevels: Prisma.PrismaClientOptions["log"] =
  process.env.PRISMA_QUERY_LOGS === "true"
    ? [
        {
          emit: "stdout",
          level: "query",
        },
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ]
    : [
        {
          emit: "stdout",
          level: "error",
        },
        {
          emit: "stdout",
          level: "warn",
        },
      ];

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogLevels,
    transactionOptions: {
      maxWait: 5_000,
      timeout: 12_000,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
''')

write("lib/omni-id.ts", r'''
import { prisma } from "@/lib/prisma";

export function formatOmniId(value: number, year = new Date().getFullYear()) {
  return `OMNI-${year}-${String(value).padStart(5, "0")}`;
}

export async function generateOmniId() {
  const counter = await prisma.omniCounter.upsert({
    where: {
      id: 1,
    },
    create: {
      id: 1,
      nextValue: 2,
    },
    update: {
      nextValue: {
        increment: 1,
      },
    },
    select: {
      nextValue: true,
    },
  });

  return formatOmniId(counter.nextValue - 1);
}
''')

write("app/api/admin/create-quiz/route.ts", r'''
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanText(value: unknown, maxLength = 200) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeDuration(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(1, Math.min(180, Math.round(parsed)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-quiz",
    limit: 40,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const title = cleanText(body.title, 180);
  const description = cleanText(body.description, 1200) || null;
  const category = cleanText(body.category, 120);
  const difficulty = cleanText(body.difficulty, 60).toLowerCase();
  const duration = normalizeDuration(body.duration);

  if (!title || !category || !difficulty || !duration) {
    return jsonError("Title, category, difficulty and duration are required.", 400);
  }

  const created = await prisma.quiz.create({
    data: {
      title,
      description,
      category,
      difficulty,
      duration,
      totalPoints: 0,
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      difficulty: true,
      duration: true,
      totalPoints: true,
      isActive: true,
      createdAt: true,
    },
  });

  return jsonOk(
    {
      quiz: {
        ...created,
        createdAt: created.createdAt.toISOString(),
      },
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
}
''')

write("app/api/admin/create-question/route.ts", r'''
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OptionKey = "A" | "B" | "C" | "D";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-question",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const quizId = cleanString(body.quizId, 200);
  const question = cleanString(body.question, 5000);
  const optionA = cleanString(body.optionA, 1000);
  const optionB = cleanString(body.optionB, 1000);
  const optionC = cleanString(body.optionC, 1000);
  const optionD = cleanString(body.optionD, 1000);
  const rawCorrectAnswer = cleanString(body.correctAnswer, 1000);
  const points = normalizePoints(body.points);

  if (!quizId) {
    return jsonError("quizId is required.", 400);
  }

  if (question.length < 5) {
    return jsonError("Question must be at least 5 characters.", 400);
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    return jsonError("All options A-D are required.", 400);
  }

  if (!rawCorrectAnswer) {
    return jsonError("correctAnswer is required.", 400);
  }

  const options = {
    A: optionA,
    B: optionB,
    C: optionC,
    D: optionD,
  } satisfies Record<OptionKey, string>;

  const normalizedOptions = Object.values(options).map(normalizeChoice);

  if (new Set(normalizedOptions).size !== 4) {
    return jsonError("Duplicate options are not allowed.", 400);
  }

  const correctAnswer = resolveCorrectAnswer(rawCorrectAnswer, options);

  if (!correctAnswer) {
    return jsonError("Correct answer must be A/B/C/D or exactly match one option.", 400);
  }

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
    select: {
      id: true,
    },
  });

  if (!quiz) {
    return jsonError("Quiz not found.", 404);
  }

  const duplicateQuestion = await prisma.question.findFirst({
    where: {
      quizId,
      question: {
        equals: question,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicateQuestion) {
    return jsonError("A similar question already exists in this quiz.", 409);
  }

  const created = await prisma.$transaction(async (tx) => {
    const questionRecord = await tx.question.create({
      data: {
        quizId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        points,
      },
    });

    await tx.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        totalPoints: {
          increment: questionRecord.points,
        },
      },
    });

    return questionRecord;
  });

  return jsonOk(
    {
      question: created,
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
}

function resolveCorrectAnswer(
  value: string,
  options: Record<OptionKey, string>,
): string | null {
  const normalizedValue = normalizeChoice(value);
  const upperValue = value.trim().toUpperCase();

  if (isOptionKey(upperValue)) {
    return options[upperValue];
  }

  const matchedOption = Object.values(options).find(
    (option) => normalizeChoice(option) === normalizedValue,
  );

  return matchedOption ?? null;
}

function isOptionKey(value: string): value is OptionKey {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeChoice(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizePoints(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.max(1, Math.min(100, Math.round(parsed)));
}
''')

write("app/api/admin/create-daily-challenge/route.ts", r'''
import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanNumber(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return Math.max(1, Math.min(365, Math.round(numberValue)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-daily-challenge",
    limit: 40,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const dayNumber = cleanNumber(body.dayNumber);
  const title = cleanText(body.title, 180);
  const description = cleanText(body.description, 1500);

  if (!dayNumber || !title || !description) {
    return jsonError("Day number, title and description are required.", 400);
  }

  const existing = await prisma.dailyChallenge.findFirst({
    where: {
      dayNumber,
    },
    select: {
      id: true,
      title: true,
    },
  });

  if (existing) {
    return jsonError(
      `Day ${dayNumber} already exists as '${existing.title}'. Edit that challenge instead of creating a duplicate.`,
      409,
    );
  }

  const challenge = await prisma.dailyChallenge.create({
    data: {
      dayNumber,
      title,
      description,
      isPublished: Boolean(body.isPublished),
    },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      isPublished: true,
      createdAt: true,
    },
  });

  return jsonOk(
    {
      challenge: {
        ...challenge,
        createdAt: challenge.createdAt.toISOString(),
      },
      createdBy: auth.user.email,
    },
    {
      status: 201,
    },
  );
}
''')

write("app/api/admin/create-daily-question/route.ts", r'''
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type DailyQuestionPayload = {
  challengeId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  difficulty: string;
};

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeChoice(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeDifficulty(value: unknown) {
  const difficulty = cleanString(value, 20).toLowerCase();

  if (["easy", "medium", "hard"].includes(difficulty)) {
    return difficulty;
  }

  return "easy";
}

function parsePayload(body: Record<string, unknown>): DailyQuestionPayload {
  return {
    challengeId: cleanString(body.challengeId, 200),
    question: cleanString(body.question, 5000),
    optionA: cleanString(body.optionA, 1000),
    optionB: cleanString(body.optionB, 1000),
    optionC: cleanString(body.optionC, 1000),
    optionD: cleanString(body.optionD, 1000),
    correctAnswer: cleanString(body.correctAnswer, 1000),
    difficulty: normalizeDifficulty(body.difficulty),
  };
}

function invalidPayload(payload: DailyQuestionPayload) {
  if (!payload.challengeId) return "Challenge ID is required.";
  if (payload.question.length < 5) return "Question must be at least 5 characters.";

  if (!payload.optionA || !payload.optionB || !payload.optionC || !payload.optionD) {
    return "All four options are required.";
  }

  if (!payload.correctAnswer) return "Correct answer is required.";

  const normalizedOptions = [
    payload.optionA,
    payload.optionB,
    payload.optionC,
    payload.optionD,
  ].map(normalizeChoice);

  if (new Set(normalizedOptions).size !== 4) {
    return "All options must be unique.";
  }

  if (!normalizedOptions.includes(normalizeChoice(payload.correctAnswer))) {
    return "Correct answer must exactly match one of the options.";
  }

  return "";
}

async function readBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      contentType,
      body: (await request.json()) as Record<string, unknown>,
    };
  }

  const formData = await request.formData();

  return {
    contentType,
    body: Object.fromEntries(formData.entries()),
  };
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-create-daily-question",
    limit: 120,
    maxBytes: 768 * 1024,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { body, contentType } = await readBody(request);
    const payload = parsePayload(body);
    const error = invalidPayload(payload);

    if (error) {
      return jsonError(error, 400);
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: payload.challengeId,
      },
      select: {
        id: true,
      },
    });

    if (!challenge) {
      return jsonError("Challenge not found.", 404);
    }

    const duplicateQuestion = await prisma.dailyQuestion.findFirst({
      where: {
        challengeId: payload.challengeId,
        question: {
          equals: payload.question,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateQuestion) {
      return jsonError("A similar question already exists in this challenge.", 409);
    }

    const createdQuestion = await prisma.dailyQuestion.create({
      data: payload,
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/admin/challenge/${payload.challengeId}`, request.url),
        {
          status: 303,
        },
      );
    }

    return jsonOk(
      {
        question: createdQuestion,
        createdBy: auth.user.email,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("ADMIN CREATE DAILY QUESTION ERROR:", error);
    return jsonError("Failed to create daily question.", 500);
  }
}
''')

write("app/api/admin/delete-question/route.ts", r'''
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function cleanString(value: unknown, maxLength = 200) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return {
      contentType,
      questionId: cleanString(body.questionId),
      challengeId: cleanString(body.challengeId),
    };
  }

  const form = await request.formData();

  return {
    contentType,
    questionId: cleanString(form.get("questionId")),
    challengeId: cleanString(form.get("challengeId")),
  };
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-delete-daily-question",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { contentType, questionId, challengeId } = await readPayload(request);

    if (!questionId || !challengeId) {
      return jsonError("Missing questionId or challengeId.", 400);
    }

    const question = await prisma.dailyQuestion.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        challengeId: true,
      },
    });

    if (!question) {
      return jsonError("Question not found.", 404);
    }

    if (question.challengeId !== challengeId) {
      return jsonError("Question does not belong to the supplied challenge.", 409);
    }

    await prisma.dailyQuestion.delete({
      where: {
        id: questionId,
      },
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL(`/admin/challenge/${challengeId}`, request.url), {
        status: 303,
      });
    }

    return jsonOk({
      deletedBy: auth.user.email,
    });
  } catch (error) {
    console.error("ADMIN DELETE DAILY QUESTION ERROR:", error);
    return jsonError("Failed to delete question.", 500);
  }
}
''')

write("app/api/admin/publish-challenge/route.ts", r'''
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireApiAdmin } from "@/lib/server/api-auth";
import { guardMutationRequest } from "@/lib/server/route-hardening";

type PublishAction = "publish" | "unpublish";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "admin-publish-daily-challenge",
    limit: 80,
  });

  if (guarded) return guarded;

  const auth = await requireApiAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const { challengeId, action } = await readPublishPayload(request, contentType);

    if (!challengeId || !isPublishAction(action)) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 400,
        json: {
          success: false,
          ok: false,
          error: "Challenge ID and valid action are required.",
        },
        redirectStatus: "invalid-request",
      });
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
      select: {
        id: true,
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 404,
        json: {
          success: false,
          ok: false,
          error: "Challenge not found.",
        },
        redirectStatus: "not-found",
      });
    }

    const isPublishing = action === "publish";

    if (isPublishing && challenge.questions.length === 0) {
      return handleResponse({
        contentType,
        request,
        challengeId,
        status: 400,
        json: {
          success: false,
          ok: false,
          error: "Add at least one question before publishing.",
        },
        redirectStatus: "publish-needs-question",
      });
    }

    const updatedChallenge = await prisma.dailyChallenge.update({
      where: {
        id: challengeId,
      },
      data: {
        isPublished: isPublishing,
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    return handleResponse({
      contentType,
      request,
      challengeId,
      status: 200,
      json: {
        success: true,
        ok: true,
        challenge: updatedChallenge,
        updatedBy: auth.user.email,
      },
      redirectStatus: isPublishing ? "published" : "unpublished",
    });
  } catch (error) {
    console.error("PUBLISH DAILY CHALLENGE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: "Failed to update challenge publish status.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}

async function readPublishPayload(request: Request, contentType: string) {
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      challengeId?: unknown;
      action?: unknown;
    };

    return {
      challengeId: typeof body.challengeId === "string" ? body.challengeId.trim() : "",
      action: typeof body.action === "string" ? body.action.trim() : "",
    };
  }

  const form = await request.formData();
  const challengeIdValue = form.get("challengeId");
  const actionValue = form.get("action");

  return {
    challengeId:
      typeof challengeIdValue === "string" ? challengeIdValue.trim() : "",
    action: typeof actionValue === "string" ? actionValue.trim() : "",
  };
}

function isPublishAction(value: string): value is PublishAction {
  return value === "publish" || value === "unpublish";
}

function handleResponse({
  contentType,
  request,
  challengeId,
  status,
  json,
  redirectStatus,
}: {
  contentType: string;
  request: Request;
  challengeId: string;
  status: number;
  json: Record<string, unknown>;
  redirectStatus: string;
}) {
  if (contentType.includes("application/json")) {
    return NextResponse.json(json, {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  }

  const targetPath = challengeId
    ? `/admin/challenge/${challengeId}?status=${encodeURIComponent(redirectStatus)}`
    : `/admin/manage-challenges?status=${encodeURIComponent(redirectStatus)}`;

  return NextResponse.redirect(new URL(targetPath, request.url), {
    status: 303,
  });
}
''')

write("app/api/onboarding/complete/route.ts", r'''
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { prisma } from "@/lib/prisma";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SKILLS = ["Embedded Systems", "ARM Programming", "PCB Design"];
const MAX_PROFILE_IMAGE_DATA_URL_LENGTH = 750_000;

function cleanString(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const clean = String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
  return clean || undefined;
}

function cleanStringArray(value: unknown, maxItems = 20, maxLength = 80) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => cleanString(item, maxLength))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);
}

function cleanProfileImage(value: unknown, fallback: string | null) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fallback;
  }

  const image = value.trim();

  if (image.length > MAX_PROFILE_IMAGE_DATA_URL_LENGTH) {
    return fallback;
  }

  if (
    image.startsWith("data:image/jpeg;base64,") ||
    image.startsWith("data:image/png;base64,") ||
    image.startsWith("data:image/webp;base64,") ||
    image.startsWith("https://") ||
    image.startsWith("/")
  ) {
    return image;
  }

  return fallback;
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "onboarding-complete",
    limit: 20,
    maxBytes: 900 * 1024,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return jsonError("Unauthorized", 401);
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const personal = objectOrEmpty(body.personal);
  const academic = objectOrEmpty(body.academic);
  const professional = objectOrEmpty(body.professional);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return jsonError("User not found", 404);
  }

  const omniId = user.omniId || (await generateOmniId());

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        omniId,
        isOnboarded: true,
        fullName: cleanString(personal.fullName, 120) ?? user.fullName,
        phone: cleanString(personal.phoneNumber, 30) ?? user.phone,
        dateOfBirth: cleanString(personal.dateOfBirth, 30) ?? user.dateOfBirth,
        image: cleanProfileImage(personal.profileImageDataUrl, user.image),
        college: cleanString(academic.collegeName, 180) ?? user.college,
        university: cleanString(academic.university, 180) ?? user.university,
        usn: cleanString(academic.usn, 80) ?? user.usn,
        course: cleanString(academic.course, 80) ?? user.course,
        branch: cleanString(academic.branch, 120) ?? user.branch,
        semester: cleanString(academic.semester, 40) ?? user.semester,
        state: cleanString(academic.state, 100) ?? user.state,
        district: cleanString(academic.district, 100) ?? user.district,
        pincode: cleanString(academic.pincode, 20) ?? user.pincode,
        bio: cleanString(professional.tagline, 280) ?? user.bio,
        skills:
          cleanStringArray(professional.technicalSkills, 24, 80) ?? user.skills,
        careerInterests:
          cleanStringArray(professional.careerInterests, 24, 80) ??
          user.careerInterests,
      },
      select: {
        id: true,
        omniId: true,
      },
    });

    const existingProgress = await tx.skillProgress.findMany({
      where: {
        userId: updated.id,
      },
      select: {
        id: true,
      },
      take: 1,
    });

    if (existingProgress.length === 0) {
      await tx.skillProgress.createMany({
        data: DEFAULT_SKILLS.map((skill) => ({
          userId: updated.id,
          skill,
          progress: 0,
        })),
      });
    }

    await tx.seasonProgress.upsert({
      where: {
        userId: updated.id,
      },
      create: {
        userId: updated.id,
      },
      update: {},
    });

    return updated;
  });

  return jsonOk({
    redirectTo: "/onboarding/success",
    omniId: updatedUser.omniId,
  });
}

function objectOrEmpty(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}
''')

write("app/api/onboarding/route.ts", r'''
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { generateOmniId } from "@/lib/omni-id";
import { prisma } from "@/lib/prisma";
import { guardMutationRequest, jsonError, jsonOk } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT_SKILLS = ["Embedded Systems", "ARM Programming", "PCB Design"];

function cleanString(value: unknown, maxLength = 500) {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const clean = String(value).trim().replace(/\s+/g, " ").slice(0, maxLength);
  return clean || undefined;
}

function cleanStringArray(value: unknown, maxItems = 20, maxLength = 80) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .map((item) => cleanString(item, maxLength))
    .filter((item): item is string => Boolean(item))
    .slice(0, maxItems);
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "onboarding-legacy",
    limit: 20,
    maxBytes: 512 * 1024,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return jsonError("Unauthorized", 401);
  }

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      omniId: true,
      skills: true,
    },
  });

  if (!existingUser) {
    return jsonError("User not found.", 404);
  }

  const omniId = existingUser.omniId || (await generateOmniId());

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: {
        email: session.user.email!,
      },
      data: {
        fullName: cleanString(body.fullName, 120),
        college: cleanString(body.college, 180),
        branch: cleanString(body.branch, 120),
        year: cleanString(body.year, 40),
        bio: cleanString(body.bio, 280),
        skills: cleanStringArray(body.skills, 24, 80) ?? existingUser.skills,
        omniId,
        isOnboarded: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        omniId: true,
        isOnboarded: true,
      },
    });

    const existingProgress = await tx.skillProgress.findMany({
      where: {
        userId: updated.id,
      },
      select: {
        id: true,
      },
      take: 1,
    });

    if (existingProgress.length === 0) {
      await tx.skillProgress.createMany({
        data: DEFAULT_SKILLS.map((skill) => ({
          userId: updated.id,
          skill,
          progress: 0,
        })),
      });
    }

    await tx.seasonProgress.upsert({
      where: {
        userId: updated.id,
      },
      create: {
        userId: updated.id,
      },
      update: {},
    });

    return updated;
  });

  return jsonOk({
    user: updatedUser,
    redirectTo: "/onboarding/success",
  });
}
''')

write("app/api/daily/start/route.ts", r'''
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/server/api-auth";
import {
  apiError,
  apiOk,
  cleanString,
  readJsonObject,
} from "@/lib/server/api-response";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CHALLENGE_DURATION_MINUTES = 2;

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "daily-start",
    limit: 45,
  });

  if (guarded) return guarded;

  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const { user } = auth;

    if (user.seasonProgress?.eliminated) {
      return apiError(
        "You are eliminated from this season.",
        403,
        "SEASON_ELIMINATED",
      );
    }

    if (user.seasonProgress?.championBlocked) {
      return apiError(
        "Previous champions cannot compete again.",
        403,
        "CHAMPION_BLOCKED",
      );
    }

    const parsed = await readJsonObject(request);

    if (parsed.response) {
      return parsed.response;
    }

    const challengeId = cleanString(parsed.data.challengeId, 200);

    if (!challengeId) {
      return apiError("Challenge ID is required.", 400, "CHALLENGE_ID_REQUIRED");
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
      select: {
        id: true,
        dayNumber: true,
        title: true,
        isPublished: true,
        questions: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!challenge) {
      return apiError("Challenge not found.", 404, "CHALLENGE_NOT_FOUND");
    }

    if (!challenge.isPublished) {
      return apiError(
        "Challenge is not published.",
        403,
        "CHALLENGE_NOT_PUBLISHED",
      );
    }

    if (challenge.questions.length === 0) {
      return apiError("Challenge has no questions.", 400, "EMPTY_CHALLENGE");
    }

    const existingAttempt = await prisma.dailyAttempt.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId,
        },
      },
      select: {
        id: true,
        completed: true,
        score: true,
        total: true,
        percentage: true,
        expiresAt: true,
        submittedAt: true,
      },
    });

    if (existingAttempt?.completed) {
      return apiError("Challenge already completed", 409, "ALREADY_COMPLETED", {
        score: existingAttempt.score,
        total: existingAttempt.total,
        percentage: existingAttempt.percentage,
        submittedAt: existingAttempt.submittedAt,
      });
    }

    const now = new Date();

    if (existingAttempt?.expiresAt) {
      const remainingMs = existingAttempt.expiresAt.getTime() - now.getTime();

      if (remainingMs > 0) {
        return apiOk({
          attemptId: existingAttempt.id,
          resumed: true,
          expiresAt: existingAttempt.expiresAt,
          remainingMs,
          durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
          serverNow: now.toISOString(),
        });
      }

      return apiError(
        "Challenge time expired",
        403,
        "ATTEMPT_EXPIRED",
        {
          attemptId: existingAttempt.id,
          expiresAt: existingAttempt.expiresAt,
        },
      );
    }

    const expiresAt = new Date(
      now.getTime() + CHALLENGE_DURATION_MINUTES * 60 * 1000,
    );

    try {
      const newAttempt = await prisma.dailyAttempt.create({
        data: {
          userId: user.id,
          challengeId,
          challengeDay: challenge.dayNumber,
          score: 0,
          total: challenge.questions.length,
          percentage: 0,
          completed: false,
          expiresAt,
        },
        select: {
          id: true,
        },
      });

      return apiOk({
        attemptId: newAttempt.id,
        resumed: false,
        expiresAt,
        remainingMs: Math.max(0, expiresAt.getTime() - Date.now()),
        durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
        serverNow: now.toISOString(),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const activeAttempt = await prisma.dailyAttempt.findUnique({
          where: {
            userId_challengeId: {
              userId: user.id,
              challengeId,
            },
          },
          select: {
            id: true,
            completed: true,
            expiresAt: true,
          },
        });

        if (activeAttempt?.completed) {
          return apiError(
            "Challenge already completed",
            409,
            "ALREADY_COMPLETED",
          );
        }

        if (activeAttempt?.expiresAt) {
          return apiOk({
            attemptId: activeAttempt.id,
            resumed: true,
            expiresAt: activeAttempt.expiresAt,
            remainingMs: Math.max(
              0,
              activeAttempt.expiresAt.getTime() - Date.now(),
            ),
            durationMs: CHALLENGE_DURATION_MINUTES * 60 * 1000,
            serverNow: new Date().toISOString(),
          });
        }
      }

      throw error;
    }
  } catch (error) {
    console.error("DAILY START ERROR:", error);

    return apiError(
      "Failed to start challenge.",
      500,
      "DAILY_START_FAILED",
    );
  }
}
''')

write("app/api/daily/attempt/route.ts", r'''
import { calculateOmniScore } from "@/lib/engineering-system";
import { prisma } from "@/lib/prisma";
import {
  scoreDailyAnswers,
  type DailyScoringQuestion,
} from "@/lib/daily-challenge/daily-score-engine";
import { requireApiUser } from "@/lib/server/api-auth";
import {
  apiError,
  apiOk,
  cleanString,
  readJsonObject,
} from "@/lib/server/api-response";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POINTS_PER_CORRECT_ANSWER = 10;
const SUBMISSION_GRACE_MS = 5000;
const MAX_DAILY_SECURITY_VIOLATIONS = 5;

function normalizeSecurityCount(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(50, Math.round(parsed)));
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "daily-submit",
    limit: 35,
  });

  if (guarded) return guarded;

  try {
    const auth = await requireApiUser();

    if (auth.response) {
      return auth.response;
    }

    const { user } = auth;

    if (user.seasonProgress?.eliminated) {
      return apiError(
        "You are eliminated from this season.",
        403,
        "SEASON_ELIMINATED",
      );
    }

    if (user.seasonProgress?.championBlocked) {
      return apiError(
        "Previous champions cannot compete again.",
        403,
        "CHAMPION_BLOCKED",
      );
    }

    const parsed = await readJsonObject(request);

    if (parsed.response) {
      return parsed.response;
    }

    const challengeId = cleanString(parsed.data.challengeId, 200);
    const answers = Array.isArray(parsed.data.answers) ? parsed.data.answers : null;
    const tabSwitchCount = normalizeSecurityCount(parsed.data.tabSwitchCount);

    if (!challengeId || !answers) {
      return apiError(
        "Challenge ID and answers are required.",
        400,
        "INVALID_PAYLOAD",
      );
    }

    const challenge = await prisma.dailyChallenge.findUnique({
      where: {
        id: challengeId,
      },
      select: {
        id: true,
        dayNumber: true,
        isPublished: true,
        questions: {
          select: {
            id: true,
            correctAnswer: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
          },
        },
      },
    });

    if (!challenge || !challenge.isPublished) {
      return apiError("Challenge unavailable.", 404, "CHALLENGE_UNAVAILABLE");
    }

    if (challenge.questions.length === 0) {
      return apiError(
        "Challenge has no questions.",
        400,
        "EMPTY_CHALLENGE",
      );
    }

    const existingAttempt = await prisma.dailyAttempt.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId,
        },
      },
      select: {
        id: true,
        completed: true,
        expiresAt: true,
      },
    });

    if (!existingAttempt) {
      return apiError(
        "Challenge session not started.",
        400,
        "SESSION_NOT_STARTED",
      );
    }

    if (existingAttempt.completed) {
      return apiError(
        "Challenge already submitted.",
        409,
        "ALREADY_SUBMITTED",
      );
    }

    if (!existingAttempt.expiresAt) {
      return apiError(
        "Challenge expiration missing.",
        400,
        "MISSING_EXPIRATION",
      );
    }

    const now = new Date();
    const expiresAt = new Date(existingAttempt.expiresAt);
    const latestAllowedSubmission = new Date(
      expiresAt.getTime() + SUBMISSION_GRACE_MS,
    );
    const expired = now > latestAllowedSubmission;
    const suspicious = tabSwitchCount >= MAX_DAILY_SECURITY_VIOLATIONS;

    if (expired) {
      return apiError("Challenge time expired.", 400, "TIME_EXPIRED");
    }

    const scoreResult = scoreDailyAnswers({
      questions: challenge.questions satisfies DailyScoringQuestion[],
      answers,
    });

    const earnedPoints = suspicious
      ? 0
      : scoreResult.score * POINTS_PER_CORRECT_ANSWER;

    await prisma.$transaction(async (tx) => {
      const finalizedAttempt = await tx.dailyAttempt.updateMany({
        where: {
          id: existingAttempt.id,
          completed: false,
        },
        data: {
          score: scoreResult.score,
          total: scoreResult.total,
          percentage: scoreResult.percentage,
          completed: true,
          submittedAt: now,
          suspicious,
          tabSwitchCount,
        },
      });

      if (finalizedAttempt.count !== 1) {
        throw new Error("ATTEMPT_ALREADY_FINALIZED");
      }

      const currentProgress = await tx.seasonProgress.findUnique({
        where: {
          userId: user.id,
        },
      });

      const previousCompletedDays = currentProgress?.completedDays ?? 0;
      const previousAccuracy = currentProgress?.averageAccuracy ?? 0;
      const previousConsistency = currentProgress?.consistencyScore ?? 100;
      const previousTotalPoints = currentProgress?.totalPoints ?? 0;
      const completedDays = previousCompletedDays + 1;
      const averageAccuracy =
        (previousAccuracy * previousCompletedDays + scoreResult.percentage) /
        completedDays;
      const consistencyScore = suspicious
        ? Math.max(0, previousConsistency - 3)
        : Math.min(100, previousConsistency + 0.5);
      const totalPoints = previousTotalPoints + earnedPoints;
      const omniScore = calculateOmniScore({
        averageAccuracy,
        consistencyScore,
        completedDays,
        totalPoints,
      });

      if (!suspicious) {
        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            siliconPoints: {
              increment: earnedPoints,
            },
            streak: {
              increment: 1,
            },
          },
        });
      }

      if (!currentProgress) {
        await tx.seasonProgress.create({
          data: {
            userId: user.id,
            currentDay: challenge.dayNumber + 1,
            completedDays,
            consistencyScore,
            averageAccuracy: Number(averageAccuracy.toFixed(2)),
            weightedRankScore: omniScore,
            totalPoints,
          },
        });

        return;
      }

      await tx.seasonProgress.update({
        where: {
          userId: user.id,
        },
        data: {
          currentDay: Math.max(
            currentProgress.currentDay,
            challenge.dayNumber + 1,
          ),
          completedDays,
          consistencyScore,
          averageAccuracy: Number(averageAccuracy.toFixed(2)),
          weightedRankScore: omniScore,
          totalPoints,
        },
      });
    });

    return apiOk({
      score: scoreResult.score,
      total: scoreResult.total,
      percentage: scoreResult.percentage,
      earnedPoints,
      suspicious,
      meta: {
        answeredCount: scoreResult.answeredCount,
        unansweredCount: scoreResult.unansweredCount,
        duplicateAnswerCount: scoreResult.duplicateAnswerCount,
        unknownQuestionCount: scoreResult.unknownQuestionCount,
        invalidAnswerCount: scoreResult.invalidAnswerCount,
        tabSwitchCount,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ATTEMPT_ALREADY_FINALIZED"
    ) {
      return apiError(
        "Challenge already submitted.",
        409,
        "ALREADY_SUBMITTED",
      );
    }

    console.error("DAILY ATTEMPT SUBMIT ERROR:", error);

    return apiError(
      "Failed to submit challenge.",
      500,
      "DAILY_ATTEMPT_SUBMIT_FAILED",
    );
  }
}
''')

write("app/api/quiz/start/route.ts", r'''
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getQuizDurationMs,
  getRemainingMs,
  hasQuizExpired,
  isProtectedTestReady,
  PROTECTED_TEST_DURATION_MINUTES,
} from "@/lib/quiz/quiz-policy";
import { guardMutationRequest } from "@/lib/server/route-hardening";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseSavedAnswers(value: string | null) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, string>;
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const guarded = guardMutationRequest(request, {
    key: "quiz-start",
    limit: 40,
  });

  if (guarded) return guarded;

  const session = await getServerSession(authOptions);
  const userEmail =
    typeof session?.user?.email === "string" ? session.user.email.trim() : "";

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { quizId?: unknown };

  try {
    body = (await request.json()) as { quizId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const quizId = typeof body.quizId === "string" ? body.quizId.trim() : "";

  if (!quizId) {
    return NextResponse.json({ error: "quizId is required." }, { status: 400 });
  }

  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      category: true,
      duration: true,
      isActive: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!quiz || !quiz.isActive) {
    return NextResponse.json({ error: "Quiz unavailable." }, { status: 404 });
  }

  if (!isProtectedTestReady(quiz._count.questions)) {
    return NextResponse.json(
      {
        error:
          "Protected test must contain 40 to 50 questions before students can start.",
      },
      { status: 400 },
    );
  }

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      userId_quizId: {
        userId: user.id,
        quizId: quiz.id,
      },
    },
    select: {
      id: true,
      completed: true,
      expiresAt: true,
      durationMinutes: true,
      answersJson: true,
      tabSwitchCount: true,
    },
  });

  if (existingAttempt?.completed) {
    return NextResponse.json(
      {
        error: "Test already submitted.",
        redirectTo: `/quiz/selection-result/${quiz.id}`,
      },
      { status: 409 },
    );
  }

  if (existingAttempt && hasQuizExpired(existingAttempt.expiresAt, now)) {
    await prisma.quizAttempt.update({
      where: {
        id: existingAttempt.id,
      },
      data: {
        completed: true,
        submittedAt: existingAttempt.expiresAt ?? now,
        suspicious: true,
        selectionStatus: "PENDING",
        selectionRank: null,
        selectionEvaluatedAt: null,
      },
    });

    return NextResponse.json(
      {
        error: "Test time expired.",
        redirectTo: `/quiz/selection-result/${quiz.id}`,
      },
      { status: 409 },
    );
  }

  if (existingAttempt?.expiresAt) {
    return NextResponse.json({
      success: true,
      attemptId: existingAttempt.id,
      resumed: true,
      expiresAt: existingAttempt.expiresAt.toISOString(),
      remainingMs: getRemainingMs(existingAttempt.expiresAt, now),
      durationMs: getQuizDurationMs(existingAttempt.durationMinutes),
      savedAnswers: parseSavedAnswers(existingAttempt.answersJson),
      tabSwitchCount: existingAttempt.tabSwitchCount,
      serverNow: now.toISOString(),
    });
  }

  const durationMinutes = quiz.duration || PROTECTED_TEST_DURATION_MINUTES;
  const durationMs = getQuizDurationMs(durationMinutes);
  const expiresAt = new Date(now.getTime() + durationMs);

  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        category: quiz.category,
        durationMinutes,
        startedAt: now,
        expiresAt,
        score: 0,
        total: 0,
        percentage: 0,
        completed: false,
        suspicious: false,
        tabSwitchCount: 0,
        answersJson: "{}",
        selectionStatus: "PENDING",
        selectionRank: null,
        selectionEvaluatedAt: null,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      resumed: false,
      expiresAt: expiresAt.toISOString(),
      remainingMs: durationMs,
      durationMs,
      savedAnswers: {},
      tabSwitchCount: 0,
      serverNow: now.toISOString(),
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const attempt = await prisma.quizAttempt.findUnique({
        where: {
          userId_quizId: {
            userId: user.id,
            quizId: quiz.id,
          },
        },
        select: {
          id: true,
          expiresAt: true,
          durationMinutes: true,
          answersJson: true,
          tabSwitchCount: true,
        },
      });

      if (attempt?.expiresAt) {
        return NextResponse.json({
          success: true,
          attemptId: attempt.id,
          resumed: true,
          expiresAt: attempt.expiresAt.toISOString(),
          remainingMs: getRemainingMs(attempt.expiresAt, now),
          durationMs: getQuizDurationMs(attempt.durationMinutes),
          savedAnswers: parseSavedAnswers(attempt.answersJson),
          tabSwitchCount: attempt.tabSwitchCount,
          serverNow: now.toISOString(),
        });
      }
    }

    throw error;
  }
}
''')

# Small patches instead of full rewrites for existing files.
replace_exact(
    "app/daily-challenges/[challengeId]/DailyChallengeClient.tsx",
    '''          body: JSON.stringify({\n            challengeId: initialChallenge.id,\n            answers,\n          }),''',
    '''          body: JSON.stringify({\n            challengeId: initialChallenge.id,\n            answers,\n            tabSwitchCount: violations,\n          }),''',
)

# Add runtime/dynamic markers to DB-backed routes/pages where missing.
for rel in [
    "app/page.tsx",
    "app/daily-quizzes/page.tsx",
    "app/profile/[omniId]/page.tsx",
]:
    add_after_imports(rel, 'export const dynamic = "force-dynamic";\nexport const revalidate = 0;\nexport const runtime = "nodejs";')

for rel in [
    "app/api/auth/[...nextauth]/route.ts",
    "app/api/admin/daily/add-question/route.ts",
    "app/api/daily/attempt/question/route.ts",
    "app/api/public/announcement-posters/route.ts",
]:
    add_after_imports(rel, 'export const dynamic = "force-dynamic";\nexport const runtime = "nodejs";')

# Optimize old daily quizzes page query: no heavy includes for list cards.
patch_text("app/daily-quizzes/page.tsx", lambda text: text.replace(
'''  const challenges = await prisma.dailyChallenge.findMany({\n    where: {\n      isPublished: true,\n    },\n    include: {\n      questions: true,\n      attempts: true,\n    },\n    orderBy: {\n      dayNumber: "asc",\n    },\n  });''',
'''  const challenges = await prisma.dailyChallenge.findMany({\n    where: {\n      isPublished: true,\n    },\n    select: {\n      id: true,\n      dayNumber: true,\n      title: true,\n      description: true,\n      _count: {\n        select: {\n          questions: true,\n        },\n      },\n    },\n    orderBy: {\n      dayNumber: "asc",\n    },\n    take: 60,\n  });'''
).replace("{challenge.questions.length} Questions", "{challenge._count.questions} Questions"))

# Fix stale public asset references to files that actually exist in public/.
replace_exact("components/brand/BrandLogo.tsx", 'src="/brand/logo.png"', 'src="/brand/omni-logo-new.jpeg"')
patch_text("components/landing/clean/OsoCleanLandingPage.tsx", lambda text: text
    .replace('imageUrl: "/event-img/embedded-systems.jpg"', 'imageUrl: "/illustrations/oso/benchmark-environment.png"')
    .replace('imageUrl: "/event-img/pcb-innovation.jpg"', 'imageUrl: "/illustrations/oso/competitions-winner.png"')
    .replace('imageUrl: "/event-img/ai-robotics.jpg"', 'imageUrl: "/illustrations/oso/laptop-exploerer.png"')
)
patch_text("components/landing/clean/OsoJourneyIllustration.tsx", lambda text: text.replace(
'''const MOUNTAIN_ASSET_PATHS = [\n  "/illustrations/oso/kaggle-mountain-climb.png",\n  "/illustrations/kaggle-mountain-climb.png",\n  "/illustrations/kaggle-mountain-climb-transparent-clean.png",\n];''',
'''const MOUNTAIN_ASSET_PATHS = ["/illustrations/oso/kaggle-mountain-climb.png"];'''
))
patch_text("data/eventHero.ts", lambda text: text
    .replace('posterImage: "/events/silicon-skillathon-event.jpg"', 'posterImage: "/posters/poster1.jpg"')
    .replace('posterImage: "/events/hackathon-arena.jpg"', 'posterImage: "/posters/poster2.jpg"')
    .replace('posterImage: "/events/embedded-systems-sprint.jpg"', 'posterImage: "/illustrations/oso/benchmark-environment.png"')
    .replace('posterImage: "/events/vlsi-design-championship.jpg"', 'posterImage: "/posters/poster3.jpg"')
    .replace('posterImage: "/events/ai-robotics-arena.jpg"', 'posterImage: "/illustrations/oso/laptop-exploerer.png"')
    .replace('posterImage: "/events/worldskills-preparation.jpg"', 'posterImage: "/illustrations/oso/competitions-winner.png"')
)

write("scripts/integrity-audit.mjs", r'''
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
''')

write("scripts/promote-admins.mjs", r'''
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function main() {
  const emails = getAdminEmails();

  if (emails.length === 0) {
    throw new Error("ADMIN_EMAILS is empty. Add one or more comma-separated admin emails first.");
  }

  const result = await prisma.user.updateMany({
    where: {
      email: {
        in: emails,
        mode: "insensitive",
      },
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`Promoted ${result.count} existing user(s) to ADMIN.`);

  if (result.count === 0) {
    console.log("No matching users found yet. Sign in once with the admin Google account, then run this again.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
''')

# Improve hosting audit with safer env checks while preserving existing behavior.
def harden_hosting_audit(text: str) -> str:
    if "function safeUrl(value)" in text:
        return text
    return text.replace(
'''requireOne("SUPABASE_SERVICE_ROLE_KEY");''',
'''requireOne("SUPABASE_SERVICE_ROLE_KEY");

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

const databaseUrl = process.env.DATABASE_URL || "";
const directUrl = process.env.DIRECT_URL || "";
const supabaseUrl = process.env.SUPABASE_URL || "";

if (databaseUrl.startsWith("https://") || databaseUrl.includes("/rest/v1")) {
  fail("DATABASE_URL must be a PostgreSQL connection string, not a Supabase REST/API URL.");
}

if (directUrl.startsWith("https://") || directUrl.includes("/rest/v1")) {
  fail("DIRECT_URL must be a direct PostgreSQL connection string, not a Supabase REST/API URL.");
}

if (databaseUrl && !databaseUrl.includes("pgbouncer=true")) {
  warn("DATABASE_URL should use the pooler URL with pgbouncer=true for serverless hosting.");
}

if (databaseUrl && !databaseUrl.includes("connection_limit=")) {
  warn("DATABASE_URL should include connection_limit=1 or connection_limit=2 to avoid pool exhaustion on hosting.");
}

const parsedSupabaseUrl = safeUrl(supabaseUrl);

if (supabaseUrl && (!parsedSupabaseUrl || parsedSupabaseUrl.protocol !== "https:")) {
  fail("SUPABASE_URL must be an HTTPS Project API URL like https://xxxx.supabase.co.");
}

if (supabaseUrl && (supabaseUrl.includes("/rest/v1") || supabaseUrl.includes(":5432") || supabaseUrl.includes(":6543") || supabaseUrl.includes("pooler") || supabaseUrl.includes("postgres"))) {
  fail("SUPABASE_URL must be the Project API URL only. Do not paste database, pooler, or /rest/v1 URLs here.");
}

for (const key of ["NEXTAUTH_URL", "NEXT_PUBLIC_APP_URL"]) {
  if (process.env[key] && !safeUrl(process.env[key])) {
    fail(`${key} must be a valid absolute URL.`);
  }
}'''
    )

patch_text("scripts/hosting-audit.mjs", harden_hosting_audit)

# Package scripts.
package_path = ROOT / "package.json"
backup_file(package_path)
pkg = json.loads(package_path.read_text(encoding="utf-8"))
scripts = pkg.setdefault("scripts", {})
scripts["lint"] = "eslint ."
scripts["typecheck"] = "tsc --noEmit"
scripts["audit:integrity"] = "node scripts/integrity-audit.mjs"
scripts["preflight:hosting"] = "node scripts/hosting-audit.mjs && node scripts/integrity-audit.mjs"
scripts["build:hosting"] = "npm run preflight:hosting && prisma generate && next build"
scripts["admin:promote"] = "node scripts/promote-admins.mjs"
package_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")
print("[patch] package.json")

# Env example.
patch_text(".env.example", lambda text: re.sub(
    r'DATABASE_URL="[^"]+"',
    'DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20"',
    text,
).replace(
    'DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"',
    'DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"',
))

print("\nHardening patch applied. Next run:")
print("  npm run audit:integrity")
print("  npm run typecheck")
print("  npm run build:hosting")
