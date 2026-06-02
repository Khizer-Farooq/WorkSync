"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataToolbar from "@/components/shared/DataToolbar";
import DataPagination from "@/components/shared/DataPagination";
import DataTable from "@/components/shared/DataTable";
import type { DataColumn } from "@/components/shared/DataTable";
import ActionMenu from "@/components/shared/ActionMenu";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import AppModal from "@/components/shared/modal/AppModal";
import UserSearchSelect from "@/components/shared/users/UserSearchSelect";
import {useArchiveProjectMutation,useAssignProjectMembersMutation,useDeleteProjectMutation,useGetProjectsQuery,useUpdateProjectMutation,} from "@/redux/services/projectApi";

import type { RootState } from "@/redux/store";
import type { Project } from "@/types/project";
import type { User } from "@/types/auth";
import { useDebounce } from "@/hooks/useDebounce";

import ProjectCreateForm from "./ProjectCreateForm";
import ProjectEditForm from "./ProjectEditForm";

export default function ProjectsView() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [addMembersProject, setAddMembersProject] = useState<Project | null>(
    null
  );
  const [selectedNewMembers, setSelectedNewMembers] = useState<User[]>([]);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, refetch } = useGetProjectsQuery({
    page,
    limit,
    status: status || undefined,
    search: debouncedSearch || undefined,
    sortBy,
    sortOrder,
  });

  const [archiveProject] = useArchiveProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [assignMembers, { isLoading: addingMembers }] =
    useAssignProjectMembersMutation();

  const projects = data?.data.projects || [];
  const pagination = data?.data.pagination;

  function resetPage() {
    setPage(1);
  }

  async function handleMarkCompleted(project: Project) {
    await updateProject({
      id: project.id,
      body: {
        status: "COMPLETED",
      },
    });
  }

  async function handleArchive(project: Project) {
    const confirmed = window.confirm("Archive this project?");
    if (!confirmed) return;

    await archiveProject(project.id);
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;

    await deleteProject(project.id);
  }

  async function handleAddMembers() {
    if (!addMembersProject) return;

    await assignMembers({
      projectId: addMembersProject.id,
      memberIds: selectedNewMembers.map((member) => member.id),
    }).unwrap();

    setSelectedNewMembers([]);
    setAddMembersProject(null);
  }

  const columns: DataColumn<Project>[] = [
    {
      header: "Name",
      render: (project) => (
        <button
          type="button"
          onClick={() => router.push(`/projects/${project.id}`)}
          className="text-left"
        >
          <p className="font-medium text-gray-900 hover:underline">
            {project.title}
          </p>
          <p className="text-xs text-gray-500">
            {project.description || "No description"}
          </p>
        </button>
      ),
    },
    {
      header: "Status",
      render: (project) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {project.status}
        </span>
      ),
    },
    {
      header: "Deadline",
      render: (project) => project.deadline || "No deadline",
    },
    {
      header: "Created By",
      render: (project) => project.creator?.name || "Unknown",
    },
    {
      header: "Members",
      render: (project) => project.members?.length || 0,
    },
    {
      header: "Actions",
      className: "text-right",
      render: (project) =>
        isAdmin ? (
          <ActionMenu
            items={[
              {
                label: "Open Details",
                onClick: () => router.push(`/projects/${project.id}`),
              },
              {
                label: "Edit Project",
                onClick: () => setEditProject(project),
              },
              {
                label: "Add Members",
                onClick: () => setAddMembersProject(project),
              },
              {
                label: "Mark Completed",
                onClick: () => handleMarkCompleted(project),
              },
              {
                label: "Archive",
                onClick: () => handleArchive(project),
              },
              {
                label: "Delete",
                danger: true,
                onClick: () => handleDelete(project),
              },
            ]}
          />
        ) : (
          <button
            type="button"
            onClick={() => router.push(`/projects/${project.id}`)}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Open
          </button>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

            <p className="mt-1 text-sm text-gray-500">
              {isAdmin
                ? "Search, filter, sort, and manage all projects."
                : "Search and view projects where you are a member."}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
            >
              <Plus size={16} />
              Create Project
            </button>
          )}
        </div>

        <DataToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          searchPlaceholder="Search projects by name or description..."
          filterValue={status}
          onFilterChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          filterOptions={[
            { label: "All Status", value: "" },
            { label: "ACTIVE", value: "ACTIVE" },
            { label: "COMPLETED", value: "COMPLETED" },
            { label: "ARCHIVED", value: "ARCHIVED" },
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortOptions={[
            { label: "Created Date", value: "createdAt" },
            { label: "Updated Date", value: "updatedAt" },
            { label: "Deadline", value: "deadline" },
            { label: "Name", value: "title" },
            { label: "Status", value: "status" },
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

        {isLoading && <LoadingState message="Loading projects..." />}

        {isError && (
          <ErrorState
            message="Failed to load projects."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <EmptyState message="No projects found." />
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <DataTable
            columns={columns}
            data={projects}
            rowKey={(project) => project.id}
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
        title="Create Project"
        description="Create a project and assign employees."
        onClose={() => setCreateOpen(false)}
      >
        <ProjectCreateForm onSuccess={() => setCreateOpen(false)} />
      </AppModal>

      <AppModal
        open={!!editProject}
        title="Edit Project"
        description="Update project details."
        onClose={() => setEditProject(null)}
      >
        {editProject && (
          <ProjectEditForm
            project={editProject}
            onSuccess={() => setEditProject(null)}
          />
        )}
      </AppModal>

      <AppModal
        open={!!addMembersProject}
        title="Add Members"
        description={
          addMembersProject
            ? `Add more employees to ${addMembersProject.title}.`
            : ""
        }
        onClose={() => {
          setAddMembersProject(null);
          setSelectedNewMembers([]);
        }}
      >
        {addMembersProject && (
          <div className="space-y-5">
            <UserSearchSelect
              title="Add Project Members"
              selectedUsers={selectedNewMembers}
              onChange={setSelectedNewMembers}
              excludedUserIds={
                addMembersProject.members?.map((member) => member.id) || []
              }
            />

            <div className="flex justify-end">
              <button
                type="button"
                disabled={addingMembers || selectedNewMembers.length === 0}
                onClick={handleAddMembers}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {addingMembers ? "Adding..." : "Add Members"}
              </button>
            </div>
          </div>
        )}
      </AppModal>
    </DashboardLayout>
  );
}