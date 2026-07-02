"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import UserSearchSelect from "@/components/shared/users/UserSearchSelect";
import { useCreateProjectMutation } from "@/redux/services/projectApi";
import type { User } from "@/types/auth";

import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  status: z.enum(["ACTIVE" , "ARCHIVED" , "COMPLETED" ,"CANCELED"]),
  deadline: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;


type Props = {
  onSuccess: () => void;
};

export default function ProjectCreateForm({ onSuccess }: Props) {

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      status: "ACTIVE",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    try {
      await createProject({
        title: values.title,
        description: values.description,
        deadline: values.deadline || undefined,
        memberIds: selectedUsers.map((user) => user.id),
        status: values.status,
      }).unwrap();

      reset();
      setSelectedUsers([]);
      onSuccess();
    } catch {
      setError("root", {
        message: "Project creation failed",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errors.root?.message && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-700">
          Project Name
        </label>

        <input
          {...register("title")}
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="WorkSync Frontend"
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
          placeholder="Project description"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select {...register("status")} className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900">
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELED">Canceled</option>
        </select>
      


      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Deadline</label>

        <input
          {...register("deadline")}
          type="date"
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <UserSearchSelect
        title="Add Project Members"
        selectedUsers={selectedUsers}
        onChange={setSelectedUsers}
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}