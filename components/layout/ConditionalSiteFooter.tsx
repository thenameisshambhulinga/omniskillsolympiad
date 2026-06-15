"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/layout/SiteFooter";

const hiddenFooterRoutes = [
  "/admin",
  "/login",
  "/onboarding",
  "/access-restricted",
  "/auth",
];

export default function ConditionalSiteFooter() {
  const pathname = usePathname();

  const shouldHide = hiddenFooterRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (shouldHide) return null;

  return <SiteFooter />;
}