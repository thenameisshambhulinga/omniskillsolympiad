"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateChallengeResponse = {
  success?: boolean;
  id?: string;
  error?: string;
  challenge?: {
    id?: string;
  };
};

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
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = (await response.json()) as CreateChallengeResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to create challenge");
      }

      const challengeId = data.challenge?.id ?? data.id;

      if (!challengeId) {
        throw new Error("Challenge ID missing from API response");
      }

      router.push(`/admin/challenge/${challengeId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-8 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-5xl font-bold">Create Daily Challenge</h1>

        <form onSubmit={handleCreateChallenge} className="space-y-6">
          <input
            type="number"
            placeholder="Day Number"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            required
            min={1}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Challenge Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none"
          />

          <textarea
            placeholder="Challenge Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 outline-none"
          />

          {error && (
            <div className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold transition-all hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Challenge"}
          </button>
        </form>
      </div>
    </div>
  );
}