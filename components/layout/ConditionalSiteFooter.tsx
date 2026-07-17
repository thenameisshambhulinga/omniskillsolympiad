"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/layout/SiteFooter";
import { shouldHideSiteChrome } from "@/lib/layout/route-visibility";

export default function ConditionalSiteFooter() {
  const pathname = usePathname();

  if (shouldHideSiteChrome(pathname)) {
    return null;
  }

  return <SiteFooter />;
}
