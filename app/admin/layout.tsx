import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-72 border-r border-zinc-800 p-6 fixed h-full bg-zinc-900">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Admin</h2>

            <p className="text-zinc-400 text-sm">Enterprise Control</p>
          </div>

          <LogoutButton />
        </div>
        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/create-daily-challenge"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            Create Challenge
          </Link>

          <Link
            href="/admin/manage-challenges"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            Manage Challenges
          </Link>

          <Link
            href="/daily-leaderboard"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            Leaderboard Analytics
          </Link>

          <Link
            href="/admin/competition"
            className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
          >
            Competition Control
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-72 p-8">{children}</main>
    </div>
  );
}
