export function normalizePathname(pathname: string | null | undefined) {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export function isRouteOrNested(pathname: string, route: string) {
  const normalizedPathname = normalizePathname(pathname);
  const normalizedRoute = normalizePathname(route);

  return (
    normalizedPathname === normalizedRoute ||
    normalizedPathname.startsWith(`${normalizedRoute}/`)
  );
}

export function isImmersiveAssessmentRoute(pathname: string | null | undefined) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/daily-challenges") {
    return false;
  }

  if (normalizedPathname === "/daily-challenges/result") {
    return true;
  }

  if (normalizedPathname.startsWith("/daily-challenges/")) {
    return true;
  }

  if (normalizedPathname.startsWith("/quiz/")) {
    return true;
  }

  return false;
}

export function shouldHideSiteChrome(pathname: string | null | undefined) {
  const normalizedPathname = normalizePathname(pathname);

  const chromeHiddenRoutes = [
    "/admin",
    "/login",
    "/onboarding",
    "/access-restricted",
    "/auth",
    "/database-unavailable",
  ];

  if (isImmersiveAssessmentRoute(normalizedPathname)) {
    return true;
  }

  return chromeHiddenRoutes.some((route) =>
    isRouteOrNested(normalizedPathname, route),
  );
}