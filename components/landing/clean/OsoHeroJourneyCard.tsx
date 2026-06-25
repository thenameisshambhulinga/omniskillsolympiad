import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import GoogleIcon from "@/components/ui/GoogleIcon";
import OsoAttentionSpotlight from "@/components/landing/clean/OsoAttentionSpotlight";

type FeaturedUpdate = {
  title: string;
  description: string;
  href: string;
};

type OsoHeroJourneyCardProps = {
  featuredUpdate: FeaturedUpdate;
};

export default function OsoHeroJourneyCard({
  featuredUpdate,
}: OsoHeroJourneyCardProps) {
  return (
    <div className="space-y-4">
      <OsoAttentionSpotlight />

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-center px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              Student-first growth path
            </p>

            <h2 className="oso-heading mt-3 max-w-xl text-[2.65rem] font-black leading-[1.02] text-slate-950 sm:text-[3rem]">
              The guided proving ground for future engineers
            </h2>

            <p className="mt-5 max-w-xl text-[1.12rem] font-medium leading-9 text-slate-600">
              Discover what actually helps you grow: build skills, enter
              competitions, track your progress and convert engineering effort
              into visible recognition.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-black text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              >
                <GoogleIcon className="h-5 w-5" />
                Register with Google
              </Link>

              <Link
                href="/login"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-2 py-3 text-base font-black text-slate-950 transition duration-200 hover:text-blue-700"
              >
                <Mail className="h-5 w-5" />
                Register with Email
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-[#fbfcfe] xl:border-l xl:border-t-0">
            <div className="flex h-full items-center justify-center p-6 sm:p-8">
              <JourneyMountainIllustration />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                Latest live update
              </p>
              <h3 className="oso-heading mt-1 text-lg font-black text-slate-950">
                {featuredUpdate.title}
              </h3>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                {featuredUpdate.description}
              </p>
            </div>

            <Link
              href={featuredUpdate.href}
              className="group inline-flex items-center gap-2 self-start rounded-full bg-blue-600 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              View latest update
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyMountainIllustration() {
  return (
    <svg
      viewBox="0 0 760 520"
      className="h-auto w-full max-w-[620px]"
      role="img"
      aria-label="Illustration of a student climbing toward achievement"
      fill="none"
    >
      <path
        d="M100 390C133 314 152 283 183 281C209 279 224 301 242 333"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M221 336C258 249 290 204 330 203C365 202 392 234 421 282"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M336 278C390 152 446 78 510 77C562 76 606 156 657 294"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M230 351C280 355 310 371 348 372C404 373 448 350 495 349C544 348 583 377 627 373"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M172 433C245 409 305 412 370 431C422 446 475 457 541 446C592 438 637 416 694 379"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M501 70L501 38"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M501 39L533 45L501 56V39Z"
        fill="#f4d93d"
        stroke="#1f2430"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <path
        d="M135 473C185 470 220 471 272 484"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M247 403L286 423"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M279 404L266 447"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M292 424L294 473"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M289 474L320 504"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M282 447L256 497"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M302 378C319 380 328 390 329 406C329 427 318 438 300 438C282 438 271 429 271 409C271 391 283 378 302 378Z"
        fill="#1f2430"
      />
      <path
        d="M308 405C326 417 343 430 352 443"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M266 409L252 446"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {mountainDots(145, 294, 9)}
      {mountainDots(255, 233, 10)}
      {mountainDots(365, 166, 14)}
      {mountainDots(460, 123, 16)}
      {mountainDots(570, 247, 10)}

      <path
        d="M604 394C625 347 660 322 688 321C714 320 730 343 743 379"
        stroke="#1f2430"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function mountainDots(startX: number, startY: number, count: number) {
  const elements = [];

  for (let i = 0; i < count; i += 1) {
    for (let j = 0; j < count - i; j += 1) {
      const x = startX + j * 18 + i * 7;
      const y = startY + i * 17;
      elements.push(
        <path
          key={`${startX}-${startY}-${i}-${j}`}
          d={`M${x} ${y}c4 5 6 11 6 16`}
          stroke="#1f2430"
          strokeWidth="6"
          strokeLinecap="round"
        />,
      );
    }
  }

  return elements;
}