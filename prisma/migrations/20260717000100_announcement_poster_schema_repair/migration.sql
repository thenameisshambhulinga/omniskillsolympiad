-- Production-safe reconciliation for AnnouncementPoster fields that existed in
-- schema.prisma before migration history was baselined.
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "shortDescription" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "about" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "eligibility" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "benefits" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "rules" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "faq" TEXT NOT NULL DEFAULT '';
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "venue" TEXT;
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "registrationUrl" TEXT;
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "registrationDeadline" TIMESTAMP(3);
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "eventStart" TIMESTAMP(3);
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "eventEnd" TIMESTAMP(3);
ALTER TABLE "AnnouncementPoster" ADD COLUMN IF NOT EXISTS "gallery" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "AnnouncementPoster"
SET "slug" = lower(regexp_replace(coalesce(nullif("title", ''), 'announcement'), '[^a-zA-Z0-9]+', '-', 'g'))
  || '-' || substr(md5("id"), 1, 8)
WHERE "slug" IS NULL OR btrim("slug") = '';

ALTER TABLE "AnnouncementPoster" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "AnnouncementPoster_slug_key" ON "AnnouncementPoster"("slug");
CREATE INDEX IF NOT EXISTS "AnnouncementPoster_slug_idx" ON "AnnouncementPoster"("slug");
