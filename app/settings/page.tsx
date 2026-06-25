import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, PenLine, Settings, ShieldCheck } from "lucide-react";

import OsoGlassSurface from "@/components/oso/OsoGlassSurface";
import OsoPageShell from "@/components/oso/OsoPageShell";
import OsoSectionHeader from "@/components/oso/OsoSectionHeader";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <OsoPageShell>
      <OsoGlassSurface hover={false} className="p-6 sm:p-8">
        <OsoSectionHeader
          eyebrow="Settings"
          title="Account settings."
          description="Keep account-level actions separate from passport editing so students do not get confused between profile viewing and profile updating."
          icon={<Settings className="h-5 w-5" />}
        />

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <Link
            href="/onboarding?edit=passport"
            className="group rounded-[1.5rem] border border-blue-200 bg-blue-50/80 p-5 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <PenLine className="h-6 w-6 text-blue-700" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Edit Skill Passport
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Update academic details, profile image, skills and career direction.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-blue-700">
              Open editor
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/profile#passport-overview"
            className="group rounded-[1.5rem] border border-slate-200 bg-white/86 p-5 transition hover:-translate-y-0.5 hover:border-blue-200"
          >
            <ShieldCheck className="h-6 w-6 text-slate-700" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              View Passport
            </h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Go back to your visible Skill Passport and public identity layer.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-blue-700">
              View passport
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </OsoGlassSurface>
    </OsoPageShell>
  );
}
