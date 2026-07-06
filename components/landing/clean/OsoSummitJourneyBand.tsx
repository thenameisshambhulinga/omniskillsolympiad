import Link from "next/link";
import { ArrowRight, Flag, Route, Sparkles } from "lucide-react";

import OsoJourneyIllustration from "@/components/landing/clean/OsoJourneyIllustration";

export default function OsoSummitJourneyBand() {
  return (
    <section className="mx-auto mt-12 max-w-[1280px] border-t border-slate-200 pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-700">
          Student Progression Journey
        </p>

        <h2 className="oso-heading mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
          From first login to skill recognition.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">
          OSO helps students move from onboarding to daily practice, competition
          confidence, visible milestones and stronger engineering identity.
        </p>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1160px] justify-center overflow-visible px-4">
        <OsoJourneyIllustration className="max-h-[340px] max-w-[1080px] sm:max-h-[380px] lg:max-h-[410px]" />
      </div>

      <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-3">
        <JourneySignal
          icon={<Route className="h-5 w-5" />}
          title="Onboarding"
          text="Start the climb"
        />
        <JourneySignal
          icon={<Sparkles className="h-5 w-5" />}
          title="Practice"
          text="Progress every day"
        />
        <JourneySignal
          icon={<Flag className="h-5 w-5" />}
          title="Recognition"
          text="Reach the summit"
        />
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/login"
          className="group inline-flex min-h-13 items-center justify-center gap-3 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Start your journey
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

function JourneySignal({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white/88 px-5 py-4 text-center shadow-[0_10px_28px_rgba(15,23,42,0.045)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_34px_rgba(15,23,42,0.075)]">
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
        {icon}
      </div>

      <p className="mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">{text}</p>
    </div>
  );
}