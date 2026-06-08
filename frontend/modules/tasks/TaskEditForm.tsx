"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Task } from "@/types/task";
import { useUpdateTaskMutation } from "@/redux/services/taskApi";
import { taskSchema, TaskFormValues } from "./task.schema";

type Props = {
  task: Task;
  onSuccess: () => void;
};

export default function TaskEditForm({ task, onSuccess }: Props) {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
    });
  }, [task, reset]);

  async function onSubmit(values: TaskFormValues) {
    try {
      await updateTask({
        id: task.id,
        body: {
          title: values.title,
          description: values.description,
          dueDate: values.dueDate || undefined,
        },
      }).unwrap();

      onSuccess();
    } catch {
      setError("root", {
        message: "Task update failed",
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
        <label className="text-sm font-medium text-gray-700">Task Title</label>

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
        <label className="text-sm font-medium text-gray-700">Due Date</label>

        <input
          {...register("dueDate")}
          type="date"
          className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </div>
    </form>
  );
}
