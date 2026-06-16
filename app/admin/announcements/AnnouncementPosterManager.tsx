"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  ImageOff,
  ImagePlus,
  Loader2,
  Megaphone,
  Plus,
  Radio,
  RefreshCcw,
  Save,
  ShieldCheck,
  Star,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoMetricTile from "@/components/oso/OsoMetricTile";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import OsoStatusPill from "@/components/oso/OsoStatusPill";

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

  const totalPosters = posters.length;
  const livePosterCount = posters.filter((poster) => poster.isPublished).length;
  const draftPosterCount = totalPosters - livePosterCount;
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
    <div className="mx-auto grid w-full max-w-[1600px] gap-8">
      <OsoGlassSurface hover={false} className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-3">
              <OsoStatusPill
                label="Poster Publisher"
                tone="yellow"
                icon={<Megaphone className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={`${livePosterCount} Live`}
                tone="emerald"
                icon={<Radio className="h-3.5 w-3.5" />}
              />

              <OsoStatusPill
                label={`${draftPosterCount} Drafts`}
                tone="blue"
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
              />
            </div>

            <h1 className="oso-heading mt-6 max-w-5xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Publish announcement posters{" "}
              <span className="text-blue-600">without touching code.</span>
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-slate-600">
              Create, edit, preview and delete landing/login posters from one
              database-driven admin workspace. The existing poster APIs stay
              unchanged.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#create-poster"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_18px_36px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create Poster
                <Plus className="h-4 w-4 transition group-hover:rotate-90" />
              </a>

              <Link
                href="/admin"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.055)] transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Back to Admin
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
              Active Hero Poster
            </p>

            <p className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950">
              {heroPoster ? heroPoster.title : "Not Set"}
            </p>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              {heroPoster
                ? "This poster is currently marked as published hero content."
                : "Publish and mark one poster as hero to highlight it."}
            </p>
          </div>
        </div>
      </OsoGlassSurface>

      <section className="grid gap-5 md:grid-cols-3">
        <OsoMetricTile
          icon={<Megaphone className="h-5 w-5" />}
          label="Total Posters"
          value={totalPosters}
          helper="All poster records"
          tone="yellow"
        />

        <OsoMetricTile
          icon={<ToggleRight className="h-5 w-5" />}
          label="Live"
          value={livePosterCount}
          helper="Visible to users"
          tone="emerald"
        />

        <OsoMetricTile
          icon={<ToggleLeft className="h-5 w-5" />}
          label="Drafts"
          value={draftPosterCount}
          helper="Hidden from public pages"
          tone="blue"
        />
      </section>

      <section className="grid gap-7 xl:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]">
        <div id="create-poster" className="space-y-7">
          <OsoGlassSurface hover={false} className="p-5 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                  <ImagePlus className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="oso-heading text-2xl font-black text-slate-950">
                    {form.id ? "Edit Poster" : "Create Poster"}
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Admin-controlled landing content
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setForm(sampleForm)}
                className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-700 transition hover:bg-yellow-100"
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

              {notice ? <NoticeBox notice={notice} /> : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={savePoster}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {form.id ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setNotice(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>
          </OsoGlassSurface>
        </div>

        <div className="space-y-7">
          <OsoGlassSurface hover={false} className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <OsoSectionHeader
                eyebrow="Live Preview"
                title="What users will see"
                description="Preview updates before saving the poster."
                icon={<Eye className="h-5 w-5" />}
              />

              {form.ctaHref ? (
                <a
                  href={form.ctaHref}
                  target={form.ctaHref.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="hidden shrink-0 items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 sm:inline-flex"
                >
                  CTA
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            <div className="relative min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-100 shadow-sm">
              {activePreviewImage ? (
                <img
                  src={activePreviewImage}
                  alt={form.title || "Poster preview"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-slate-100">
                  <div className="text-center text-slate-400">
                    <ImageOff className="mx-auto mb-3 h-9 w-9" />
                    Add image URL to preview poster.
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/10" />

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-100">
                    {form.status || "Status"}
                  </span>

                  <span className="rounded-full border border-blue-300/40 bg-blue-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-blue-100">
                    {form.category || "Category"}
                  </span>

                  {form.isHero ? (
                    <span className="rounded-full border border-yellow-300/40 bg-yellow-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-yellow-100">
                      Hero
                    </span>
                  ) : null}
                </div>

                <h3 className="max-w-2xl text-3xl font-black text-white sm:text-4xl">
                  {form.title || "Poster title"}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
                  {form.subtitle ||
                    "Poster subtitle will appear here once entered."}
                </p>

                {parsedHighlights.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {parsedHighlights.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/75"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white">
                  {form.ctaLabel || "CTA Label"}
                </div>
              </div>
            </div>
          </OsoGlassSurface>

          <OsoGlassSurface hover={false} className="p-5 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <OsoSectionHeader
                eyebrow="Poster Library"
                title="Published and draft posters"
                description="Edit or delete existing announcement posters."
                icon={<Megaphone className="h-5 w-5" />}
              />

              <button
                type="button"
                onClick={refreshPosters}
                className="shrink-0 rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {posters.map((poster) => (
                <PosterCard
                  key={poster.id}
                  poster={poster}
                  deletingPosterId={deletingPosterId}
                  onEdit={() => {
                    setForm(posterToForm(poster));
                    setNotice({
                      type: "info",
                      text: "Poster loaded for editing.",
                    });
                  }}
                  onDelete={() => deletePoster(poster.id)}
                />
              ))}

              {posters.length === 0 ? <EmptyPosterState /> : null}
            </div>
          </OsoGlassSurface>
        </div>
      </section>
    </div>
  );
}

function PosterCard({
  poster,
  deletingPosterId,
  onEdit,
  onDelete,
}: {
  poster: SerializedPoster;
  deletingPosterId: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/82 shadow-[0_16px_44px_rgba(15,23,42,0.055)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_62px_rgba(15,23,42,0.085)]">
      <div className="relative h-48 bg-slate-100">
        <img
          src={poster.imageUrl}
          alt={poster.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {poster.isHero ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase text-white">
              <Star className="h-3 w-3" />
              Hero
            </span>
          ) : null}

          {poster.isPublished ? (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase text-white">
              Published
            </span>
          ) : (
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase text-yellow-950">
              Draft
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
            <Radio className="h-3 w-3" />
            {poster.status}
          </span>

          <span className="text-xs font-bold text-slate-400">
            Priority {poster.priority}
          </span>
        </div>

        <h3 className="oso-heading text-lg font-black text-slate-950">
          {poster.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-600">
          {poster.subtitle}
        </p>

        <p className="mt-3 text-xs font-bold text-slate-400">
          Updated {new Date(poster.updatedAt).toLocaleString()}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-black text-blue-700 transition hover:bg-blue-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deletingPosterId === poster.id}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-100 disabled:opacity-50"
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
  );
}

function NoticeBox({ notice }: { notice: Notice }) {
  const className =
    notice.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : notice.type === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${className}`}
    >
      {notice.type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      {notice.text}
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
    <label className="block rounded-2xl border border-slate-200 bg-white/80 p-4 transition focus-within:border-blue-300 focus-within:bg-blue-50/35">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-300"
      />

      {helper ? (
        <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
          {helper}
        </p>
      ) : null}
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
    <label className="block rounded-2xl border border-slate-200 bg-white/80 p-4 transition focus-within:border-blue-300 focus-within:bg-blue-50/35">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-3 w-full resize-none bg-transparent text-sm font-semibold leading-6 text-slate-950 outline-none placeholder:text-slate-300"
      />

      {helper ? (
        <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
          {helper}
        </p>
      ) : null}
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
          ? "flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-700"
          : "flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 text-slate-500"
      }
    >
      <span className="text-xs font-black uppercase tracking-[0.18em]">
        {label}
      </span>

      <span
        className={
          checked
            ? "flex h-6 w-11 items-center rounded-full bg-blue-600 p-1"
            : "flex h-6 w-11 items-center rounded-full bg-slate-300 p-1"
        }
      >
        <span
          className={
            checked
              ? "h-4 w-4 translate-x-5 rounded-full bg-white transition"
              : "h-4 w-4 rounded-full bg-white transition"
          }
        />
      </span>
    </button>
  );
}

function EmptyPosterState() {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
      <Plus className="mx-auto mb-3 h-8 w-8 text-blue-600" />
      <p className="font-black text-slate-700">No posters yet.</p>
      <p className="mt-2 text-sm font-medium">
        Fill the form or use Sample to create your first poster.
      </p>
    </div>
  );
}