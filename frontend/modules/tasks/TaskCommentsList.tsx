"use client";

import { useGetTaskCommentsQuery } from "@/redux/services/taskApi";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";

type Props = {
  taskId: number;
};

export default function TaskCommentsList({ taskId }: Props) {
  const { data, isLoading, isError, refetch } =
    useGetTaskCommentsQuery(taskId);

  const comments = data?.data || [];

  if (isLoading) {
    return <LoadingState message="Loading comments..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Failed to load comments."
        onRetry={() => refetch()}
      />
    );
  }

  if (comments.length === 0) {
    return <EmptyState message="No comments yet." />;
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Comments</h2>

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border bg-gray-50 p-4"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {comment.user?.name || "User"}
                </p>

                <p className="text-xs text-gray-500">
                  {comment.user?.email || "No email"}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            <p className="mt-3 text-sm text-gray-700">{comment.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}