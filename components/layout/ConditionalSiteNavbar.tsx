"use client";

import { usePathname } from "next/navigation";

import CompetitionNavbar from "@/components/profile/platform/CompetitionNavbar";
import { shouldHideSiteChrome } from "@/lib/layout/route-visibility";

export default function ConditionalSiteNavbar() {
  const pathname = usePathname();

  if (shouldHideSiteChrome(pathname)) {
    return null;
  }

  return <CompetitionNavbar />;
}