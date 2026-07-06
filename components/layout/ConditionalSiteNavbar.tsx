"use client";

import { usePathname } from "next/navigation";

import PublicNavbar from "@/components/public-site/PublicNavbar";
import CompetitionNavbar from "@/components/profile/platform/CompetitionNavbar";
import {
  normalizePathname,
  shouldHideSiteChrome,
} from "@/lib/layout/route-visibility";

export default function ConditionalSiteNavbar() {
  const pathname = usePathname();

  if (shouldHideSiteChrome(pathname)) {
    return null;
  }

  if (normalizePathname(pathname) === "/") {
    return <PublicNavbar />;
  }

  return <CompetitionNavbar />;
}
