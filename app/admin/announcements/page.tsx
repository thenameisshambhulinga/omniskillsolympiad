import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AnnouncementPosterManager, {
  type SerializedPoster,
} from "@/components/admin/announcements/AnnouncementPosterManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function serializePoster(poster: {
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
  isPublished: boolean;
  publishAt: Date;
  expiresAt: Date | null;
  highlights: string;
  createdAt: Date;
  updatedAt: Date;
}): SerializedPoster {
  return {
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
    expiresAt: poster.expiresAt ? poster.expiresAt.toISOString() : null,
    highlights: poster.highlights,
    createdAt: poster.createdAt.toISOString(),
    updatedAt: poster.updatedAt.toISOString(),
  };
}

export default async function AdminAnnouncementsPage() {
  await requireAdmin();

  let posters: SerializedPoster[] = [];
  let databaseError = "";

  try {
    const records = await prisma.announcementPoster.findMany({
      orderBy: [
        {
          isHero: "desc",
        },
        {
          isPublished: "desc",
        },
        {
          priority: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        subtitle: true,
        category: true,
        status: true,
        imageUrl: true,
        mobileImageUrl: true,
        ctaLabel: true,
        ctaHref: true,
        placement: true,
        priority: true,
        isHero: true,
        isPublished: true,
        publishAt: true,
        expiresAt: true,
        highlights: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    posters = records.map(serializePoster);
  } catch (error) {
    databaseError =
      error instanceof Error
        ? error.message
        : "Unable to load announcement posters.";
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      {databaseError ? (
        <section className="mx-auto mb-6 max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
          {databaseError}
        </section>
      ) : null}

      <AnnouncementPosterManager initialPosters={posters} />
    </main>
  );
}
