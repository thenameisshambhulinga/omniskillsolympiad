"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_50%_95%,rgba(59,130,246,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
        <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-36 top-24 h-[38rem] w-[38rem] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[32rem] w-[32rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 p-4 xl:w-80 lg:block">
          <AdminSidebar />
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close admin navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />

              <motion.aside
                initial={{ x: -340, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -340, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="fixed inset-y-0 left-0 z-50 w-[min(22rem,calc(100vw-2rem))] p-3 lg:hidden"
              >
                <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="relative z-10 flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
