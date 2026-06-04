"use client";

import { useEffect, useState } from "react";
import { PlayCircle, StopCircle } from "lucide-react";

import type { Shift } from "@/types/shift";
import { formatDateTime, getElapsedTime } from "./shift.utils";

type Props = {
  activeShift: Shift | null;
  isEmployee: boolean;
  isClockingIn: boolean;
  isClockingOut: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
};

export default function ActiveShiftCard({
  activeShift,
  isEmployee,
  isClockingIn,
  isClockingOut,
  onClockIn,
  onClockOut,
}: Props) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!activeShift) {
      setElapsed("");
      return;
    }

    setElapsed(getElapsedTime(activeShift.clockIn));

    const timer = setInterval(() => {
      setElapsed(getElapsedTime(activeShift.clockIn));
    }, 60_000);

    return () => {
      clearInterval(timer);
    };
  }, [activeShift]);

  if (!isEmployee) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Shift Control</h2>

        <p className="mt-2 text-sm text-gray-500">
          Clock in and clock out are only available for employees.
        </p>
      </div>
    );
  }

  if (!activeShift) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Shift Control</h2>

        <p className="mt-2 text-sm text-gray-500">
          You are not clocked in right now.
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={isClockingIn}
            onClick={onClockIn}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            <PlayCircle size={18} />
            {isClockingIn ? "Clocking In..." : "Clock In"}
          </button>

          <button
            type="button"
            disabled
            title="Clock out requires an active shift"
            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-400"
          >
            <StopCircle size={18} />
            Clock Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Active Shift</h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Clock In Time</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {formatDateTime(activeShift.clockIn)}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Elapsed Time</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {elapsed || "0h 0m"}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={isClockingOut}
        onClick={onClockOut}
        className="mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        <StopCircle size={18} />
        {isClockingOut ? "Clocking Out..." : "Clock Out"}
      </button>
    </div>
  );
}
