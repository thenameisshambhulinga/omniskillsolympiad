"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  ImageOff,
  ImagePlus,
  Loader2,
  Plus,
  Radio,
  RefreshCcw,
  Save,
  Star,
  Trash2,
} from "lucide-react";

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
  id?: string;
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
  type: "success" | "error" | "info";
  text: string;
};

const emptyForm: PosterFormState = {
  title: "",
  subtitle: "",
  category: "Silicon Skillathon",
  status: "Live",
  imageUrl: "",
  mobileImageUrl: "",
  ctaLabel: "Explore",
  ctaHref: "/login",
  placement: "LOGIN_HERO",
  priority: "0",
  isHero: false,
  isPublished: false,
  publishAt: new Date().toISOString().slice(0, 16),
  expiresAt: "",
  highlights: "",
};

const sampleForm: PosterFormState = {
  ...emptyForm,
  title: "Innovation Challenge 2026",
  subtitle: "Build, compete and showcase your engineering skill.",
  category: "Silicon Skillathon",
  status: "Live",
  imageUrl: "/posters/test-poster.jpg",
  mobileImageUrl: "",
  ctaLabel: "Apply Now",
  ctaHref: "/login",
  priority: "10",
  isHero: true,
  isPublished: true,
  highlights: "Live Event\nEngineering Showcase\nAdmin Published",
};

function toInputDate(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 16);
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
    highlights: poster.highlights,
  };
}

