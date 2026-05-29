"use client";
import CommandSearch from "@/components/search/CommandSearch";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, Moon } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}

      <div className="sticky top-0 z-50 px-4 py-5 md:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[32px] border border-white/10 bg-white/10 px-5 py-5 shadow-2xl backdrop-blur-2xl">
          {/* LEFT */}

          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:scale-105 hover:bg-white/20"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>

          {/* CENTER LOGO */}

          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/sims-logo.png"
              alt="SIMS Logo"
              width={220}
              height={80}
              priority
              style={{
                width: "auto",
                height: "auto",
              }}
            />
          </Link>

          {/* RIGHT */}

          <div className="flex items-center gap-3">
            {/* SEARCH */}

            <CommandSearch />

            {/* MOBILE SEARCH */}

            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition duration-300 hover:scale-105 hover:bg-white/20 min-[900px]:hidden">
              <Search className="h-5 w-5 text-white" />
            </button>

            {/* THEME */}

            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition duration-300 hover:scale-105">
              <Moon className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </div>

      {/* SIDEBAR OVERLAY */}

      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* SIDEBAR */}

      <div
        className={`fixed left-0 top-0 z-[100] h-screen w-[320px] border-r border-white/10 bg-black/95 p-8 backdrop-blur-2xl transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP */}

        <div className="flex items-center justify-between">
          <Image
            src="/sims-logo.png"
            alt="SIMS Logo"
            width={220}
            height={80}
            priority
            style={{
              width: "auto",
              height: "auto",
            }}
          />

          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* SEARCH */}

        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <Search className="h-4 w-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search ecosystem..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
          />
        </div>

        {/* NAVIGATION */}

        <div className="mt-14 flex flex-col gap-3">
          <Link
            href="/competition"
            className="rounded-2xl px-5 py-4 text-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Competition
          </Link>

          <Link
            href="/daily-quizzes"
            className="rounded-2xl px-5 py-4 text-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Daily Quizzes
          </Link>

          <Link
            href="/mock-tests"
            className="rounded-2xl px-5 py-4 text-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Mock Tests
          </Link>

          <Link
            href="/leaderboard"
            className="rounded-2xl px-5 py-4 text-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            Leaderboard
          </Link>

          <Link
            href="/worldskills"
            className="rounded-2xl px-5 py-4 text-lg text-white/80 transition hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            WorldSkills
          </Link>
        </div>

        {/* BOTTOM CTA */}

        <div className="absolute bottom-10 left-8 right-8">
          <button className="w-full rounded-2xl bg-purple-600 py-4 text-lg font-semibold transition hover:bg-purple-500">
            Register Now
          </button>
        </div>
      </div>
    </>
  );
}
