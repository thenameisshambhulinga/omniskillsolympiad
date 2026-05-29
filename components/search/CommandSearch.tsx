"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Search,
  X,
  Trophy,
  FileText,
  BrainCircuit,
  GraduationCap,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  {
    title: "Competition",
    href: "/competition",
    icon: Trophy,
  },
  {
    title: "Daily Quizzes",
    href: "/daily-quizzes",
    icon: BrainCircuit,
  },
  {
    title: "Mock Tests",
    href: "/mock-tests",
    icon: FileText,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "WorldSkills",
    href: "/worldskills",
    icon: GraduationCap,
  },
];

export default function CommandSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}

      <Dialog.Trigger asChild>
        <button className="hidden min-[900px]:flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-5 py-3 transition duration-300 hover:border-purple-500/30 hover:bg-black/40">
          <Search className="h-4 w-4 text-gray-400" />

          <span className="text-sm text-gray-400">Search ecosystem...</span>

          <div className="ml-8 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-400">
            ⌘K
          </div>
        </button>
      </Dialog.Trigger>

      {/* PORTAL */}

      <Dialog.Portal>
        {/* OVERLAY */}

        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md" />

        {/* CONTENT */}

        <Dialog.Content className="fixed left-1/2 top-[12%] z-[101] w-[92%] max-w-2xl -translate-x-1/2 rounded-[36px] border border-white/10 bg-[#090909] p-6 shadow-2xl outline-none">
          {/* SEARCH INPUT */}

          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <Search className="h-5 w-5 text-gray-400" />

            <input
              autoFocus
              placeholder="Search pages, quizzes, rankings..."
              className="w-full bg-transparent text-lg text-white outline-none placeholder:text-gray-500"
            />

            <Dialog.Close asChild>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition hover:bg-white/10">
                <X className="h-4 w-4 text-white" />
              </button>
            </Dialog.Close>
          </div>

          {/* RESULTS */}

          <div className="mt-6 space-y-3">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition duration-300 hover:border-purple-500/20 hover:bg-white/[0.06]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Open {item.title} ecosystem
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
