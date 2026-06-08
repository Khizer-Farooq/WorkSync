"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserSearchSelect from "@/components/shared/users/UserSearchSelect";
import ProjectSearchSelect from "@/components/shared/projects/ProjectSearchSelect";
import { useCreateTaskMutation } from "@/redux/services/taskApi";
import type { User } from "@/types/auth";
import type { Project } from "@/types/project";
import { taskSchema, TaskFormValues } from "./task.schema";

type Props = {
  onSuccess: () => void;
};

export default function TaskCreateForm({ onSuccess }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    if (!selectedProject) {
      setError("root", {
        message: "Please select a project",
      });
      return;
    }

    try {
      await createTask({
        projectId: selectedProject.id,
        title: values.title,
        description: values.description,
        dueDate: values.dueDate || undefined,
        assignedUserIds: selectedUsers.map((user) => user.id),
      }).unwrap();

      reset();
      setSelectedUsers([]);
      setSelectedProject(null);
      onSuccess();
    } catch {
      setError("root", {
        message: "Task creation failed",
      });
    }
  }

  function handleProjectChange(project: Project | null) {
    setSelectedProject(project);
    setSelectedUsers([]);
  }

  const projectMembers = selectedProject?.members || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errors.root?.message && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <ProjectSearchSelect
        selectedProject={selectedProject}
        onChange={handleProjectChange}
        title="Select Project"
      />

      <div>
        <label className="text-sm font-medium text-gray-700">Task Title</label>

        <input
          {...register("title")}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Create login API"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>

        <textarea
          {...register("description")}
          rows={3}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Task description"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Due Date</label>

        <input
          {...register("dueDate")}
          type="date"
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <UserSearchSelect
        title="Assign Project Members"
        selectedUsers={selectedUsers}
        onChange={setSelectedUsers}
        users={selectedProject ? projectMembers : []}
        emptyMessage={
          selectedProject ? "No project member found." : "Select a project first."
        }
      />

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
}
