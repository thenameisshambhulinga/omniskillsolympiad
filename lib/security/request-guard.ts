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
