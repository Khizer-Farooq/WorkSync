export function formatHoursToHms(hours: number) {
  const totalSeconds = Math.max(0, Math.round(hours * 60 * 60));
  const wholeHours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${wholeHours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}
