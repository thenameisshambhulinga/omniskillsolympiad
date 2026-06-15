import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    posterId: string;
  }>;
};

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);
  return text.length ? text : null;
}

function cleanNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? Math.round(numberValue) : 0;
}

function cleanDate(value: unknown) {
  const text = cleanText(value);
  if (!text) return null;

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isValidUrlOrPath(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

function validatePosterPayload(body: Record<string, unknown>) {
  const title = cleanText(body.title);
  const subtitle = cleanText(body.subtitle);
  const category = cleanText(body.category);
  const status = cleanText(body.status);
  const imageUrl = cleanText(body.imageUrl);
  const ctaLabel = cleanText(body.ctaLabel);
  const ctaHref = cleanText(body.ctaHref);

  if (
    !title ||
    !subtitle ||
    !category ||
    !status ||
    !imageUrl ||
    !ctaLabel ||
    !ctaHref
  ) {
    return {
      error:
        "Title, subtitle, category, status, image URL, CTA label and CTA link are required.",
      data: null,
    };
  }

  if (!isValidUrlOrPath(imageUrl)) {
    return {
      error: "Image URL must start with /, http://, or https://",
      data: null,
    };
  }

  if (!isValidUrlOrPath(ctaHref)) {
    return {
      error: "CTA link must start with /, http://, or https://",
      data: null,
    };
  }

  const publishAt = cleanDate(body.publishAt) ?? new Date();
  const expiresAt = cleanDate(body.expiresAt);

  if (expiresAt && expiresAt <= publishAt) {
    return {
      error: "Expiry date must be after publish date.",
      data: null,
    };
  }

  return {
    error: "",
    data: {
      title,
      subtitle,
      category,
      status,
      imageUrl,
      mobileImageUrl: cleanOptionalText(body.mobileImageUrl),
      ctaLabel,
      ctaHref,
      placement: cleanText(body.placement) || "LOGIN_HERO",
      priority: cleanNumber(body.priority),
      isHero: Boolean(body.isHero),
      isPublished: Boolean(body.isPublished),
      publishAt,
      expiresAt,
      highlights: cleanText(body.highlights),
    },
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  const { posterId } = await context.params;
  const body = await request.json();

  const existingPoster = await prisma.announcementPoster.findUnique({
    where: {
      id: posterId,
    },
  });

  if (!existingPoster) {
    return NextResponse.json(
      {
        error: "Poster not found.",
      },
      {
        status: 404,
      },
    );
  }

  const validation = validatePosterPayload(body);

  if (!validation.data) {
    return NextResponse.json(
      {
        error: validation.error,
      },
      {
        status: 400,
      },
    );
  }

  const poster = await prisma.announcementPoster.update({
    where: {
      id: posterId,
    },
    data: validation.data,
  });

  if (poster.isHero && poster.isPublished) {
    await prisma.announcementPoster.updateMany({
      where: {
        id: {
          not: poster.id,
        },
        isHero: true,
      },
      data: {
        isHero: false,
      },
    });
  }

  return NextResponse.json({
    poster: {
      ...poster,
      publishAt: poster.publishAt.toISOString(),
      expiresAt: poster.expiresAt?.toISOString() ?? null,
      createdAt: poster.createdAt.toISOString(),
      updatedAt: poster.updatedAt.toISOString(),
    },
    updatedBy: admin.email,
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdmin();
  const { posterId } = await context.params;

  const existingPoster = await prisma.announcementPoster.findUnique({
    where: {
      id: posterId,
    },
  });

  if (!existingPoster) {
    return NextResponse.json(
      {
        error: "Poster not found.",
      },
      {
        status: 404,
      },
    );
  }

  await prisma.announcementPoster.delete({
    where: {
      id: posterId,
    },
  });

  return NextResponse.json({
    success: true,
    deletedBy: admin.email,
  });
}