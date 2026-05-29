"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

export default function OnboardingClient() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    college: "",
    branch: "",
    year: "",
    bio: "",
    skills: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/onboarding", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...form,

        skills: form.skills.split(",").map((skill) => skill.trim()),
      }),
    });

    setLoading(false);

    if (response.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-bold">Complete Your Profile</h1>

        <p className="mt-4 text-white/70">
          Setup your engineering profile to continue.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-10"
        >
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="College"
            required
            value={form.college}
            onChange={(e) =>
              setForm({
                ...form,
                college: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Branch"
            required
            value={form.branch}
            onChange={(e) =>
              setForm({
                ...form,
                branch: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Year"
            required
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <textarea
            placeholder="Short Bio"
            rows={4}
            value={form.bio}
            onChange={(e) =>
              setForm({
                ...form,
                bio: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={(e) =>
              setForm({
                ...form,
                skills: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/40 px-5 py-4 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-purple-600 py-4 font-semibold transition hover:bg-purple-500"
          >
            {loading ? "Saving..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}
