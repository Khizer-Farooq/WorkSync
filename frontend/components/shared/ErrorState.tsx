"use client";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Failed to load data.",
  onRetry,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-red-600">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
        >
          Try Again
        </button>
      )}
    </div>
  );
}