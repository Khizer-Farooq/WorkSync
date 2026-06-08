"use client";

import { useParams, useRouter } from "next/navigation";
import {ArrowLeft,Briefcase,CalendarDays,CheckSquare,Clock,FolderKanban,Mail,UserCheck,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import StatCard from "@/modules/dashboard/StatCard";
import { useGetUserByIdQuery } from "@/redux/services/userApi";

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function UserDetailView() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const { data, isLoading, isError, refetch } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  if (!userId) {
    return (
      <DashboardLayout>
        <EmptyState message="User not found." />
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading user details..." />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Failed to load user details."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  if (!data?.data) {
    return (
      <DashboardLayout>
        <EmptyState message="User not found." />
      </DashboardLayout>
    );
  }

  const user = data.data;
  const stats = user.stats;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.push("/users")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </span>
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                user.role === "ADMIN"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Department</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user.department?.name || "No department"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Account Status</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user.isActive === false ? "Inactive" : "Active"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Role</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user.role}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Created Projects"
            value={stats?.createdProjects || 0}
            icon={FolderKanban}
          />
          <StatCard
            title="Project Memberships"
            value={stats?.projectMemberships || 0}
            icon={Briefcase}
          />
          <StatCard
            title="Created Tasks"
            value={stats?.createdTasks || 0}
            icon={CheckSquare}
          />
          <StatCard
            title="Assigned Tasks"
            value={stats?.assignedTasks || 0}
            icon={UserCheck}
          />
          <StatCard
            title="Shifts Logged"
            value={stats?.shiftsLogged || 0}
            icon={Clock}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
