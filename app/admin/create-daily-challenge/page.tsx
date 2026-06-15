"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default function CreateDailyChallengePage() {
  const router = useRouter();

  const [dayNumber, setDayNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateChallenge(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/create-daily-challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayNumber: Number(dayNumber),
          title,
          description,
        }),
      });

      const data = await response.json();

      console.log("API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create challenge");
      }

      if (!data.id) {
        throw new Error("Challenge ID missing from API response");
      }

      router.push(`/admin/challenge/${data.id}`);
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">Create Daily Challenge</h1>

        <form onSubmit={handleCreateChallenge} className="space-y-6">
          <input
            type="number"
            placeholder="Day Number"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            required
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Challenge Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none"
          />

          <textarea
            placeholder="Challenge Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 outline-none resize-none"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition-all rounded-xl px-8 py-4 font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}
