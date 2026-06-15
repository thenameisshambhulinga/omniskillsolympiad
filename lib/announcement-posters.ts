import { prisma } from "@/lib/prisma";

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

export async function getPublishedAnnouncementPosters() {
  const now = new Date();

  const posters = await prisma.announcementPoster.findMany({
    where: {
      isPublished: true,
      publishAt: {
        lte: now,
      },
      OR: [
        {
          expiresAt: null,
        },
        {
          expiresAt: {
            gte: now,
          },
        },
      ],
    },
    orderBy: [
      {
        isHero: "desc",
      },
      {
        priority: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 10,
  });

  return posters.map((poster) => ({
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
    highlights: poster.highlights
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  }));
}