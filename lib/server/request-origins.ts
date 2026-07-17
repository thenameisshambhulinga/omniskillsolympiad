import "server-only";

import { headers } from "next/headers";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() ?? "";
}

function addUrlOrigin(origins: Set<string>, value: string | undefined) {
  if (!value) {
    return;
  }

  try {
    origins.add(new URL(value).origin);
  } catch {
   
  }
}

export async function getTrustedRequestOrigins() {
  const requestHeaders = await headers();
  const origins = new Set<string>();

  const host = firstHeaderValue(
    requestHeaders.get("x-forwarded-host") ??
      requestHeaders.get("host"),
  );

  const forwardedProtocol = firstHeaderValue(
    requestHeaders.get("x-forwarded-proto"),
  );

  const protocol =
    forwardedProtocol ||
    (process.env.NODE_ENV === "development" ? "http" : "https");

  if (host) {
    try {
      origins.add(new URL(`${protocol}://${host}`).origin);
    } catch {
     
    }
  }

  addUrlOrigin(origins, process.env.NEXT_PUBLIC_APP_URL);
  addUrlOrigin(origins, process.env.NEXTAUTH_URL);
  addUrlOrigin(origins, process.env.AUTH_URL);

  return Array.from(origins);
}
