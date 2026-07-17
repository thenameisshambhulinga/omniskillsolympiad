"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_HOME_ROUTES = new Set(["/"]);
const AUTH_ROUTES = new Set(["/login", "/auth/continue", "/onboarding", "/onboarding/success"]);

function resolveVisualScope(pathname: string): string {
  if (PUBLIC_HOME_ROUTES.has(pathname)) return "public-home";
  if (pathname.startsWith("/admin") || pathname === "/competition-control") return "admin";
  if (pathname.startsWith("/quiz") || pathname.startsWith("/daily-challenges/")) return "assessment";
  if (AUTH_ROUTES.has(pathname)) return "auth";
  return "platform";
}

export default function RouteVisualScope() {
  const pathname = usePathname();

  useEffect(() => {
    const scope = resolveVisualScope(pathname);
    const body = document.body;

    body.dataset.osoVisualScope = scope;
    body.classList.toggle("oso-public-home-route", scope === "public-home");
    body.classList.toggle("oso-application-route", scope !== "public-home");

    return () => {
      delete body.dataset.osoVisualScope;
      body.classList.remove("oso-public-home-route", "oso-application-route");
    };
  }, [pathname]);

  return null;
}
