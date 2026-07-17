const INTERNAL_BASE_URL = "https://oso.internal";

const MEMBER_DESTINATION_PREFIXES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/daily-challenges",
  "/daily-leaderboard",
  "/daily-quizzes",
  "/quiz",
  "/competition",
  "/leaderboard",
  "/skill-championships",
  "/worldskills",
] as const;

const ADMIN_DESTINATION_PREFIXES = [
  "/admin",
  "/competition-control",
] as const;

const MAX_DESTINATION_LENGTH = 2048;

export const DEFAULT_MEMBER_DESTINATION = "/dashboard";
export const DEFAULT_ADMIN_DESTINATION = "/admin";

type DestinationOptions = {
  allowedOrigins?: readonly string[];
  fallback?: string;
};

type ParsedDestination = {
  href: string;
  pathname: string;
  searchParams: URLSearchParams;
};

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isMemberDestination(pathname: string) {
  return MEMBER_DESTINATION_PREFIXES.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  );
}

function isAdminDestination(pathname: string) {
  return ADMIN_DESTINATION_PREFIXES.some((prefix) =>
    matchesRoutePrefix(pathname, prefix),
  );
}

function parseDestination(
  value: string | null | undefined,
  allowedOrigins: readonly string[] = [],
): ParsedDestination | null {
  if (typeof value !== "string") {
    return null;
  }

  const candidate = value.trim();

  if (
    candidate.length === 0 ||
    candidate.length > MAX_DESTINATION_LENGTH ||
    candidate.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(candidate)
  ) {
    return null;
  }

  let parsedUrl: URL;

  try {
    if (candidate.startsWith("/") && !candidate.startsWith("//")) {
      parsedUrl = new URL(candidate, INTERNAL_BASE_URL);
    } else {
      parsedUrl = new URL(candidate);

      if (!allowedOrigins.includes(parsedUrl.origin)) {
        return null;
      }
    }
  } catch {
    return null;
  }

  if (
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.pathname.startsWith("/api")
  ) {
    return null;
  }

  return {
    href: `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`,
    pathname: parsedUrl.pathname,
    searchParams: parsedUrl.searchParams,
  };
}

function sanitizeKnownDestination(
  value: string | null | undefined,
  options: DestinationOptions = {},
) {
  const fallback = options.fallback ?? DEFAULT_MEMBER_DESTINATION;
  const parsed = parseDestination(value, options.allowedOrigins);

  if (!parsed) {
    return fallback;
  }

  if (
    !isMemberDestination(parsed.pathname) &&
    !isAdminDestination(parsed.pathname)
  ) {
    return fallback;
  }

  return parsed.href;
}

export function sanitizeMemberDestination(
  value: string | null | undefined,
  options: DestinationOptions = {},
) {
  const fallback = options.fallback ?? DEFAULT_MEMBER_DESTINATION;
  const parsed = parseDestination(value, options.allowedOrigins);

  if (!parsed || !isMemberDestination(parsed.pathname)) {
    return fallback;
  }

  return parsed.href;
}

export function sanitizeAdminDestination(
  value: string | null | undefined,
  options: DestinationOptions = {},
) {
  const fallback = options.fallback ?? DEFAULT_ADMIN_DESTINATION;
  const parsed = parseDestination(value, options.allowedOrigins);

  if (!parsed || !isAdminDestination(parsed.pathname)) {
    return fallback;
  }

  return parsed.href;
}

export function extractRequestedDestination(
  value: string | null | undefined,
  options: DestinationOptions = {},
) {
  const fallback = options.fallback ?? DEFAULT_MEMBER_DESTINATION;
  const parsed = parseDestination(value, options.allowedOrigins);

  if (!parsed) {
    return fallback;
  }

  if (parsed.pathname === "/auth/continue") {
    const nestedDestination =
      parsed.searchParams.get("destination") ??
      parsed.searchParams.get("callbackUrl");

    return sanitizeKnownDestination(nestedDestination, {
      allowedOrigins: options.allowedOrigins,
      fallback,
    });
  }

  return sanitizeKnownDestination(parsed.href, {
    allowedOrigins: options.allowedOrigins,
    fallback,
  });
}

export function buildAuthContinueHref(
  destination?: string | null,
) {
  const safeDestination = sanitizeKnownDestination(destination);

  const params = new URLSearchParams({
    destination: safeDestination,
  });

  return `/auth/continue?${params.toString()}`;
}

export function buildLoginHref(
  destination?: string | null,
  reason?: string,
) {
  const params = new URLSearchParams({
    callbackUrl: buildAuthContinueHref(destination),
  });

  if (reason) {
    params.set("reason", reason);
  }

  return `/login?${params.toString()}`;
}

export function buildOnboardingHref(
  destination?: string | null,
  editMode = false,
) {
  const params = new URLSearchParams();

  if (editMode) {
    params.set("edit", "passport");
  }

  params.set(
    "returnTo",
    sanitizeMemberDestination(destination),
  );

  return `/onboarding?${params.toString()}`;
}
