import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import {
  ensurePosterBucket,
  POSTER_STORAGE_BUCKET,
} from "@/lib/storage/supabase-storage";
import {
  enforceRateLimit,
  rejectCrossSiteMutation,
} from "@/lib/security/request-guard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const MIME_TO_EXTENSION = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

function cleanPathPart(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "poster";

  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "poster"
  );
}

function detectImageMime(bytes: Uint8Array) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  if (
    bytes.length >= 16 &&
    String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" &&
    ["avif", "avis"].includes(String.fromCharCode(...bytes.slice(8, 12)))
  ) {
    return "image/avif";
  }

  return "";
}

function posterJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const originRejected = rejectCrossSiteMutation(request);
  if (originRejected) return originRejected;

  const limited = enforceRateLimit(request, "admin-poster-upload", 20, 60_000);
  if (limited) return limited;

  await requireAdmin();

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const placement = cleanPathPart(formData.get("placement"));
    const target = cleanPathPart(formData.get("target"));
    const title = cleanPathPart(formData.get("title"));

    if (!(file instanceof File)) {
      return posterJson(
        {
          ok: false,
          error: "Image file is required.",
        },
        400,
      );
    }

    if (file.size <= 0) {
      return posterJson(
        {
          ok: false,
          error: "Uploaded image is empty.",
        },
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return posterJson(
        {
          ok: false,
          error: "Poster image must be less than 5MB.",
        },
        400,
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const detectedMime = detectImageMime(bytes);
    const extension = MIME_TO_EXTENSION.get(detectedMime);

    if (!extension) {
      return posterJson(
        {
          ok: false,
          error: "Only real JPG, PNG, WEBP and AVIF images are allowed.",
        },
        400,
      );
    }

    const supabase = await ensurePosterBucket();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const storagePath = [
      "posters",
      String(year),
      month,
      placement,
      `${Date.now()}-${title}-${target}-${crypto.randomUUID()}.${extension}`,
    ].join("/");

    const { error } = await supabase.storage
      .from(POSTER_STORAGE_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: detectedMime,
        cacheControl: "31536000",
        upsert: false,
      });

    if (error) {
      console.error("[poster-assets] Supabase upload failed:", {
        bucket: POSTER_STORAGE_BUCKET,
        storagePath,
        message: error.message,
      });

      return posterJson(
        {
          ok: false,
          error: `Supabase upload failed: ${error.message}`,
        },
        500,
      );
    }

    const { data } = supabase.storage
      .from(POSTER_STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    return posterJson(
      {
        ok: true,
        publicUrl: data.publicUrl,
        storagePath,
        bucket: POSTER_STORAGE_BUCKET,
        size: file.size,
        contentType: detectedMime,
      },
      201,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Poster upload failed.";

    console.error("[poster-assets] Upload route crashed:", message);

    return posterJson(
      {
        ok: false,
        error: message,
      },
      500,
    );
  }
}
