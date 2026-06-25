import React from "react";

export default function OfflineState() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-300/90" />
      </div>

      <h2 className="text-2xl font-black text-white">
        Database Temporarily Unavailable
      </h2>

      <p className="mt-3 text-sm leading-7 text-white/60">
        Some competition services are currently offline. Please try again
        shortly.
      </p>
    </section>
  );
}
