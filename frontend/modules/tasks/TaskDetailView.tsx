"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import DataTable, { DataColumn } from "@/components/shared/DataTable";

import type { User } from "@/types/auth";
import { useGetTaskByIdQuery } from "@/redux/services/taskApi";
import { StatusBadge } from "@/lib/statusColors";

import TaskCommentForm from "./TaskCommentForm";
import TaskCommentsList from "./TaskCommentsList";

export default function TaskDetailView() {
  const params = useParams();
  const router = useRouter();

  const taskId = Number(params.id);

  const { data, isLoading, isError, refetch } = useGetTaskByIdQuery(taskId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading task details..." />
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <ErrorState
          message="Failed to load task details."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  if (!data?.data) {
    return (
      <DashboardLayout>
        <EmptyState message="Task not found." />
      </DashboardLayout>
    );
  }

  const task = data.data;

  const assignedUsers = task.assignedUsers || [];

  const assignedColumns: DataColumn<User>[] = [
    {
      header: "Name",
      render: (user) => (
        <p className="font-medium text-gray-900">{user.name}</p>
      ),
    },
    {
      header: "Email",
      render: (user) => user.email,
    },
    {
      header: "Role",
      render: (user) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {user.role}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => router.push("/tasks")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Tasks
        </button>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {task.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {task.description || "No description"}
              </p>
            </div>

            <div className="w-fit">
              <StatusBadge status={task.status?.name || String(task.statusId)} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Project</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.project?.title || `Project #${task.projectId}`}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.dueDate || "No due date"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {task.creator?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Assigned Users</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {assignedUsers.length}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Assigned Users
          </h2>

          {assignedUsers.length === 0 ? (
            <EmptyState message="No users assigned to this task." />
          ) : (
            <DataTable
              columns={assignedColumns}
              data={assignedUsers}
              rowKey={(user) => user.id}
            />
          )}
        </div>

        <TaskCommentForm taskId={task.id} />

        <TaskCommentsList taskId={task.id} />
      </div>
    </DashboardLayout>
  );
}