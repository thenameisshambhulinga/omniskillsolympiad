"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9fa] text-slate-950">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.10),transparent_28%),radial-gradient(circle_at_48%_92%,rgba(250,204,21,0.10),transparent_32%)]" />

        <div className="absolute inset-0 opacity-[0.32] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]">
          <div className="h-full w-full bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute -right-40 top-28 h-[34rem] w-[34rem] rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 shrink-0 p-4 xl:w-80 lg:block">
          <AdminSidebar />
        </aside>

        <AnimatePresence>
          {mobileSidebarOpen ? (
            <>
              <motion.button
                type="button"
                aria-label="Close admin navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
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
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader onOpenSidebar={() => setMobileSidebarOpen(true)} />

          <main className="relative z-10 flex-1 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}