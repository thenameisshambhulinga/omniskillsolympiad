import { NextResponse } from "next/server";

type ApiSuccessPayload = Record<string, unknown>;

type ApiErrorPayload = {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
};

export function apiOk<TPayload extends ApiSuccessPayload>(
  payload: TPayload,
  init?: ResponseInit,
) {
  return NextResponse.json(
    {
      success: true,
      ...payload,
    },
    init,
  );
}

export function apiError(
  error: string,
  status = 500,
  code?: string,
  details?: unknown,
) {
  const payload: ApiErrorPayload = {
    success: false,
    error,
  };

  if (code) {
    payload.code = code;
  }

  if (typeof details !== "undefined") {
    payload.details = details;
  }

  return NextResponse.json(payload, {
    status,
  });
}

export async function readJsonObject(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        data: null,
        response: apiError("Invalid request body.", 400, "INVALID_BODY"),
      };
    }

    return {
      data: body as Record<string, unknown>,
      response: null,
    };
  } catch {
    return {
      data: null,
      response: apiError("Invalid JSON body.", 400, "INVALID_JSON"),
    };
  }
}

export function cleanString(value: unknown, maxLength = 2000) {
  if (typeof value !== "string" && typeof value !== "number") {
    return "";
  }

  return String(value).trim().slice(0, maxLength);
}

export function cleanNumber(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}