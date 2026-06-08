"use client";

import {CheckCircle,FolderKanban,Clock,ActivityIcon,} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { formatHoursToHms } from "@/lib/time";
import { useGetDashboardQuery } from "@/redux/services/dashboardApi";
import type { User } from "@/types/auth";
import type { DashboardData } from "@/types/dashboard";
import StatCard from "./StatCard";
import RecentActivityList from "./RecentActivity";

type Props = {
  dashboardError?: string | null;
  hasServerToken?: boolean;
  initialDashboard?: DashboardData | null;
  initialUser?: User | null;
};

export default function DashboardView({
  dashboardError,
  hasServerToken = false,
  initialDashboard = null,
  initialUser = null,
}: Props) {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery(undefined, {
    skip: Boolean(initialDashboard),
  });

  const dashboard = data?.data || initialDashboard;

  if (isLoading && !dashboard) {
    return (
      <DashboardLayout hasServerToken={hasServerToken} initialUser={initialUser}>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !dashboard) {
    return (
      <DashboardLayout hasServerToken={hasServerToken} initialUser={initialUser}>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Failed to load dashboard
          </h1>

          {dashboardError && (
            <p className="mt-2 text-sm text-gray-500">{dashboardError}</p>
          )}

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout hasServerToken={hasServerToken} initialUser={initialUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of projects, tasks, shifts, and recent activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Completed Tasks"
            value={dashboard.completedTasks}
            icon={CheckCircle}
          />

          <StatCard
            title="Active Projects"
            value={dashboard.activeProjects}
            icon={FolderKanban}
          />

          <StatCard
            title="Weekly Hours"
            value={formatHoursToHms(dashboard.weeklyWorkedHours)}
            icon={Clock}
          />

          <StatCard
            title="Recent Activities"
            value={dashboard.recentActivity.length}
            icon={ActivityIcon}
          />
        </div>

        <RecentActivityList activities={dashboard.recentActivity} />
      </div>
    </DashboardLayout>
  );
}
