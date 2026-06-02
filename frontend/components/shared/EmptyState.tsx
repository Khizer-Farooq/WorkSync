type Props = {
  message?: string;
};

export default function EmptyState({
  message = "No data found.",
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}