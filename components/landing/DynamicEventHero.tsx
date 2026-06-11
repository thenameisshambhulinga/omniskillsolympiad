// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import { motion, useReducedMotion } from "framer-motion";
// import {
//   ArrowRight,
//   CalendarDays,
//   Clock,
//   Radio,
//   Sparkles,
//   Zap,
// } from "lucide-react";

// import HoverScale from "@/components/motion/HoverScale";
// import MotionWrapper from "@/components/motion/MotionWrapper";


// type CountdownValue = {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// };

// function getCountdown(eventDate: string): CountdownValue {
//   const target = new Date(eventDate).getTime();
//   const now = Date.now();
//   const diff = Math.max(target - now, 0);

//   return {
//     days: Math.floor(diff / (1000 * 60 * 60 * 24)),
//     hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
//     minutes: Math.floor((diff / (1000 * 60)) % 60),
//     seconds: Math.floor((diff / 1000) % 60),
//   };
// }

// function getStatusClass(status: EventHeroStatus) {
//   if (status === "Live") {
//     return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-[0_0_26px_rgba(52,211,153,0.18)]";
//   }

//   if (status === "Registration Closing Soon") {
//     return "border-amber-400/30 bg-amber-400/10 text-amber-200 shadow-[0_0_26px_rgba(251,191,36,0.18)]";
//   }

//   if (status === "Completed") {
//     return "border-white/15 bg-white/[0.05] text-white/60";
//   }

//   if (status === "Registration Open") {
//     return "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.18)]";
//   }

//   return "border-purple-400/30 bg-purple-400/10 text-purple-200 shadow-[0_0_26px_rgba(168,85,247,0.18)]";
// }

// export default function DynamicEventHero({
//   event,
// }: {
//   event: EventHeroConfig;
// }) {
//   const shouldReduceMotion = useReducedMotion();

//   const [countdown, setCountdown] = useState<CountdownValue>(() =>
//     getCountdown(event.eventDate),
//   );

//   useEffect(() => {
//     const timer = window.setInterval(() => {
//       setCountdown(getCountdown(event.eventDate));
//     }, 1000);

//     return () => window.clearInterval(timer);
//   }, [event.eventDate]);

//   const eventDateLabel = useMemo(() => {
//     return new Date(event.eventDate).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }, [event.eventDate]);

//   return (
//     <MotionWrapper>
//       <section
//         aria-label="Featured Silicon Skillathon event"
//         className="group relative min-h-[620px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] shadow-[0_34px_150px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
//       >
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute inset-0"
//         >
//           <motion.img
//             src={event.bannerImageUrl}
//             alt=""
//             animate={shouldReduceMotion ? undefined : { scale: [1, 1.045, 1] }}
//             transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute inset-0 h-full w-full object-cover opacity-75"
//           />

//           <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.97),rgba(2,6,23,0.76),rgba(2,6,23,0.38)),radial-gradient(circle_at_top_left,rgba(34,211,238,0.36),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.32),transparent_38%)]" />

//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] opacity-35 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

//           <motion.div
//             animate={
//               shouldReduceMotion
//                 ? undefined
//                 : { opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }
//             }
//             transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl"
//           />

//           <motion.div
//             animate={
//               shouldReduceMotion
//                 ? undefined
//                 : { opacity: [0.25, 0.58, 0.25], scale: [1.06, 1, 1.06] }
//             }
//             transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
//             className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-purple-500/18 blur-3xl"
//           />

//           <motion.div
//             animate={shouldReduceMotion ? undefined : { x: ["-35%", "135%"] }}
//             transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
//             className="absolute left-0 top-0 h-px w-1/2 bg-linear-to-r from-transparent via-cyan-300/90 to-transparent"
//           />

//           {[
//             "left-[12%] top-[18%]",
//             "left-[34%] top-[76%]",
//             "left-[56%] top-[14%]",
//             "left-[78%] top-[30%]",
//             "left-[90%] top-[70%]",
//           ].map((position, index) => (
//             <motion.span
//               key={position}
//               animate={
//                 shouldReduceMotion
//                   ? undefined
//                   : { opacity: [0.18, 0.82, 0.18], y: [0, -14, 0] }
//               }
//               transition={{
//                 duration: 3.5 + index,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//               className={`absolute h-1.5 w-1.5 rounded-full bg-cyan-200/70 shadow-[0_0_18px_rgba(103,232,249,0.85)] ${position}`}
//             />
//           ))}
//         </div>

