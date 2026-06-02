"use client";

import {CheckCircle,FolderKanban,Clock,ActivityIcon,} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useGetDashboardQuery } from "@/redux/services/dashboardApi";
import StatCard from "./StatCard";
import RecentActivityList from "./RecentActivity";
export default function DashboardView() {
  const { data, isLoading, isError, refetch } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !data?.data) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Failed to load dashboard
          </h1>

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

  const dashboard = data.data;

  return (
    <DashboardLayout>
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
            value={`${dashboard.weeklyWorkedHours}h`}
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