"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";

import { signOut } from "next-auth/react";

import {
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* PROFILE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-110"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />

        <User className="relative z-10 h-5 w-5 text-black" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-4 w-64 overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-2xl">
          <div className="border-b border-white/10 p-5">
            <p className="text-lg font-bold text-white">
              Engineering Profile
            </p>

            <p className="mt-1 text-sm text-white/50">
              Silicon Microsystems
            </p>
          </div>

          <div className="p-3">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <User className="h-4 w-4" />

              Profile
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4" />

              Settings
            </Link>

            <button
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />

              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}