function formToPayload(form: PosterFormState) {
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
    publishAt: form.publishAt,
    expiresAt: form.expiresAt,
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

export default function AnnouncementPosterManager({
  initialPosters,
}: {
  initialPosters: SerializedPoster[];
}) {
  const router = useRouter();

  const [posters, setPosters] = useState<SerializedPoster[]>(initialPosters);
  const [form, setForm] = useState<PosterFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingPosterId, setDeletingPosterId] = useState<string | null>(null);
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

  const updateField = <K extends keyof PosterFormState>(
    key: K,
    value: PosterFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const refreshPosters = async () => {
    const response = await fetch("/api/admin/announcement-posters", {
      cache: "no-store",
    });

    const data = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(data.error || "Unable to refresh posters.");
    }

    setPosters(data.posters ?? []);
    router.refresh();
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.subtitle.trim()) return "Subtitle is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.status.trim()) return "Status is required.";
    if (!form.imageUrl.trim()) return "Image URL is required.";
    if (!form.ctaLabel.trim()) return "CTA label is required.";
    if (!form.ctaHref.trim()) return "CTA link is required.";

    const imageUrl = form.imageUrl.trim();
    const ctaHref = form.ctaHref.trim();

    if (
      !imageUrl.startsWith("/") &&
      !imageUrl.startsWith("http://") &&
      !imageUrl.startsWith("https://")
    ) {
      return "Image URL must start with /, http://, or https://";
    }

    if (
      !ctaHref.startsWith("/") &&
      !ctaHref.startsWith("http://") &&
      !ctaHref.startsWith("https://")
    ) {
      return "CTA link must start with /, http://, or https://";
    }

    return "";
  };

  const savePoster = async () => {
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
        body: JSON.stringify(formToPayload(form)),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "Unable to save poster.");
      }

      await refreshPosters();

      setForm(emptyForm);
      setNotice({
        type: "success",
        text: "Poster saved and synced successfully.",
      });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Save failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const deletePoster = async (posterId: string) => {
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
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-7">
      <section className="relative overflow-hidden rounded-[2.35rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_110px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_34%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              Admin Announcement Center
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Poster Publisher
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
              Create, publish, edit, delete and prioritize landing/login posters
              from database. No manual poster code required.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Total" value={posters.length} tone="cyan" />
            <Metric label="Live" value={livePosterCount} tone="emerald" />
            <Metric label="Hero" value={heroPoster ? 1 : 0} tone="purple" />
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
        <div className="space-y-7">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
                  <ImagePlus className="h-5 w-5 text-cyan-200" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    {form.id ? "Edit Poster" : "Create Poster"}
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-white/40">
                    Admin-controlled landing content
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setForm(sampleForm)}
                className="rounded-2xl border border-purple-400/25 bg-purple-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-purple-100 transition hover:bg-purple-400/15"
              >
                Sample
              </button>
            </div>

            <div className="space-y-3">
              <AdminInput
                label="Title"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                placeholder="Innovation Challenge 2026"
                required
              />

              <AdminTextarea
                label="Subtitle"
                value={form.subtitle}
                onChange={(value) => updateField("subtitle", value)}
                placeholder="Build, compete and showcase your engineering skill."
                rows={3}
                required
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput
                  label="Category"
                  value={form.category}
                  onChange={(value) => updateField("category", value)}
                  required
                />

                <AdminInput
                  label="Status"
                  value={form.status}
                  onChange={(value) => updateField("status", value)}
                  required
                />
              </div>

              <AdminInput
                label="Image URL"
                value={form.imageUrl}
                onChange={(value) => updateField("imageUrl", value)}
                placeholder="/posters/test-poster.jpg"
                helper="Use /posters/name.jpg for local images inside public/posters."
                required
              />

              <AdminInput
                label="Mobile Image URL"
                value={form.mobileImageUrl}
                onChange={(value) => updateField("mobileImageUrl", value)}
                placeholder="/posters/test-poster-mobile.jpg"
                helper="Optional. If empty, desktop image is used."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput
                  label="CTA Label"
                  value={form.ctaLabel}
                  onChange={(value) => updateField("ctaLabel", value)}
                  required
                />

                <AdminInput
                  label="CTA Link"
                  value={form.ctaHref}
                  onChange={(value) => updateField("ctaHref", value)}
                  required
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput
                  label="Placement"
                  value={form.placement}
                  onChange={(value) => updateField("placement", value)}
                />

                <AdminInput
                  label="Priority"
                  value={form.priority}
                  onChange={(value) => updateField("priority", value)}
                  type="number"
                />
              </div>

              <AdminTextarea
                label="Highlights"
                value={form.highlights}
                onChange={(value) => updateField("highlights", value)}
                placeholder={"Live Event\nEngineering Showcase\nAdmin Published"}
                helper="One highlight per line."
                rows={4}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminInput
                  label="Publish At"
                  value={form.publishAt}
                  onChange={(value) => updateField("publishAt", value)}
                  type="datetime-local"
                />

                <AdminInput
                  label="Expires At"
                  value={form.expiresAt}
                  onChange={(value) => updateField("expiresAt", value)}
                  type="datetime-local"
                  helper="Optional."
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ToggleField
                  label="Published"
                  checked={form.isPublished}
                  onChange={(checked) => updateField("isPublished", checked)}
                />

                <ToggleField
                  label="Set as Hero"
                  checked={form.isHero}
                  onChange={(checked) => updateField("isHero", checked)}
                />
              </div>

              {notice && (
                <div
                  className={
                    notice.type === "success"
                      ? "flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100"
                      : notice.type === "error"
                        ? "flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100"
                        : "flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-100"
                  }
                >
                  {notice.type === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  {notice.text}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={savePoster}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {form.id ? "Update" : "Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setNotice(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-white/65 transition hover:bg-white/[0.07]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-7">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
                  Live Preview
                </p>
                <h2 className="mt-2 text-xl font-black text-white">
                  What users will see
                </h2>
              </div>

              {form.ctaHref && (
                <a
                  href={form.ctaHref}
                  target={form.ctaHref.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-100"
                >
                  CTA
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
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
                    Add image URL to preview poster.
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

                  {form.isHero && (
                    <span className="rounded-full border border-purple-400/25 bg-purple-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-purple-200">
                      Hero
                    </span>
                  )}
                </div>

                <h3 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">
                  {form.title || "Poster title"}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                  {form.subtitle ||
                    "Poster subtitle will appear here once entered."}
                </p>

                {parsedHighlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {parsedHighlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black">
                  {form.ctaLabel || "CTA Label"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
                  Poster Library
                </p>
                <h2 className="mt-2 text-xl font-black text-white">
                  Published and draft posters
                </h2>
              </div>

              <button
                type="button"
                onClick={refreshPosters}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {posters.map((poster) => (
                <article
                  key={poster.id}
                  className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
                >
                  <div className="relative h-48 bg-white/[0.04]">
                    <img
                      src={poster.imageUrl}
                      alt={poster.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      {poster.isHero && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-300 px-3 py-1 text-[10px] font-black uppercase text-black">
                          <Star className="h-3 w-3" />
                          Hero
                        </span>
                      )}

                      {poster.isPublished ? (
                        <span className="rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-black uppercase text-black">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase text-black">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-200">
                        <Radio className="h-3 w-3" />
                        {poster.status}
                      </span>

                      <span className="text-xs font-bold text-white/35">
                        Priority {poster.priority}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">
                      {poster.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">
                      {poster.subtitle}
                    </p>

                    <p className="mt-3 text-xs font-bold text-white/35">
                      Updated {new Date(poster.updatedAt).toLocaleString()}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setForm(posterToForm(poster));
                          setNotice({
                            type: "info",
                            text: "Poster loaded for editing.",
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-black text-cyan-100 transition hover:bg-cyan-400/15"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deletePoster(poster.id)}
                        disabled={deletingPosterId === poster.id}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-black text-red-100 transition hover:bg-red-400/15 disabled:opacity-50"
                      >
                        {deletingPosterId === poster.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {posters.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-white/15 p-8 text-center text-white/45">
                  <Plus className="mx-auto mb-3 h-8 w-8 text-cyan-200" />
                  <p className="font-black text-white/55">No posters yet.</p>
                  <p className="mt-2 text-sm">
                    Fill the form or use Sample to create your first poster.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "purple";
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      : tone === "emerald"
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
        : "border-purple-400/20 bg-purple-400/10 text-purple-200";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helper,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/[0.04]">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/20"
      />

      {helper && <p className="mt-2 text-xs text-white/35">{helper}</p>}
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  helper,
  rows = 3,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition focus-within:border-cyan-400/35 focus-within:bg-cyan-400/[0.04]">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
        {label}
        {required && <span className="ml-1 text-red-300">*</span>}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-3 w-full resize-none bg-transparent text-sm font-semibold leading-6 text-white outline-none placeholder:text-white/20"
      />

      {helper && <p className="mt-2 text-xs text-white/35">{helper}</p>}
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={
        checked
          ? "flex items-center justify-between rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-4 text-cyan-100"
          : "flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-4 text-white/55"
      }
    >
      <span className="text-xs font-black uppercase tracking-[0.18em]">
        {label}
      </span>

      <span
        className={
          checked
            ? "flex h-6 w-11 items-center rounded-full bg-cyan-300 p-1"
            : "flex h-6 w-11 items-center rounded-full bg-white/15 p-1"
        }
      >
        <span
          className={
            checked
              ? "h-4 w-4 translate-x-5 rounded-full bg-black transition"
              : "h-4 w-4 rounded-full bg-white/65 transition"
          }
        />
      </span>
    </button>
  );
}