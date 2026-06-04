"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTaskCommentMutation } from "@/redux/services/taskApi";
import { z } from "zod";

export const taskCommentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

export type TaskCommentFormValues = z.infer<typeof taskCommentSchema>;

type Props = {
  taskId: number;
};

export default function TaskCommentForm({ taskId }: Props) {
  const [createComment, { isLoading }] = useCreateTaskCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TaskCommentFormValues>({
    resolver: zodResolver(taskCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: TaskCommentFormValues) {
    try {
      await createComment({
        taskId,
        comment: values.comment,
      }).unwrap();

      reset();
    } catch {
      setError("root", {
        message: "Failed to add comment",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">Add Comment</h2>

      {errors.root?.message && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </div>
      )}

      <div className="mt-4">
        <textarea
          {...register("comment")}
          rows={4}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Write your comment..."
        />

        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">
            {errors.comment.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          disabled={isLoading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isLoading ? "Adding..." : "Add Comment"}
        </button>
      </div>
    </form>
  );
}