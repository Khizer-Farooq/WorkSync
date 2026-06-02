"use client";

import RowsPerPageSelect from "./RowsPerPageSelect";

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type Props = {
  pagination?: PaginationData;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function DataPagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: Props) {
  if (!pagination) return null;

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <RowsPerPageSelect
        value={limit}
        onChange={(newLimit) => {
          onLimitChange(newLimit);
          onPageChange(1);
        }}
      />

      <p className="text-sm text-gray-600">
        Page {pagination.page} of {totalPages} · Total {pagination.total}
      </p>

      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}