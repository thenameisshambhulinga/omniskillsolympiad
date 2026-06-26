"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Sparkles } from "lucide-react";

export default function PassportStudioHomeDock() {
  return (
    <div className="fixed left-5 top-5 z-[120]">
      <Link
        href="/"
        aria-label="Return to OMNI home"
        className="group flex max-w-[54px] items-center overflow-hidden rounded-2xl border border-slate-200 bg-white/88 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-all duration-300 hover:max-w-[310px] hover:border-blue-200 hover:bg-white"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
          <Image
            src="/brand/omni-logo-new.jpeg"
            alt="OMNI"
            width={128}
            height={48}
            className="h-8 w-auto object-contain"
            priority
          />
        </span>

        <span className="ml-3 hidden min-w-[215px] items-center gap-3 opacity-0 transition duration-300 group-hover:flex group-hover:opacity-100">
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.12em] text-blue-700">
              Return to ecosystem
            </span>
            <span className="mt-0.5 block text-sm font-bold text-slate-700">
              Go back to OMNI home
            </span>
          </span>

          <span className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ChevronRight className="h-4 w-4" />
          </span>
        </span>

        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
          <Sparkles className="h-3 w-3" />
        </span>
      </Link>

      <div className="mt-2 hidden rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 shadow-sm backdrop-blur-xl group-hover:block">
        <Home className="mr-1 inline h-3 w-3" />
        Home
      </div>
    </div>
  );
}
