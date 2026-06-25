import {
  MAX_PROTECTED_TEST_QUESTIONS,
  MIN_PROTECTED_TEST_QUESTIONS,
  PROTECTED_TEST_DURATION_MINUTES,
} from "@/lib/quiz/quiz-policy";

export type ImportedQuizQuestion = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  points: number;
};

export type ProtectedQuizImportPayload = {
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration: number;
  isActive: boolean;
  questions: ImportedQuizQuestion[];
};

function cleanText(value: unknown) {
  return String(value ?? "").trim();
}

function cleanOptionalText(value: unknown) {
  const text = cleanText(value);
  return text.length > 0 ? text : null;
}

function cleanNumber(value: unknown, fallback: number) {
  const valueAsNumber = Number(value);

  if (!Number.isFinite(valueAsNumber)) {
    return fallback;
  }

  return Math.round(valueAsNumber);
}

function parseJson(value: string) {
  try {
    return {
      ok: true as const,
      data: JSON.parse(value) as unknown,
    };
  } catch {
    return {
      ok: false as const,
      error: "Invalid JSON. Paste a valid JSON array of questions.",
    };
  }
}

function normalizeCorrectAnswer(value: string) {
  const answer = cleanText(value);

  if (["A", "B", "C", "D"].includes(answer.toUpperCase())) {
    return answer.toUpperCase();
  }

  return answer;
}

function validateQuestion(
  rawQuestion: unknown,
  index: number,
):
  | {
      ok: true;
      question: ImportedQuizQuestion;
    }
  | {
      ok: false;
      error: string;
    } {
  if (!rawQuestion || typeof rawQuestion !== "object" || Array.isArray(rawQuestion)) {
    return {
      ok: false,
      error: `Question ${index + 1} must be an object.`,
    };
  }

  const source = rawQuestion as Record<string, unknown>;

  const question = cleanText(source.question);
  const optionA = cleanText(source.optionA);
  const optionB = cleanText(source.optionB);
  const optionC = cleanText(source.optionC);
  const optionD = cleanText(source.optionD);
  const correctAnswer = normalizeCorrectAnswer(cleanText(source.correctAnswer));
  const points = Math.max(1, Math.min(20, cleanNumber(source.points, 1)));

  if (!question) {
    return {
      ok: false,
      error: `Question ${index + 1}: question text is required.`,
    };
  }

  if (!optionA || !optionB || !optionC || !optionD) {
    return {
      ok: false,
      error: `Question ${index + 1}: all four options are required.`,
    };
  }

  const options = [optionA, optionB, optionC, optionD];

  if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
    return {
      ok: false,
      error: `Question ${index + 1}: options must be unique.`,
    };
  }

  const correctAnswerText =
    correctAnswer === "A"
      ? optionA
      : correctAnswer === "B"
        ? optionB
        : correctAnswer === "C"
          ? optionC
          : correctAnswer === "D"
            ? optionD
            : correctAnswer;

  if (
    !options.some(
      (option) =>
        option.trim().toLowerCase() === correctAnswerText.trim().toLowerCase(),
    )
  ) {
    return {
      ok: false,
      error: `Question ${index + 1}: correctAnswer must match one of the options or be A/B/C/D.`,
    };
  }

  return {
    ok: true,
    question: {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer: correctAnswerText,
      points,
    },
  };
}

export function validateProtectedQuizImport(input: {
  title: unknown;
  description: unknown;
  category: unknown;
  difficulty: unknown;
  duration: unknown;
  isActive: unknown;
  questionsJson: unknown;
}):
  | {
      ok: true;
      data: ProtectedQuizImportPayload;
    }
  | {
      ok: false;
      error: string;
    } {
  const title = cleanText(input.title);
  const description = cleanOptionalText(input.description);
  const category = cleanText(input.category) || "Protected Test";
  const difficulty = cleanText(input.difficulty) || "Intermediate";
  const duration = cleanNumber(input.duration, PROTECTED_TEST_DURATION_MINUTES);
  const questionsJson = cleanText(input.questionsJson);

  if (!title) {
    return {
      ok: false,
      error: "Quiz title is required.",
    };
  }

  if (!questionsJson) {
    return {
      ok: false,
      error: "Questions JSON is required.",
    };
  }

  if (duration !== PROTECTED_TEST_DURATION_MINUTES) {
    return {
      ok: false,
      error: `Protected test duration must be exactly ${PROTECTED_TEST_DURATION_MINUTES} minutes.`,
    };
  }

  const parsed = parseJson(questionsJson);

  if (!parsed.ok) {
    return parsed;
  }

  if (!Array.isArray(parsed.data)) {
    return {
      ok: false,
      error: "Questions JSON must be an array.",
    };
  }

  if (
    parsed.data.length < MIN_PROTECTED_TEST_QUESTIONS ||
    parsed.data.length > MAX_PROTECTED_TEST_QUESTIONS
  ) {
    return {
      ok: false,
      error: `Protected test must have ${MIN_PROTECTED_TEST_QUESTIONS} to ${MAX_PROTECTED_TEST_QUESTIONS} questions. Current count: ${parsed.data.length}.`,
    };
  }

  const questions: ImportedQuizQuestion[] = [];

  for (let index = 0; index < parsed.data.length; index++) {
    const validation = validateQuestion(parsed.data[index], index);

    if (!validation.ok) {
      return validation;
    }

    questions.push(validation.question);
  }

  return {
    ok: true,
    data: {
      title,
      description,
      category,
      difficulty,
      duration,
      isActive: Boolean(input.isActive),
      questions,
    },
  };
}
