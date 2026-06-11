const DEFAULT_PREFIX = "OMNI";
const DEFAULT_YEAR = "2026";
const DEFAULT_LENGTH = 5;

function createNumericToken(length: number): string {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  const value = Math.floor(Math.random() * (max - min + 1)) + min;

  return String(value);
}

export function generateStudentId({
  prefix = DEFAULT_PREFIX,
  year = DEFAULT_YEAR,
  length = DEFAULT_LENGTH,
}: {
  prefix?: string;
  year?: string;
  length?: number;
} = {}): string {
  const safePrefix = prefix.trim().toUpperCase() || DEFAULT_PREFIX;
  const safeYear = year.trim() || DEFAULT_YEAR;
  const safeLength =
    Number.isFinite(length) && length >= 4 ? length : DEFAULT_LENGTH;

  return `${safePrefix}-${safeYear}-${createNumericToken(safeLength)}`;
}
