// file location - components/admin/announcements/AnnouncementPosterManager.tsx
"use client";

import type { ReactNode } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Edit3,
  ExternalLink,
  Eye,
  ImageIcon,
  ImageOff,
  Loader2,
  Megaphone,
  RefreshCcw,
  Save,
  ShieldCheck,
  Star,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

export type SerializedPoster = {
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
  publishAt: string;
  expiresAt: string | null;
  highlights: string;
  createdAt: string;
  updatedAt: string;
};

type PosterFormState = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  imageUrl: string;
  mobileImageUrl: string;
  ctaLabel: string;
  ctaHref: string;
  placement: string;
  priority: string;
  isHero: boolean;
  isPublished: boolean;
  publishAt: string;
  expiresAt: string;
  highlights: string;
};

type Notice = {
  type: "success" | "error";
  text: string;
};

const emptyForm: PosterFormState = {
  id: "",
  title: "",
  subtitle: "",
  category: "Silicon Skillathon",
  status: "LIVE",
  imageUrl: "",
  mobileImageUrl: "",
  ctaLabel: "Explore",
  ctaHref: "/",
  placement: "LOGIN_HERO",
  priority: "0",
  isHero: false,
  isPublished: false,
  publishAt: toInputDate(new Date().toISOString()),
  expiresAt: "",
  highlights: "",
};

