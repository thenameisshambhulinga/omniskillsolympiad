"use client";

import GlassCard from "@/components/ui/GlassCard";
import HoverScale from "@/components/motion/HoverScale";
import MotionWrapper from "@/components/motion/MotionWrapper";

type Props = {
  completedChallenges: number;
  totalChallenges: number;
  averageAccuracy: number;
  mockTests: number;
  worldSkillsScore: number;
  totalQuestionsAttempted?: number;
  totalCorrectAnswers?: number;
  successRate?: number;
};

export default function PerformanceCards({
  completedChallenges,
  totalChallenges,
  averageAccuracy,
  mockTests,
  worldSkillsScore,
  totalQuestionsAttempted,
  totalCorrectAnswers,
  successRate,
}: Props) {
  const cards = [
    {
      title: "Daily Challenges",
      value: `${completedChallenges}/${totalChallenges}`,
      subtitle: "Completed Successfully",
    },

    {
      title: "Average Accuracy",
      value: `${averageAccuracy}%`,
      subtitle: "Technical Performance",
    },

    ...(totalQuestionsAttempted !== undefined &&
    totalCorrectAnswers !== undefined
      ? [
          {
            title: "Questions Attempted",
            value: totalQuestionsAttempted,
            subtitle: "Total Questions",
          },
          {
            title: "Correct Answers",
            value: totalCorrectAnswers,
            subtitle: "Accurate Responses",
          },
        ]
      : []),

    {
      title: "Mock Tests",
      value: mockTests,
      subtitle: "Tests Attempted",
    },

    {
      title: "Omni Score",
      value: worldSkillsScore,
      subtitle: "Competition Rating",
    },

    ...(successRate !== undefined
      ? [
          {
            title: "Success Rate",
            value: `${successRate}%`,
            subtitle: "Overall Performance",
          },
        ]
      : []),
  ];

  return (
    <MotionWrapper>
      <section
        aria-label="Performance metrics"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6"
      >
        {cards.map((card, index) => (
          <HoverScale key={card.title}>
            <GlassCard className="group relative h-full min-h-37.5 justify-between overflow-hidden p-5 sm:p-6 md:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition duration-500 group-hover:bg-cyan-400/20"
              />

              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                    {card.title}
                  </p>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                  {card.value}
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/60">
                  {card.subtitle}
                </p>

                <div
                  aria-hidden="true"
                  className="mt-6 h-px w-full bg-linear-to-r from-cyan-400/40 via-white/10 to-transparent"
                />
              </div>
            </GlassCard>
          </HoverScale>
        ))}
      </section>
    </MotionWrapper>
  );
}
