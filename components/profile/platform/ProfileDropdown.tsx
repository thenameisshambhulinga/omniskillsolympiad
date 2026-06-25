"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, PenLine, Settings, User } from "lucide-react";

export default function ProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const image = session?.user?.image || "";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative z-[130]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open account menu"
        className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_16px_34px_rgba(37,99,235,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(37,99,235,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="relative z-10 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className="relative z-10 h-5 w-5 text-slate-950" />
        )}

        <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-100" />
      </button>

      {open ? (
        <div className="absolute right-0 mt-4 w-[260px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/96 text-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  Skill Passport
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Quick actions
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-1 p-3">
            <MenuAction
              href="/onboarding?edit=passport"
              icon={<PenLine className="h-4 w-4" />}
              title="Edit Passport"
              onClick={() => setOpen(false)}
            />

            <MenuAction
              href="/settings"
              icon={<Settings className="h-4 w-4" />}
              title="Settings"
              onClick={() => setOpen(false)}
            />

            <button
              type="button"
              onClick={() =>
                signOut({
                  callbackUrl: "/login",
                })
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuAction({
  href,
  icon,
  title,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-100"
    >
      <span className="text-slate-500">{icon}</span>
      {title}
    </Link>
  );
}
