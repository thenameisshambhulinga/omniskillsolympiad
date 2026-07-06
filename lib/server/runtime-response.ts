import { NextResponse } from "next/server";

type RuntimeSuccessPayload<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

type RuntimeErrorPayload = {
  success: false;
  error: string;
  code: string;
  meta?: Record<string, unknown>;
};

export function runtimeSuccess<T>(
  data: T,
  init?: ResponseInit & {
    meta?: Record<string, unknown>;
  },
) {
  const payload: RuntimeSuccessPayload<T> = {
    success: true,
    data,
    ...(init?.meta ? { meta: init.meta } : {}),
  };

  return NextResponse.json(payload, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      ...(init?.headers ?? {}),
    },
  });
}

export function runtimeError(
  error: string,
  options?: {
    status?: number;
    code?: string;
    meta?: Record<string, unknown>;
  },
) {
  const payload: RuntimeErrorPayload = {
    success: false,
    error,
    code: options?.code ?? "RUNTIME_ERROR",
    ...(options?.meta ? { meta: options.meta } : {}),
  };

  return NextResponse.json(payload, {
    status: options?.status ?? 500,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function runtimeUnauthorized(message = "Authentication required") {
  return runtimeError(message, {
    status: 401,
    code: "UNAUTHORIZED",
  });
}

export function runtimeForbidden(message = "Access denied") {
  return runtimeError(message, {
    status: 403,
    code: "FORBIDDEN",
  });
}

export function runtimeBadRequest(message = "Invalid request") {
  return runtimeError(message, {
    status: 400,
    code: "BAD_REQUEST",
  });
}
