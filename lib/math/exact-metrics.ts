export const BASIS_POINTS_SCALE = 10_000;
export const PERCENT_SCALE = 100;

export function clampInteger(
  value: unknown,
  minimum: number,
  maximum: number,
  fallback = minimum,
) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(minimum, Math.min(maximum, Math.round(parsed)));
}

export function ratioToBasisPoints(numerator: number, denominator: number) {
  const safeNumerator = clampInteger(numerator, 0, Number.MAX_SAFE_INTEGER, 0);
  const safeDenominator = clampInteger(denominator, 0, Number.MAX_SAFE_INTEGER, 0);

  if (safeDenominator === 0) return 0;

  return Math.min(
    BASIS_POINTS_SCALE,
    Math.round((safeNumerator * BASIS_POINTS_SCALE) / safeDenominator),
  );
}

export function basisPointsToPercentage(basisPoints: number) {
  return clampInteger(basisPoints, 0, BASIS_POINTS_SCALE, 0) / PERCENT_SCALE;
}

export function percentageToBasisPoints(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return clampInteger(fallback, 0, BASIS_POINTS_SCALE, 0);
  }

  return clampInteger(parsed * PERCENT_SCALE, 0, BASIS_POINTS_SCALE, fallback);
}

export function compareRatiosDescending(
  leftNumerator: number,
  leftDenominator: number,
  rightNumerator: number,
  rightDenominator: number,
) {
  const leftDen = clampInteger(leftDenominator, 0, Number.MAX_SAFE_INTEGER, 0);
  const rightDen = clampInteger(rightDenominator, 0, Number.MAX_SAFE_INTEGER, 0);

  if (leftDen === 0 && rightDen === 0) return 0;
  if (leftDen === 0) return 1;
  if (rightDen === 0) return -1;

  const leftNum = clampInteger(leftNumerator, 0, Number.MAX_SAFE_INTEGER, 0);
  const rightNum = clampInteger(rightNumerator, 0, Number.MAX_SAFE_INTEGER, 0);

  const leftCross = BigInt(leftNum) * BigInt(rightDen);
  const rightCross = BigInt(rightNum) * BigInt(leftDen);

  if (leftCross === rightCross) return 0;
  return leftCross > rightCross ? -1 : 1;
}

export function safeElapsedMilliseconds(
  startedAt: Date | string | null | undefined,
  submittedAt: Date | string | null | undefined,
) {
  if (!startedAt || !submittedAt) return Number.MAX_SAFE_INTEGER;

  const start = new Date(startedAt).getTime();
  const end = new Date(submittedAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Math.min(Number.MAX_SAFE_INTEGER, Math.round(end - start));
}

export function weightedAverageBasisPoints({
  previousAverageBasisPoints,
  previousCount,
  nextBasisPoints,
}: {
  previousAverageBasisPoints: number;
  previousCount: number;
  nextBasisPoints: number;
}) {
  const count = clampInteger(previousCount, 0, Number.MAX_SAFE_INTEGER, 0);
  const previous = clampInteger(
    previousAverageBasisPoints,
    0,
    BASIS_POINTS_SCALE,
    0,
  );
  const next = clampInteger(nextBasisPoints, 0, BASIS_POINTS_SCALE, 0);

  return Math.round((previous * count + next) / (count + 1));
}
