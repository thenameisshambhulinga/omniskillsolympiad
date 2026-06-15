import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

import AnnouncementPosterManager from "./AnnouncementPosterManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const runtime = "nodejs";
export default async function AdminAnnouncementsPage() {
  await requireAdmin();

  const posters = await prisma.announcementPoster.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  const serializedPosters = posters.map((poster) => ({
    id: poster.id,
    title: poster.title,
    subtitle: poster.subtitle,
    category: poster.category,
    status: poster.status,
    imageUrl: poster.imageUrl,
    mobileImageUrl: poster.mobileImageUrl,
    ctaLabel: poster.ctaLabel,
    ctaHref: poster.ctaHref,
    placement: poster.placement,
    priority: poster.priority,
    isHero: poster.isHero,
    isPublished: poster.isPublished,
    publishAt: poster.publishAt.toISOString(),
    expiresAt: poster.expiresAt?.toISOString() ?? null,
    highlights: poster.highlights,
    createdAt: poster.createdAt.toISOString(),
    updatedAt: poster.updatedAt.toISOString(),
  }));

  return <AnnouncementPosterManager initialPosters={serializedPosters} />;
}