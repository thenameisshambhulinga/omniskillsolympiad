import HeroSection from "@/components/profile/platform/home/HeroSection";
import SkillathonEngine from "@/components/landing/SkillathonEngine";
import InnovationPoster from "@/components/landing/InnovationPoster";
import StudentJourney from "@/components/landing/StudentJourney";
import VibgyorSkillFramework from "@/components/landing/VibgyorSkillFramework";
import EventShowcase from "@/components/landing/EventShowcase";
import OutcomesSection from "@/components/landing/OutcomesSection";
import FinalCTA from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-purple-700/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:90px_90px]"
      />

      <HeroSection />

      <SkillathonEngine />

      <InnovationPoster />

      <StudentJourney />

      <VibgyorSkillFramework />

      <EventShowcase />

      <OutcomesSection />

      <FinalCTA />
    </main>
  );
}
