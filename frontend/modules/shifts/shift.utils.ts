export function formatDateTime(value?: string | null) {
  if (!value) return "N/A";

  return new Date(value).toLocaleString();
}

export function formatShiftDuration(
  clockIn?: string | null,
  clockOut?: string | null
) {
  if (!clockOut) {
    return "In progress";
  }

  if (!clockIn) {
    return "N/A";
  }

  const start = new Date(clockIn).getTime();
  const end = new Date(clockOut).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return "N/A";
  }

  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatSecondsDuration(value?: number | null) {
  const totalSeconds = Math.max(0, Math.floor(value || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getShiftStatus(clockOut?: string | null) {
  return clockOut ? "COMPLETED" : "ACTIVE";
}

export function getElapsedTime(clockIn: string) {
  const start = new Date(clockIn).getTime();
  const now = Date.now();

  const diffMs = now - start;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}
