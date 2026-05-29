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
    <section className="grid gap-8 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-[32px] border border-white/10 bg-white/3 p-8"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-white/50">
            {card.title}
          </p>

          <h2 className="mt-6 text-5xl font-black">{card.value}</h2>

          <p className="mt-4 text-white/60">{card.subtitle}</p>
        </div>
      ))}
    </section>
  );
}
