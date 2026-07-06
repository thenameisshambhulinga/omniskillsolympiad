"use client";

import { usePathname } from "next/navigation";

import PublicFooter from "@/components/public-site/PublicFooter";
import SiteFooter from "@/components/layout/SiteFooter";
import {
  normalizePathname,
  shouldHideSiteChrome,
} from "@/lib/layout/route-visibility";

export default function ConditionalSiteFooter() {
  const pathname = usePathname();

  if (shouldHideSiteChrome(pathname)) {
    return null;
  }

  if (normalizePathname(pathname) === "/") {
    return <PublicFooter />;
  }

  return <SiteFooter />;
}
