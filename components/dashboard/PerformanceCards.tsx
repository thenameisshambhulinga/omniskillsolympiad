"use client";

import MotionWrapper from "@/components/motion/MotionWrapper";
import HoverScale from "@/components/motion/HoverScale";
import GlassCard from "@/components/ui/GlassCard";
import MetricInfoTooltip from "@/components/dashboard/intelligence/MetricInfoTooltip";

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
  const tooltipMap: Record<
    string,
    {
      title: string;
      description: string;
      improvement?: string;
      rewardImpact?: string;
    }
  > = {
    "Daily Challenges": {
      title: "Daily Challenges",
      description:
        "Your completed challenge count shows how consistently you return to the platform.",
      improvement: "Complete one challenge per day to build momentum.",
      rewardImpact: "Consistency drives streak strength and point growth.",
    },
    "Average Accuracy": {
      title: "Accuracy",
      description: "Percentage of correct answers from attempted questions.",
      improvement: "Review weak topics and avoid random guessing.",
      rewardImpact:
        "High accuracy improves competition confidence and ranking strength.",
    },
    "Questions Attempted": {
      title: "Questions Attempted",
      description:
        "Total questions you have tried during your learning sessions.",
      improvement: "Practice more attempts to improve consistency.",
      rewardImpact:
        "More attempts help you learn faster and improve confidence.",
    },
    "Correct Answers": {
      title: "Correct Answers",
      description: "How many of your attempts were answered correctly.",
      improvement: "Focus on high-value review topics to raise this number.",
      rewardImpact:
        "Correct answers strengthen your accuracy and ranking profile.",
    },
    "Mock Tests": {
      title: "Competition Momentum",
      description:
        "A visual signal of your recent platform activity and competitive consistency.",
      improvement:
        "Complete missions, maintain streaks, and participate in events.",
      rewardImpact:
        "Momentum helps you understand whether your growth is accelerating.",
    },
    OmniScore: {
      title: "Omni Score",
      description:
        "A blended measure of your platform performance and competition readiness.",
      improvement: "Keep accuracy, streak, and challenge routines strong.",
      rewardImpact:
        "This score supports your engineering profile and visibility.",
    },
    "Success Rate": {
      title: "Success Rate",
      description:
        "Your overall answer success percentage across attempted questions.",
      improvement: "Use your review time to improve weak topic accuracy.",
      rewardImpact:
        "Stronger success rate improves your competitive confidence.",
    },
  };

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
      <section className="grid gap-8 lg:grid-cols-4">
        {cards.map((card) => (
          <HoverScale key={card.title}>
            <GlassCard className="relative h-45 min-w-55 overflow-visible p-8">
              <div className="flex items-center justify-between gap-2">
                <p className="whitespace-nowrap text-xs uppercase tracking-[0.28em] text-white/45">
                  {card.title}
                </p>
                {tooltipMap[card.title] && (
                  <MetricInfoTooltip {...tooltipMap[card.title]} />
                )}
              </div>

              <h2 className="mt-6 whitespace-nowrap text-5xl font-black tracking-tight text-white">
                {card.value}
              </h2>

              <p className="mt-4 truncate text-sm text-white/55">
                {card.subtitle}
              </p>
            </GlassCard>
          </HoverScale>
        ))}
      </section>
    </MotionWrapper>
  );
}
