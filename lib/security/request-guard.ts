import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

type JsonReadResult =
  | { data: Record<string, unknown>; response: null }
  | { data: null; response: NextResponse };

const globalRateLimit = globalThis as typeof globalThis & {
  __osoRateLimit?: Map<string, Bucket>;
  __osoRateLimitSweep?: number;
};

const MAX_BUCKETS = 10_000;
const DEFAULT_JSON_LIMIT = 64 * 1024;

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
    if (bucket.resetAt <= now) buckets.delete(key);
  }

  if (buckets.size > MAX_BUCKETS) {
    const overflow = buckets.size - MAX_BUCKETS;
    for (const key of [...buckets.keys()].slice(0, overflow)) buckets.delete(key);
  }
}

export function getRequestId(request?: Request) {
  const incoming = request?.headers.get("x-request-id")?.trim();
  return incoming && incoming.length <= 128 ? incoming : randomUUID();
}

function noStore(data: unknown, init?: ResponseInit, requestId?: string) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...(requestId ? { "X-Request-Id": requestId } : {}),
      ...(init?.headers ?? {}),
    },
  });
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

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
    if (process.env.NODE_ENV !== "production") allowed.add(`http://${host}`);
  }

  for (const candidate of [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.AUTH_URL,
  ]) {
    if (!candidate) continue;
    try {
      allowed.add(new URL(candidate).origin);
    } catch {
      // Environment validation reports malformed URLs separately.
    }
  }

  return allowed;
}

export function rejectCrossSiteMutation(request: Request) {
  const method = request.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return null;

  const requestId = getRequestId(request);
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return noStore(
      { ok: false, success: false, error: "Cross-site request blocked.", code: "CROSS_SITE_BLOCKED", requestId },
      { status: 403 },
      requestId,
    );
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    if (process.env.NODE_ENV === "production") {
      return noStore(
        { ok: false, success: false, error: "Request origin is required.", code: "ORIGIN_REQUIRED", requestId },
        { status: 403 },
        requestId,
      );
    }
    return null;
  }

  if (!getAllowedOrigins(request).has(origin)) {
    return noStore(
      { ok: false, success: false, error: "Invalid request origin.", code: "INVALID_ORIGIN", requestId },
      { status: 403 },
      requestId,
    );
  }

  return null;
}

export function enforceJsonContentType(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.startsWith("application/json")) return null;

  const requestId = getRequestId(request);
  return noStore(
    { ok: false, success: false, error: "Content-Type must be application/json.", code: "UNSUPPORTED_MEDIA_TYPE", requestId },
    { status: 415 },
    requestId,
  );
}

export function enforceContentLength(request: Request, maxBytes: number) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return null;

  const parsed = Number(contentLength);
  const requestId = getRequestId(request);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return noStore(
      { ok: false, success: false, error: "Invalid Content-Length header.", code: "INVALID_CONTENT_LENGTH", requestId },
      { status: 400 },
      requestId,
    );
  }

  if (parsed > maxBytes) {
    return noStore(
      { ok: false, success: false, error: "Request payload is too large.", code: "PAYLOAD_TOO_LARGE", requestId },
      { status: 413 },
      requestId,
    );
  }

  return null;
}

export async function readJsonObjectWithLimit(
  request: Request,
  maxBytes = DEFAULT_JSON_LIMIT,
): Promise<JsonReadResult> {
  const requestId = getRequestId(request);
  const declared = enforceContentLength(request, maxBytes);
  if (declared) return { data: null, response: declared };

  let bytes: ArrayBuffer;
  try {
    bytes = await request.arrayBuffer();
  } catch {
    return {
      data: null,
      response: noStore(
        { ok: false, success: false, error: "Unable to read request body.", code: "BODY_READ_FAILED", requestId },
        { status: 400 },
        requestId,
      ),
    };
  }

  if (bytes.byteLength > maxBytes) {
    return {
      data: null,
      response: noStore(
        { ok: false, success: false, error: "Request payload is too large.", code: "PAYLOAD_TOO_LARGE", requestId },
        { status: 413 },
        requestId,
      ),
    };
  }

  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid object");
    return { data: parsed as Record<string, unknown>, response: null };
  } catch {
    return {
      data: null,
      response: noStore(
        { ok: false, success: false, error: "Invalid JSON body.", code: "INVALID_JSON", requestId },
        { status: 400 },
        requestId,
      ),
    };
  }
}

export function enforceRateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs: number,
  subject?: string,
) {
  const buckets = getBuckets();
  const now = Date.now();
  pruneExpiredBuckets(buckets, now);

  const identity = subject?.trim() || getClientIp(request);
  const bucketKey = `${key}:${identity}`;
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    const requestId = getRequestId(request);
    return noStore(
      { ok: false, success: false, error: "Too many requests. Try again shortly.", code: "RATE_LIMITED", requestId },
      { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Limit": String(limit), "X-RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1000)) } },
      requestId,
    );
  }

  return null;
}

export function noStoreJson(data: unknown, init?: ResponseInit, requestId?: string) {
  return noStore(data, init, requestId);
}