function toInputDate(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

function toApiDate(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function posterToForm(poster: SerializedPoster): PosterFormState {
  return {
    id: poster.id,
    title: poster.title,
    subtitle: poster.subtitle,
    category: poster.category,
    status: poster.status,
    imageUrl: poster.imageUrl,
    mobileImageUrl: poster.mobileImageUrl ?? "",
    ctaLabel: poster.ctaLabel,
    ctaHref: poster.ctaHref,
    placement: poster.placement,
    priority: String(poster.priority),
    isHero: poster.isHero,
    isPublished: poster.isPublished,
    publishAt: toInputDate(poster.publishAt),
    expiresAt: toInputDate(poster.expiresAt),
    highlights: poster.highlights ?? "",
  };
}

function posterToPayload(form: PosterFormState) {
  return {
    title: form.title.trim(),
    subtitle: form.subtitle.trim(),
    category: form.category.trim(),
    status: form.status.trim(),
    imageUrl: form.imageUrl.trim(),
    mobileImageUrl: form.mobileImageUrl.trim(),
    ctaLabel: form.ctaLabel.trim(),
    ctaHref: form.ctaHref.trim(),
    placement: form.placement.trim() || "LOGIN_HERO",
    priority: Number(form.priority || 0),
    isHero: form.isHero,
    isPublished: form.isPublished,
    publishAt: toApiDate(form.publishAt) ?? new Date().toISOString(),
    expiresAt: toApiDate(form.expiresAt),
    highlights: form.highlights.trim(),
  };
}

async function parseApiResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

function isValidPathOrUrl(value: string) {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

export default function AnnouncementPosterManager({
  initialPosters,
}: {
  initialPosters: SerializedPoster[];
}) {
  const [posters, setPosters] = useState<SerializedPoster[]>(initialPosters);
  const [form, setForm] = useState<PosterFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingPosters, setLoadingPosters] = useState(false);
  const [deletingPosterId, setDeletingPosterId] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<
    "imageUrl" | "mobileImageUrl" | null
  >(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const livePosterCount = posters.filter((poster) => poster.isPublished).length;
  const heroPoster = posters.find(
    (poster) => poster.isHero && poster.isPublished,
  );

  const activePreviewImage = form.mobileImageUrl || form.imageUrl;

  const parsedHighlights = useMemo(() => {
    return form.highlights
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.highlights]);

  function updateField<K extends keyof PosterFormState>(
    key: K,
    value: PosterFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function uploadPosterAsset(
    target: "imageUrl" | "mobileImageUrl",
    file: File | null,
  ) {
    if (!file) return;

    setUploadingTarget(target);
    setNotice(null);

    try {
      const payload = new FormData();

      payload.append("file", file);
      payload.append("target", target);
      payload.append("placement", form.placement || "GLOBAL");
      payload.append("title", form.title || "poster");

      const response = await fetch("/api/admin/poster-assets", {
        method: "POST",
        body: payload,
      });

      const data = await parseApiResponse(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Poster image upload failed.");
      }

      updateField(target, data.publicUrl);

      setNotice({
        type: "success",
        text:
          target === "imageUrl"
            ? "Desktop image uploaded. You can publish now."
            : "Mobile image uploaded. You can publish now.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Poster image upload failed.",
      });
    } finally {
      setUploadingTarget(null);
    }
  }

  async function refreshPosters() {
    setLoadingPosters(true);

    try {
      const response = await fetch("/api/admin/announcement-posters", {
        cache: "no-store",
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to refresh posters.");
      }

      setPosters(data.posters ?? []);
    } catch (error) {
      setNotice({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to refresh posters.",
      });
    } finally {
      setLoadingPosters(false);
    }
  }

  function validateForm() {
    if (!form.title.trim()) return "Title is required.";
    if (!form.subtitle.trim()) return "Subtitle is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.status.trim()) return "Status is required.";
    if (!form.imageUrl.trim()) {
      return "Upload a desktop poster image before publishing.";
    }
    if (!form.ctaLabel.trim()) return "CTA label is required.";
    if (!form.ctaHref.trim()) return "CTA link is required.";
    if (!form.publishAt.trim()) return "Publish date is required.";

    if (!isValidPathOrUrl(form.imageUrl.trim())) {
      return "Image URL must start with /, http://, or https://";
    }

    if (
      form.mobileImageUrl.trim() &&
      !isValidPathOrUrl(form.mobileImageUrl.trim())
    ) {
      return "Mobile image URL must start with /, http://, or https://";
    }

    if (!isValidPathOrUrl(form.ctaHref.trim())) {
      return "CTA link must start with /, http://, or https://";
    }

    const priority = Number(form.priority);

    if (!Number.isFinite(priority)) {
      return "Priority must be a valid number.";
    }

    const publishAt = new Date(form.publishAt);

    if (Number.isNaN(publishAt.getTime())) {
      return "Publish date is invalid.";
    }

    if (form.expiresAt.trim()) {
      const expiresAt = new Date(form.expiresAt);

      if (Number.isNaN(expiresAt.getTime())) {
        return "Expiry date is invalid.";
      }

      if (expiresAt <= publishAt) {
        return "Expiry date must be after publish date.";
      }
    }

    return "";
  }

  async function savePoster(forcePublish = false) {
    const formToSave = {
      ...form,
      isPublished: forcePublish ? true : form.isPublished,
    };

    const validationError = validateForm();

    if (validationError) {
      setNotice({
        type: "error",
        text: validationError,
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const endpoint = form.id
        ? `/api/admin/announcement-posters/${form.id}`
        : "/api/admin/announcement-posters";

      const response = await fetch(endpoint, {
        method: form.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(posterToPayload(formToSave)),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to save poster.");
      }

      await refreshPosters();

      setForm(emptyForm);
      setNotice({
        type: "success",
        text: forcePublish
          ? "Poster uploaded, saved and published successfully."
          : form.id
            ? "Poster updated successfully."
            : "Poster saved as draft successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function savePosterPatch(
    poster: SerializedPoster,
    patch: Partial<PosterFormState>,
  ) {
    const patchedForm = {
      ...posterToForm(poster),
      ...patch,
    };

    const response = await fetch(
      `/api/admin/announcement-posters/${poster.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(posterToPayload(patchedForm)),
      },
    );

    const data = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to update poster.");
    }
  }

  async function togglePublished(poster: SerializedPoster) {
    setNotice(null);

    try {
      await savePosterPatch(poster, {
        isPublished: !poster.isPublished,
      });

      await refreshPosters();

      setNotice({
        type: "success",
        text: poster.isPublished
          ? "Poster unpublished successfully."
          : "Poster published successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Publish toggle failed.",
      });
    }
  }

  async function setAsHero(poster: SerializedPoster) {
    setNotice(null);

    try {
      await savePosterPatch(poster, {
        isHero: true,
        isPublished: true,
      });

      await refreshPosters();

      setNotice({
        type: "success",
        text: "Poster promoted as live hero.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Hero update failed.",
      });
    }
  }

  async function deletePoster(posterId: string) {
    const confirmed = window.confirm(
      "Delete this poster permanently? This cannot be undone.",
    );

    if (!confirmed) return;

    setDeletingPosterId(posterId);
    setNotice(null);

    try {
      const response = await fetch(
        `/api/admin/announcement-posters/${posterId}`,
        {
          method: "DELETE",
        },
      );

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete poster.");
      }

      if (form.id === posterId) {
        setForm(emptyForm);
      }

      await refreshPosters();

      setNotice({
        type: "success",
        text: "Poster deleted successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Delete failed.",
      });
    } finally {
      setDeletingPosterId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-7">
      <section className="rounded-[2.75rem] border border-white bg-white/85 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-yellow-700">
          <Megaphone className="h-4 w-4" />
          Poster Publisher
        </div>

        <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-tight text-[#6d6e6f] sm:text-5xl lg:text-6xl">
          Upload, preview and publish posters directly from admin UI.
        </h1>

        <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
          No manual project file paths. Images are uploaded to Supabase Storage
          and linked automatically.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <StatusBadge
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Admin Only"
            tone="emerald"
          />
          <StatusBadge
            icon={<CheckCircle2 className="h-4 w-4" />}
            label={`${livePosterCount} Live`}
            tone="blue"
          />
          <StatusBadge
            icon={<Star className="h-4 w-4" />}
            label={heroPoster ? "Hero Active" : "No Hero"}
            tone="yellow"
          />
        </div>
      </section>

      {notice ? (
        <section
          className={
            notice.type === "success"
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-700"
              : "rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-black text-red-700"
          }
        >
          {notice.text}
        </section>
      ) : null}

      <section className="grid gap-7 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="rounded-[2.35rem] border border-white bg-white/85 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                Editor
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#6d6e6f]">
                {form.id ? "Edit poster" : "Create poster"}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setNotice(null);
              }}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700"
            >
              Reset
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                placeholder="OSO Selection Test is live"
              />
            </Field>

            <Field label="Subtitle">
              <textarea
                value={form.subtitle}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
                placeholder="Short announcement shown to students"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Status">
                <input
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                  placeholder="LIVE / UPCOMING / RESULT"
                />
              </Field>
            </div>

            <AssetUploader
              title="Desktop poster image"
              value={form.imageUrl}
              uploading={uploadingTarget === "imageUrl"}
              onUpload={(file) => void uploadPosterAsset("imageUrl", file)}
              onClear={() => updateField("imageUrl", "")}
            />

            <AssetUploader
              title="Mobile poster image"
              value={form.mobileImageUrl}
              uploading={uploadingTarget === "mobileImageUrl"}
              optional
              onUpload={(file) =>
                void uploadPosterAsset("mobileImageUrl", file)
              }
              onClear={() => updateField("mobileImageUrl", "")}
            />

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Advanced: paste external image URL manually
              </summary>

              <div className="mt-4 grid gap-4">
                <Field label="Desktop image URL">
                  <input
                    value={form.imageUrl}
                    onChange={(event) =>
                      updateField("imageUrl", event.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                    placeholder="https://..."
                  />
                </Field>

                <Field label="Mobile image URL">
                  <input
                    value={form.mobileImageUrl}
                    onChange={(event) =>
                      updateField("mobileImageUrl", event.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                    placeholder="Optional"
                  />
                </Field>
              </div>
            </details>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA label">
                <input
                  value={form.ctaLabel}
                  onChange={(event) =>
                    updateField("ctaLabel", event.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="CTA link">
                <input
                  value={form.ctaHref}
                  onChange={(event) =>
                    updateField("ctaHref", event.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                  placeholder="/quiz"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Placement">
                <select
                  value={form.placement}
                  onChange={(event) =>
                    updateField("placement", event.target.value)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                >
                  <option value="LOGIN_HERO">LOGIN_HERO</option>
                  <option value="HOME_HERO">HOME_HERO</option>
                  <option value="LIVE_RAIL">LIVE_RAIL</option>
                  <option value="GLOBAL">GLOBAL</option>
                </select>
              </Field>

              <Field label="Priority">
                <input
                  value={form.priority}
                  onChange={(event) =>
                    updateField("priority", event.target.value)
                  }
                  type="number"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Publish at">
                <input
                  value={form.publishAt}
                  onChange={(event) =>
                    updateField("publishAt", event.target.value)
                  }
                  type="datetime-local"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Expires at">
                <input
                  value={form.expiresAt}
                  onChange={(event) =>
                    updateField("expiresAt", event.target.value)
                  }
                  type="datetime-local"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>
            </div>

            <Field label="Highlights">
              <textarea
                value={form.highlights}
                onChange={(event) =>
                  updateField("highlights", event.target.value)
                }
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-blue-400"
                placeholder={
                  "One highlight per line\nTest is live\nResults announced"
                }
              />
            </Field>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">
                  Set as hero
                </span>
                <input
                  type="checkbox"
                  checked={form.isHero}
                  onChange={(event) =>
                    updateField("isHero", event.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">
                  Save as published
                </span>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) =>
                    updateField("isPublished", event.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void savePoster(false)}
                disabled={saving || uploadingTarget !== null}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => void savePoster(true)}
                disabled={saving || uploadingTarget !== null}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Save & Publish
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-7">
          <section className="rounded-[2.35rem] border border-white bg-slate-950 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.13)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                  Live Preview
                </p>
                <h2 className="mt-2 text-xl font-black text-white">
                  What users will see
                </h2>
              </div>

              {form.ctaHref ? (
                <a
                  href={form.ctaHref}
                  target={form.ctaHref.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-100"
                >
                  CTA
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/35">
              {activePreviewImage ? (
                <img
                  src={activePreviewImage}
                  alt={form.title || "Poster preview"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-white/[0.03]">
                  <div className="text-center text-white/35">
                    <ImageOff className="mx-auto mb-3 h-9 w-9" />
                    Upload image to preview poster.
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
                    {form.status || "Status"}
                  </span>

                  <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-200">
                    {form.category || "Category"}
                  </span>
                </div>

                <h3 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">
                  {form.title || "Poster title"}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                  {form.subtitle ||
                    "Poster subtitle will appear here once entered."}
                </p>

                {parsedHighlights.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {parsedHighlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-white/80"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-[2.35rem] border border-white bg-white/85 p-6 shadow-[0_24px_90px_rgba(15,23,42,0.07)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Poster Registry
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#6d6e6f]">
                  Published and draft posters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => void refreshPosters()}
                disabled={loadingPosters}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-slate-700 disabled:opacity-60"
              >
                <RefreshCcw
                  className={
                    loadingPosters ? "h-4 w-4 animate-spin" : "h-4 w-4"
                  }
                />
                Refresh
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {posters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                  <Megaphone className="mx-auto h-9 w-9 text-slate-400" />
                  <p className="mt-3 text-sm font-bold text-slate-500">
                    No posters created yet.
                  </p>
                </div>
              ) : (
                posters.map((poster) => (
                  <article
                    key={poster.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                          {poster.mobileImageUrl || poster.imageUrl ? (
                            <img
                              src={poster.mobileImageUrl || poster.imageUrl}
                              alt={poster.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-slate-400">
                              <ImageOff className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap gap-2">
                            <PosterBadge
                              label={poster.isPublished ? "Published" : "Draft"}
                              tone={poster.isPublished ? "emerald" : "slate"}
                            />
                            {poster.isHero ? (
                              <PosterBadge label="Hero" tone="yellow" />
                            ) : null}
                            <PosterBadge label={poster.placement} tone="blue" />
                          </div>

                          <h3 className="mt-3 text-lg font-black text-slate-950">
                            {poster.title}
                          </h3>

                          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                            {poster.subtitle}
                          </p>

                          <p className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Priority {poster.priority} · {poster.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          type="button"
                          onClick={() => setForm(posterToForm(poster))}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void togglePublished(poster)}
                          className={
                            poster.isPublished
                              ? "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-red-700"
                              : "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-emerald-700"
                          }
                        >
                          {poster.isPublished ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          {poster.isPublished ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void setAsHero(poster)}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-yellow-700"
                        >
                          <Star className="h-4 w-4" />
                          Hero
                        </button>

                        <button
                          type="button"
                          onClick={() => void deletePoster(poster.id)}
                          disabled={deletingPosterId === poster.id}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700 disabled:opacity-60"
                        >
                          {deletingPosterId === poster.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function AssetUploader({
  title,
  value,
  uploading,
  optional = false,
  onUpload,
  onClear,
}: {
  title: string;
  value: string;
  uploading: boolean;
  optional?: boolean;
  onUpload: (file: File | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
            <ImageIcon className="h-4 w-4" />
            {title} {optional ? "(optional)" : ""}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            Upload from UI. Stored in Supabase Storage. Max 5MB.
          </p>

          {value ? (
            <p className="mt-2 truncate rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-700">
              Uploaded: {value}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 gap-2">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-slate-700"
            >
              Clear
            </button>
          ) : null}

          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_14px_28px_rgba(37,99,235,0.18)]">
            {uploading ? "Uploading..." : value ? "Replace" : "Choose Image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                onUpload(file);
                event.currentTarget.value = "";
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatusBadge({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "blue" | "yellow" | "emerald";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

function PosterBadge({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "yellow" | "emerald" | "slate";
}) {
  const className =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "yellow"
        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
        : tone === "blue"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-50 text-slate-500";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${className}`}
    >
      {label}
    </span>
  );
}
