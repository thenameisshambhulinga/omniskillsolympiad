"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCcw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

type SelectionRow = {
  attemptId: string;
  userId: string;
  email: string;
  score: number;
  total: number;
  percentage: number;
  suspicious: boolean;
  tabSwitchCount: number;
  submittedAt: string | null;
  eligibleByEquation: boolean;
  rank: number | null;
  status: "PENDING" | "SELECTED" | "WAITLISTED" | "REJECTED";
  reason: string;
};

type SelectionSnapshot = {
  quiz: {
    id: string;
    title: string;
  };
  settings: {
    minimumPercentage: number;
    maxTabSwitches: number;
    requireNonSuspicious: boolean;
    shortlistLimit: number | null;
  };
  equation: string;
  rows: SelectionRow[];
};

export default function SelectionControlClient({
  initialData,
}: {
  initialData: SelectionSnapshot;
}) {
  const [data, setData] = useState(initialData);
  const [minimumPercentage, setMinimumPercentage] = useState(
    String(initialData.settings.minimumPercentage),
  );
  const [maxTabSwitches, setMaxTabSwitches] = useState(
    String(initialData.settings.maxTabSwitches),
  );
  const [shortlistLimit, setShortlistLimit] = useState(
    initialData.settings.shortlistLimit
      ? String(initialData.settings.shortlistLimit)
      : "",
  );
  const [requireNonSuspicious, setRequireNonSuspicious] = useState(
    initialData.settings.requireNonSuspicious,
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCount = useMemo(
    () => data.rows.filter((row) => row.status === "SELECTED").length,
    [data.rows],
  );

  const waitlistedCount = useMemo(
    () => data.rows.filter((row) => row.status === "WAITLISTED").length,
    [data.rows],
  );

  const rejectedCount = useMemo(
    () => data.rows.filter((row) => row.status === "REJECTED").length,
    [data.rows],
  );

  async function refreshData() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/protected-tests/${data.quiz.id}/selection`,
        {
          cache: "no-store",
        },
      );

      const json = await response.json();

      if (!response.ok || !json.ok) {
        setMessage(json.error || "Could not refresh selection data.");
        return;
      }

      setData(json);
    } catch {
      setMessage("Network error while refreshing data.");
    } finally {
      setLoading(false);
    }
  }

  async function saveEquation() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/protected-tests/${data.quiz.id}/selection`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            minimumPercentage: Number(minimumPercentage),
            maxTabSwitches: Number(maxTabSwitches),
            shortlistLimit: shortlistLimit ? Number(shortlistLimit) : null,
            requireNonSuspicious,
          }),
        },
      );

      const json = await response.json();

      if (!response.ok || !json.ok) {
        setMessage(json.error || "Could not save equation.");
        return;
      }

      setData(json);
      setMessage("Filtration equation saved.");
    } catch {
      setMessage("Network error while saving equation.");
    } finally {
      setLoading(false);
    }
  }

  async function evaluateApplicants() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/protected-tests/${data.quiz.id}/selection`,
        {
          method: "POST",
        },
      );

      const json = await response.json();

      if (!response.ok || !json.ok) {
        setMessage(json.error || "Could not evaluate applicants.");
        return;
      }

      setData(json);
      setMessage("Applicants evaluated and statuses saved.");
    } catch {
      setMessage("Network error while evaluating applicants.");
    } finally {
      setLoading(false);
    }
  }

  function exportSelectedCsv() {
    const rows = data.rows.filter((row) => row.status === "SELECTED");

    const csv = [
      [
        "Rank",
        "Email",
        "Score",
        "Total",
        "Percentage",
        "Tab Switches",
        "Suspicious",
        "Submitted At",
      ],
      ...rows.map((row) => [
        row.rank ?? "",
        row.email,
        row.score,
        row.total,
        row.percentage,
        row.tabSwitchCount,
        row.suspicious ? "YES" : "NO",
        row.submittedAt ?? "",
      ]),
    ]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${data.quiz.title.replaceAll(" ", "-").toLowerCase()}-selected.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1600px]">
        <header className="rounded-[2.75rem] border border-white bg-white/85 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <Link
            href="/admin/protected-tests"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Protected Tests
          </Link>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            One-Time Selection Control
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight text-[#6d6e6f] sm:text-5xl">
            {data.quiz.title}
          </h1>

          <p className="mt-4 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm font-bold text-slate-700">
            {data.equation}
          </p>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-4">
          <Metric label="Submitted" value={String(data.rows.length)} />
          <Metric label="Selected" value={String(selectedCount)} />
          <Metric label="Waitlisted" value={String(waitlistedCount)} />
          <Metric label="Rejected" value={String(rejectedCount)} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.55fr_1.45fr]">
          <div className="rounded-[2rem] border border-white bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-2 text-blue-700">
              <SlidersHorizontal className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.16em]">
                Filtration Equation
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              <Field label="Minimum Percentage">
                <input
                  value={minimumPercentage}
                  onChange={(event) => setMinimumPercentage(event.target.value)}
                  type="number"
                  min={0}
                  max={100}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Max Focus Alerts / Tab Switches">
                <input
                  value={maxTabSwitches}
                  onChange={(event) => setMaxTabSwitches(event.target.value)}
                  type="number"
                  min={0}
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <Field label="Shortlist Limit">
                <input
                  value={shortlistLimit}
                  onChange={(event) => setShortlistLimit(event.target.value)}
                  type="number"
                  min={1}
                  placeholder="No limit"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-blue-400"
                />
              </Field>

              <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-black text-slate-700">
                  Reject suspicious attempts
                </span>
                <input
                  type="checkbox"
                  checked={requireNonSuspicious}
                  onChange={(event) =>
                    setRequireNonSuspicious(event.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

              <button
                type="button"
                onClick={() => void saveEquation()}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Equation
              </button>

              <button
                type="button"
                onClick={() => void evaluateApplicants()}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Evaluate Applicants
              </button>

              <button
                type="button"
                onClick={() => void refreshData()}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700 disabled:opacity-60"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>

              <button
                type="button"
                onClick={exportSelectedCsv}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-slate-700"
              >
                <Download className="h-4 w-4" />
                Export Selected CSV
              </button>
            </div>

            {message ? (
              <p className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-700">
                {message}
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Rank</th>
                    <th className="px-4 py-4">Applicant</th>
                    <th className="px-4 py-4">Score</th>
                    <th className="px-4 py-4">%</th>
                    <th className="px-4 py-4">Alerts</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Reason</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center font-bold text-slate-500"
                      >
                        No students have submitted this test yet.
                      </td>
                    </tr>
                  ) : (
                    data.rows.map((row) => (
                      <tr key={row.attemptId}>
                        <td className="px-4 py-4 font-black">
                          {row.rank ?? "-"}
                        </td>
                        <td className="px-4 py-4 font-bold">{row.email}</td>
                        <td className="px-4 py-4 font-bold">
                          {row.score}/{row.total}
                        </td>
                        <td className="px-4 py-4 font-black">
                          {row.percentage}
                        </td>
                        <td className="px-4 py-4 font-bold">
                          {row.tabSwitchCount}
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={row.status} />
                        </td>
                        <td className="px-4 py-4 text-xs font-semibold text-slate-500">
                          {row.reason}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white bg-white/85 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: SelectionRow["status"] }) {
  const className =
    status === "SELECTED"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "WAITLISTED"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : status === "REJECTED"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${className}`}
    >
      {status}
    </span>
  );
}
