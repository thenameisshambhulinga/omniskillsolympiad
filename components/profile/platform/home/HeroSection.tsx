// import PosterAnnouncementCarousel from "@/components/landing/PosterAnnouncementCarousel";
// import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";

// export default async function HeroSection() {
//   const posters = await getPublishedAnnouncementPosters();

//   return (
//     <section className="relative z-10 overflow-hidden px-4 pb-14 pt-4 text-white sm:px-6 md:px-10 lg:px-16 lg:pb-20 lg:pt-8">
//       <div aria-hidden="true" className="pointer-events-none absolute inset-0">
//         <div className="absolute left-[-140px] top-[-40px] h-[360px] w-[360px] rounded-full bg-purple-600/20 blur-3xl" />
//         <div className="absolute bottom-[-140px] right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-3xl" />
//         <div className="absolute left-[45%] top-[12%] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
//         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:90px_90px] opacity-60" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_36%)]" />
//       </div>

//       <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-9 lg:grid-cols-[1.12fr_0.88fr] xl:gap-11">
//         {posters.length === 0 ? (
//           <div className="min-h-[520px] rounded-[2.75rem] border border-cyan-300/20 bg-white/[0.035] p-10 shadow-[0_42px_180px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
//             <p className="text-center text-base font-bold text-white/80">
//               No live posters yet. Admin can publish posters from Announcement
//               Center.
//             </p>
//           </div>
//         ) : (
//           <PosterAnnouncementCarousel posters={posters} />
//         )}

//         <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8">
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_34%)]"
//           />

//           <div className="relative z-10">
//             {/* KEEP YOUR EXISTING RIGHT-SIDE LOGIN CARD CODE HERE UNCHANGED */}

//             <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center text-white/50">
//               Paste your existing login card JSX here exactly as it was.
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


import OsoHeroExperience from "@/components/profile/platform/home/OsoHeroExperience";
import { getPublishedAnnouncementPosters } from "@/lib/announcement-posters";

export default async function HeroSection() {
  const posters = await getPublishedAnnouncementPosters();

  return <OsoHeroExperience posters={posters} />;
}