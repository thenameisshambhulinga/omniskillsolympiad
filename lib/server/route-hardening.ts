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
