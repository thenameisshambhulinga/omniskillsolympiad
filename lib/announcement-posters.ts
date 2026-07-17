import { prisma } from "@/lib/prisma";
import { classifyInfrastructureError } from "@/lib/server/connectivity-errors";
import { logInfrastructureWarning } from "@/lib/server/rate-limited-log";

export type PublicAnnouncementPoster = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  ctaLabel: string;
  ctaHref: string;
  placement: string;
  priority: number;
  isHero: boolean;
  highlights: string[];
};

let cachedPosters: PublicAnnouncementPoster[] = [];
let cacheExpiresAt = 0;
let retryAfter = 0;

const SUCCESS_TTL_MS = 60_000;
const FAILURE_BACKOFF_MS = 30_000;

export async function getPublishedAnnouncementPosters(): Promise<PublicAnnouncementPoster[]> {
  const currentTime = Date.now();

  if (currentTime < cacheExpiresAt) {
    return cachedPosters;
  }

  if (currentTime < retryAfter) {
    return cachedPosters;
  }

  try {
    const now = new Date();
    const posters = await prisma.announcementPoster.findMany({
      where: {
        isPublished: true,
        publishAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: [{ isHero: "desc" }, { priority: "desc" }, { createdAt: "desc" }],
      take: 24,
    });

    cachedPosters = posters.map((poster) => ({
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
      highlights: normalizeHighlights(poster.highlights),
    }));
    cacheExpiresAt = currentTime + SUCCESS_TTL_MS;
    retryAfter = 0;
    return cachedPosters;
  } catch (error) {
    retryAfter = currentTime + FAILURE_BACKOFF_MS;
    const failure = classifyInfrastructureError(error);
    logInfrastructureWarning(
      `announcement-posters:${failure}`,
      "Announcement posters temporarily unavailable; serving cached/fallback content.",
      { failure, retryInMs: FAILURE_BACKOFF_MS },
    );
    return cachedPosters;
  }
}

function normalizeHighlights(value: string | null | undefined): string[] {
  if (!value) return [];
  return value.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 6);
}
