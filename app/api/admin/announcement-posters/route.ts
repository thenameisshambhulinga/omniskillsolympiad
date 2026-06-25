import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PosterPayload = {
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
};

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);
  return text.length > 0 ? text : null;
}

function cleanNumber(value: unknown) {
  const valueAsNumber = Number(value);

  if (!Number.isFinite(valueAsNumber)) {
    return 0;
  }

  return Math.max(-999, Math.min(999, Math.round(valueAsNumber)));
}

function cleanDate(value: unknown) {
  const text = cleanText(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isValidUrlOrPath(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

function normalizePlacement(value: unknown) {
  const placement = cleanText(value).toUpperCase();

  return placement || "LOGIN_HERO";
}

function validatePosterPayload(body: Record<string, unknown>):
  | {
      ok: true;
      data: PosterPayload;
    }
  | {
      ok: false;
      error: string;
    } {
  const title = cleanText(body.title);
  const subtitle = cleanText(body.subtitle);
  const category = cleanText(body.category);
  const status = cleanText(body.status);
  const imageUrl = cleanText(body.imageUrl);
  const mobileImageUrl = cleanOptionalText(body.mobileImageUrl);
  const ctaLabel = cleanText(body.ctaLabel);
  const ctaHref = cleanText(body.ctaHref);
  const placement = normalizePlacement(body.placement);
  const highlights = cleanText(body.highlights);

  if (!title) return { ok: false, error: "Title is required." };
  if (!subtitle) return { ok: false, error: "Subtitle is required." };
  if (!category) return { ok: false, error: "Category is required." };
  if (!status) return { ok: false, error: "Status is required." };
  if (!imageUrl) return { ok: false, error: "Image URL is required." };
  if (!ctaLabel) return { ok: false, error: "CTA label is required." };
  if (!ctaHref) return { ok: false, error: "CTA link is required." };

  if (!isValidUrlOrPath(imageUrl)) {
    return {
      ok: false,
      error: "Image URL must start with /, http://, or https://",
    };
  }

  if (mobileImageUrl && !isValidUrlOrPath(mobileImageUrl)) {
    return {
      ok: false,
      error: "Mobile image URL must start with /, http://, or https://",
    };
  }

  if (!isValidUrlOrPath(ctaHref)) {
    return {
      ok: false,
      error: "CTA link must start with /, http://, or https://",
    };
  }

  const publishAt = cleanDate(body.publishAt) ?? new Date();
  const expiresAt = cleanDate(body.expiresAt);

  if (expiresAt && expiresAt <= publishAt) {
    return {
      ok: false,
      error: "Expiry date must be after publish date.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      subtitle,
      category,
      status,
      imageUrl,
      mobileImageUrl,
      ctaLabel,
      ctaHref,
      placement,
      priority: cleanNumber(body.priority),
      isHero: Boolean(body.isHero),
      isPublished: Boolean(body.isPublished),
      publishAt,
      expiresAt,
      highlights,
    },
  };
}

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
}) {
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
    expiresAt: poster.expiresAt?.toISOString() ?? null,
    highlights: poster.highlights,
    createdAt: poster.createdAt.toISOString(),
    updatedAt: poster.updatedAt.toISOString(),
  };
}

export async function GET() {
  await requireAdmin();

  const posters = await prisma.announcementPoster.findMany({
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
  });

  return NextResponse.json(
    {
      ok: true,
      posters: posters.map(serializePoster),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin();

  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid JSON body.",
      },
      {
        status: 400,
      },
    );
  }

  const validation = validatePosterPayload(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: validation.error,
      },
      {
        status: 400,
      },
    );
  }

  const poster = await prisma.$transaction(async (tx) => {
    const createdPoster = await tx.announcementPoster.create({
      data: validation.data,
    });

    if (createdPoster.isHero && createdPoster.isPublished) {
      await tx.announcementPoster.updateMany({
        where: {
          id: {
            not: createdPoster.id,
          },
          isHero: true,
          placement: createdPoster.placement,
        },
        data: {
          isHero: false,
        },
      });
    }

    return createdPoster;
  });

  return NextResponse.json(
    {
      ok: true,
      poster: serializePoster(poster),
      createdBy: admin.email,
    },
    {
      status: 201,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}