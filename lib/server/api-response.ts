import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

type ApiSuccessPayload = Record<string, unknown>;

type ApiErrorPayload = {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
  requestId: string;
};

function secureHeaders(requestId: string, headers?: HeadersInit) {
  const merged = new Headers(headers);
  merged.set("Cache-Control", "no-store, max-age=0");
  merged.set("Pragma", "no-cache");
  merged.set("X-Content-Type-Options", "nosniff");
  merged.set("X-Request-Id", requestId);
  return merged;
}

export function apiOk<TPayload extends ApiSuccessPayload>(
  payload: TPayload,
  init?: ResponseInit,
  requestId = randomUUID(),
) {
  return NextResponse.json(
    { success: true, ...payload, requestId },
    { ...init, headers: secureHeaders(requestId, init?.headers) },
  );
}

export function apiError(
  error: string,
  status = 500,
  code?: string,
  details?: unknown,
  requestId = randomUUID(),
) {
  const payload: ApiErrorPayload = { success: false, error, requestId };
  if (code) payload.code = code;
  if (typeof details !== "undefined" && process.env.NODE_ENV !== "production") payload.details = details;

  return NextResponse.json(payload, {
    status,
    headers: secureHeaders(requestId),
  });
}

export async function readJsonObject(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { data: null, response: apiError("Invalid request body.", 400, "INVALID_BODY") };
    }
    return { data: body as Record<string, unknown>, response: null };
  } catch {
    return { data: null, response: apiError("Invalid JSON body.", 400, "INVALID_JSON") };
  }
}

export function cleanString(value: unknown, maxLength = 2000) {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return String(value).trim().slice(0, maxLength);
}

export function cleanNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
