import { createElement } from "react";

/**
 * Maps status values to professional colors
 */
type StatusColor = {
  bg: string;
  text: string;
};

export const getStatusColor = (value: string): StatusColor => {
  const statusLower = value?.toLowerCase() || "";

  // Task statuses
  if (
    statusLower.includes("pending") ||
    statusLower.includes("todo") ||
    statusLower.includes("backlog")
  ) {
    return { bg: "bg-amber-50", text: "text-amber-700" };
  }

  if (
    statusLower.includes("in progress") ||
    statusLower.includes("inprogress") ||
    statusLower.includes("doing")
  ) {
    return { bg: "bg-blue-50", text: "text-blue-700" };
  }

  if (
    statusLower.includes("completed") ||
    statusLower.includes("done") ||
    statusLower.includes("closed")
  ) {
    return { bg: "bg-green-50", text: "text-green-700" };
  }

  if (
    statusLower.includes("blocked") ||
    statusLower.includes("failed") ||
    statusLower.includes("error") ||
    statusLower.includes("cancelled")
  ) {
    return { bg: "bg-red-50", text: "text-red-700" };
  }

  if (statusLower.includes("on hold") || statusLower.includes("onhold")) {
    return { bg: "bg-orange-50", text: "text-orange-700" };
  }

  // Project statuses
  if (statusLower === "completed") {
    return { bg: "bg-green-50", text: "text-green-700" };
  }

  if (statusLower === "in-progress") {
    return { bg: "bg-blue-50", text: "text-blue-700" };
  }

  if (statusLower === "pending" || statusLower === "planned") {
    return { bg: "bg-amber-50", text: "text-amber-700" };
  }

  // Default fallback
  return { bg: "bg-slate-100", text: "text-slate-700" };
};

export const StatusBadge = ({ status }: { status: string }) => {
  const { bg, text } = getStatusColor(status);

  return createElement(
    "span",
    {
      className: `rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`,
    },
    status
  );
};

