"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Project } from "@/types/project";
import { useUpdateProjectMutation } from "@/redux/services/projectApi";
import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(["ACTIVE" , "ARCHIVED" , "COMPLETED" ,"CANCELED"]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type Props = {
  project: Project;
  onSuccess: () => void;
};

export default function ProjectEditForm({ project, onSuccess }: Props) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    reset({
      title: project.title,
      description: project.description || "",
      deadline: project.deadline || "",
      status: project.status,
    });
  }, [project, reset]);

  async function onSubmit(values: ProjectFormValues) {
    try {
      await updateProject({
        id: project.id,
        body: {
          title: values.title,
          description: values.description,
          deadline: values.deadline || undefined,
          status: values.status,
        },
      }).unwrap();

      onSuccess();
    } catch {
      setError("root", {
        message: "Project update failed",
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

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Project"}
        </button>
      </div>
    </form>
  );
}