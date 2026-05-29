type Props = {
  questions: any[];
};

export default function QuestionLibrary({ questions }: Props) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <h2 className="text-3xl font-bold">Question Library</h2>

      <div className="mt-8 space-y-6">
        {questions.map((question) => (
          <div
            key={question.id}
            className="rounded-3xl border border-white/10 bg-black/30 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                Difficulty: {question.difficulty}
              </span>
            </div>

            <h3 className="text-2xl font-bold">{question.question}</h3>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-black/40 p-5">
                <p className="mb-4 text-sm text-white/50">Correct Answer</p>

                <p className="text-xl font-bold text-green-400">
                  {question.correctAnswer}
                </p>
              </div>

              <div className="rounded-2xl bg-black/40 p-5">
                <p className="mb-4 text-sm text-white/50">Options</p>

                <div className="space-y-2">
                  <p>A. {question.optionA}</p>
                  <p>B. {question.optionB}</p>
                  <p>C. {question.optionC}</p>
                  <p>D. {question.optionD}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-white/50">
            No questions added yet.
          </div>
        )}
      </div>
    </div>
  );
}
