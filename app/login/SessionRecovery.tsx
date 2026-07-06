"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SessionRecovery() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    void signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-[#05091f] px-6 text-white">
      <section
        aria-live="polite"
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
      >
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-300" />
        <h1 className="mt-6 text-2xl font-black tracking-tight">
          Restoring secure sign-in
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-white/65">
          An expired local session was detected. It is being cleared before the
          login page opens.
        </p>
      </section>
    </main>
  );
}
