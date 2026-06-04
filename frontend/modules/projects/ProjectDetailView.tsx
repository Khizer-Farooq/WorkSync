"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { StatusBadge } from "@/lib/statusColors";
import ActionMenu from "@/components/shared/ActionMenu";
import AppModal from "@/components/shared/modal/AppModal";
import ProjectEditForm from "./ProjectEditForm";
import type { Project } from "@/types/project";
import DashboardLayout from "@/components/layout/DashboardLayout";
import type { RootState } from "@/redux/store";
import {
  useGetProjectByIdQuery,
  useRemoveProjectMemberMutation,
} from "@/redux/services/projectApi";

export default function ProjectDetailView() {
  const params = useParams();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "ADMIN";

  const projectId = Number(params.id);

  const { data, isLoading, isError } = useGetProjectByIdQuery(projectId);
  const [removeProjectMember] = useRemoveProjectMemberMutation();

  async function handleRemoveMember(userId: number) {
    const confirmed = window.confirm("Remove this member?");
    if (!confirmed) return;

    await removeProjectMember({
      projectId,
      userId,
    });
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <p className="text-sm text-gray-500">Loading project...</p>
      </DashboardLayout>
    );
  }

  if (isError || !data?.data) {
    return (
      <DashboardLayout>
        <p className="text-sm text-red-600">Project not found.</p>
      </DashboardLayout>
    );
  }

  const project = data.data;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button
          onClick={() => router.push("/projects")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>
      
    
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.title}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {project.description || "No description"}
              </p>
            </div>

            <div className="w-fit">
              <StatusBadge status={project.status} />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {project.deadline || "No deadline"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Created By</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {project.creator?.name || "Unknown"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Created At</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Members</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {project.members?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Members
          </h2>

          {!project.members?.length ? (
            <p className="mt-3 text-sm text-gray-500">
              No members assigned.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-600px text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {project.members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {member.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {member.role}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}