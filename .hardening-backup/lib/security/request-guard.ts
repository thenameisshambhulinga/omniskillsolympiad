import { NextResponse } from "next/server";

type Bucket = {
  count: number;
  resetAt: number;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __osoRateLimit?: Map<string, Bucket>;
};

function getBuckets() {
  if (!globalRateLimit.__osoRateLimit) {
    globalRateLimit.__osoRateLimit = new Map<string, Bucket>();
  }

  return globalRateLimit.__osoRateLimit;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function getAllowedOrigins(request: Request) {
  const allowed = new Set<string>();
  const host = request.headers.get("host");

  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL;

  if (appUrl) {
    try {
      allowed.add(new URL(appUrl).origin);
    } catch {
      // Ignore malformed optional env here. Hosting audit catches it.
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
    return NextResponse.json(
      {
        ok: false,
        error: "Cross-site request blocked.",
      },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  if (!getAllowedOrigins(request).has(origin)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request origin.",
      },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
        },
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

    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests. Try again shortly.",
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  return null;
}

export function noStoreJson(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}
