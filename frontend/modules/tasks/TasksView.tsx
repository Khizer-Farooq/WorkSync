"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataToolbar from "@/components/shared/DataToolbar";
import DataPagination from "@/components/shared/DataPagination";
import DataTable, { DataColumn } from "@/components/shared/DataTable";
import ActionMenu from "@/components/shared/ActionMenu";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import AppModal from "@/components/shared/modal/AppModal";
import UserSearchSelect from "@/components/shared/users/UserSearchSelect";

import type { RootState } from "@/redux/store";
import type { Task } from "@/types/task";
import type { User } from "@/types/auth";
import { useDebounce } from "@/hooks/useDebounce";
import { StatusBadge } from "@/lib/statusColors";

import {
    useAssignTaskUsersMutation,
    useGetTasksQuery,
    useGetTaskStatusesQuery,
    useUpdateTaskMutation,
} from "@/redux/services/taskApi";
import { useGetProjectByIdQuery } from "@/redux/services/projectApi";

import TaskCreateForm from "./TaskCreateForm";
import TaskEditForm from "./TaskEditForm";

export default function TasksView() {
    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === "ADMIN";
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [search, setSearch] = useState("");
    const [statusId, setStatusId] = useState("");

    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

    const [createOpen, setCreateOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [assignTask, setAssignTask] = useState<Task | null>(null);
    const [selectedAssignUsers, setSelectedAssignUsers] = useState<User[]>([]);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading, isError, refetch } = useGetTasksQuery({
        page,
        limit,
        search: debouncedSearch || undefined,
        statusId: statusId ? Number(statusId) : undefined,
        sortBy,
        sortOrder,
    });

    const { data: statusesResponse } = useGetTaskStatusesQuery();
    const {
        data: assignProjectResponse,
        isLoading: isLoadingAssignProject,
        isError: isAssignProjectError,
    } = useGetProjectByIdQuery(assignTask?.projectId || 0, {
        skip: !assignTask,
    });

    const [updateTask] = useUpdateTaskMutation();
    const [assignUsers, { isLoading: assigningUsers }] =
        useAssignTaskUsersMutation();

    const tasks = data?.data.tasks || [];
    const pagination = data?.data.pagination;
    const statuses = statusesResponse?.data || [];
    const assignProjectMembers = assignProjectResponse?.data.members || [];

    function resetPage() {
        setPage(1);
    }

    async function handleStatusChange(task: Task, newStatusId: number) {
        await updateTask({
            id: task.id,
            body: {
                statusId: newStatusId,
            },
        });
    }

    async function handleAssignUsers() {
        if (!assignTask) return;

        await assignUsers({
            taskId: assignTask.id,
            userIds: selectedAssignUsers.map((user) => user.id),
        }).unwrap();

        setSelectedAssignUsers([]);
        setAssignTask(null);
    }

    const statusFilterOptions = [
        { label: "All Status", value: "" },
        ...statuses.map((status) => ({
            label: status.name,
            value: String(status.id),
        })),
    ];

    const columns: DataColumn<Task>[] = [
        {
  header: "Task",
  render: (task) => (
    <button
      type="button"
      onClick={() => router.push(`/tasks/${task.id}`)}
      className="text-left"
    >
      <p className="font-medium text-gray-900 hover:underline">
        {task.title}
      </p>
      <p className="text-xs text-gray-500">
        {task.description || "No description"}
      </p>
    </button>
  ),
},
        {
            header: "Project",
            render: (task) => task.project?.title || `Project #${task.projectId}`,
        },
        {
            header: "Status",
            render: (task) => (
                <StatusBadge status={task.status?.name || String(task.statusId)} />
            ),
        },
        {
            header: "Due Date",
            render: (task) => task.dueDate || "No due date",
        },
        {
            header: "Assigned",
            render: (task) => task.assignedUsers?.length || 0,
        },
        {
            header: "Actions",
            className: "text-right",
            render: (task) =>
                isAdmin ? (
                    <ActionMenu
                        items={[
                            {
                                label: "Open Details",
                                onClick: () => router.push(`/tasks/${task.id}`),
                            },
                            {
                                label: "Edit Task",
                                onClick: () => setEditTask(task),
                            },
                            {
                                label: "Assign Users",
                                onClick: () => setAssignTask(task),
                            },
                            ...statuses.map((status) => ({
                                label: `Set ${status.name}`,
                                onClick: () => handleStatusChange(task, status.id),
                            })),
                        ]}
                    />
                ) : (
                    <ActionMenu
                        items={[
                            {
                                label: "Open Details",
                                onClick: () => router.push(`/tasks/${task.id}`),
                            },
                            ...statuses.map((status) => ({
                                label: `Set ${status.name}`,
                                onClick: () => handleStatusChange(task, status.id),
                            })),
                        ]}
                    />
                ),
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {isAdmin
                                ? "Create, assign, filter, and manage tasks."
                                : "View and update your assigned tasks."}
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                        >
                            <Plus size={16} />
                            Create Task
                        </button>
                    )}
                </div>

                <DataToolbar
                    searchValue={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        resetPage();
                    }}
                    searchPlaceholder="Search tasks by title or description..."
                    filterValue={statusId}
                    onFilterChange={(value) => {
                        setStatusId(value);
                        resetPage();
                    }}
                    filterOptions={statusFilterOptions}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    sortOptions={[
                        { label: "Created Date", value: "createdAt" },
                        { label: "Updated Date", value: "updatedAt" },
                        { label: "Due Date", value: "dueDate" },
                        { label: "Title", value: "title" },
                    ]}
                    onSortByChange={(value) => {
                        setSortBy(value);
                        resetPage();
                    }}
                    onSortOrderChange={(value) => {
                        setSortOrder(value);
                        resetPage();
                    }}
                    
                    
                />

                {isLoading && <LoadingState message="Loading tasks..." />}

                {isError && (
                    <ErrorState
                        message="Failed to load tasks."
                        onRetry={() => refetch()}
                    />
                )}

                {!isLoading && !isError && tasks.length === 0 && (
                    <EmptyState message="No tasks found." />
                )}

                {!isLoading && !isError && tasks.length > 0 && (
                    <DataTable
                        columns={columns}
                        data={tasks}
                        rowKey={(task) => task.id}
                    />
                )}

                <DataPagination
                    pagination={pagination}
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={setLimit}
                />
            </div>

            <AppModal
                open={createOpen}
                title="Create Task"
                description="Create a task and assign employees."
                onClose={() => setCreateOpen(false)}
            >
                <TaskCreateForm onSuccess={() => setCreateOpen(false)} />
            </AppModal>

            <AppModal
                open={!!editTask}
                title="Edit Task"
                description="Update task details."
                onClose={() => setEditTask(null)}
            >
                {editTask && (
                    <TaskEditForm
                        task={editTask}
                        onSuccess={() => setEditTask(null)}
                    />
                )}
            </AppModal>

            <AppModal
                open={!!assignTask}
                title="Assign Users"
                description={assignTask ? `Assign users to ${assignTask.title}.` : ""}
                onClose={() => {
                    setAssignTask(null);
                    setSelectedAssignUsers([]);
                }}
            >
                {assignTask && (
                    <div className="space-y-5">
                        {isLoadingAssignProject && (
                            <p className="text-sm text-gray-500">
                                Loading project members...
                            </p>
                        )}

                        {isAssignProjectError && (
                            <p className="text-sm text-red-600">
                                Failed to load project members.
                            </p>
                        )}

                        {!isLoadingAssignProject && !isAssignProjectError && (
                            <UserSearchSelect
                                title="Assign Project Members"
                                selectedUsers={selectedAssignUsers}
                                onChange={setSelectedAssignUsers}
                                users={assignProjectMembers}
                                emptyMessage="No project member found."
                                excludedUserIds={
                                    assignTask.assignedUsers?.map((user) => user.id) || []
                                }
                            />
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                disabled={
                                    assigningUsers ||
                                    isLoadingAssignProject ||
                                    isAssignProjectError ||
                                    selectedAssignUsers.length === 0
                                }
                                onClick={handleAssignUsers}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                            >
                                {assigningUsers ? "Assigning..." : "Assign Users"}
                            </button>
                        </div>
                    </div>
                )}
            </AppModal>
        </DashboardLayout>
    );
}
