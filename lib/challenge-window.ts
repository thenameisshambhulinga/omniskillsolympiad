export function getChallengeWindowStatus(startTime: Date, endTime: Date) {
  const now = new Date();

  if (now < new Date(startTime)) {
    return "UPCOMING";
  }

  if (now > new Date(endTime)) {
    return "CLOSED";
  }

  return "LIVE";
}