//         <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-6 sm:p-8 lg:p-10">
//           <div className="flex flex-wrap items-center gap-3">
//             <motion.span
//               animate={
//                 shouldReduceMotion
//                   ? undefined
//                   : { y: [0, -4, 0], rotate: [-0.4, 0.4, -0.4] }
//               }
//               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//               className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.16)] backdrop-blur-xl"
//             >
//               <Sparkles className="h-4 w-4" />
//               {event.category}
//             </motion.span>

//             <span
//               className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-xl ${getStatusClass(
//                 event.status,
//               )}`}
//             >
//               <Radio className="h-4 w-4" />
//               {event.status}
//             </span>
//           </div>

//           <div className="max-w-3xl">
//             <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-200">
//               Upcoming Event
//             </p>

//             <motion.h1
//               initial={
//                 shouldReduceMotion
//                   ? { opacity: 1 }
//                   : { opacity: 0, y: 22, filter: "blur(8px)" }
//               }
//               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//               transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//               className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl"
//             >
//               {event.title}
//             </motion.h1>

//             <motion.p
//               initial={
//                 shouldReduceMotion
//                   ? { opacity: 1 }
//                   : { opacity: 0, y: 16, filter: "blur(6px)" }
//               }
//               animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//               transition={{ duration: 0.55, delay: 0.12 }}
//               className="mt-6 max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg"
//             >
//               {event.subtitle}
//             </motion.p>

//             <div className="mt-8 flex flex-col gap-4 sm:flex-row">
//               <HoverScale>
//                 <Link
//                   href={event.ctaHref}
//                   className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-cyan-400/30 bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-black shadow-[0_0_44px_rgba(34,211,238,0.24)] transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
//                 >
//                   {event.ctaLabel}
//                   <ArrowRight className="h-5 w-5" />
//                 </Link>
//               </HoverScale>

//               <div className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-bold text-white/75 backdrop-blur-xl">
//                 <CalendarDays className="h-5 w-5 text-cyan-200" />
//                 {eventDateLabel}
//               </div>
//             </div>
//           </div>

//           <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
//             <div className="rounded-[2rem] border border-white/10 bg-black/35 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
//               <div className="mb-4 flex items-center gap-3">
//                 <Clock className="h-5 w-5 text-cyan-200" />
//                 <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
//                   Event Countdown
//                 </p>
//               </div>

//               <div className="grid grid-cols-4 gap-2">
//                 <CountdownBlock label="Days" value={countdown.days} />
//                 <CountdownBlock label="Hours" value={countdown.hours} />
//                 <CountdownBlock label="Min" value={countdown.minutes} />
//                 <CountdownBlock label="Sec" value={countdown.seconds} />
//               </div>
//             </div>

//             <div className="rounded-[2rem] border border-white/10 bg-black/35 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
//               <div className="mb-4 flex items-center gap-3">
//                 <Zap className="h-5 w-5 text-purple-200" />
//                 <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">
//                   Event Highlights
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 {event.highlights.map((highlight) => (
//                   <div
//                     key={highlight.label}
//                     className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.06]"
//                   >
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200/70">
//                       {highlight.label}
//                     </p>
//                     <p className="mt-1 text-sm font-bold text-white/75">
//                       {highlight.value}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </MotionWrapper>
//   );
// }

// function CountdownBlock({ label, value }: { label: string; value: number }) {
//   const shouldReduceMotion = useReducedMotion();

//   return (
//     <motion.div
//       animate={shouldReduceMotion ? undefined : { opacity: [0.82, 1, 0.82] }}
//       transition={{ duration: 1.6, repeat: Infinity }}
//       className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-center shadow-[0_0_24px_rgba(34,211,238,0.08)]"
//     >
//       <p className="text-2xl font-black tabular-nums text-cyan-100 sm:text-3xl">
//         {String(value).padStart(2, "0")}
//       </p>

//       <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/40">
//         {label}
//       </p>
//     </motion.div>
//   );
// }
