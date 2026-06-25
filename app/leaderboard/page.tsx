import { redirect } from "next/navigation";


export default function LeaderboardPage() {
  redirect("/daily-leaderboard");
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";