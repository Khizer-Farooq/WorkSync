"use client";

import { Clock } from "lucide-react";

import { formatSecondsDuration } from "./shift.utils";

type Props = {
  weeklySeconds: number;
  isAdmin: boolean;
};

export default function WeeklyHoursCard({ weeklySeconds, isAdmin }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {isAdmin ? "Total Weekly Hours" : "Your Weekly Hours"}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            {formatSecondsDuration(weeklySeconds)}
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Completed shifts from current week.
          </p>
        </div>

        <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
          <Clock size={22} />
        </div>
      </div>
    </div>
  );
}
