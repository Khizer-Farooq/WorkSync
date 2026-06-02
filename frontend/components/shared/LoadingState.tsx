"use client";

type Props = {
  message?: string;
};

export default function LoadingState({
  message = "Loading...",
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}