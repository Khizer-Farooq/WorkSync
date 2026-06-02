"use client";

import React from "react";

export type DataColumn<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
};

export default function DataTable<T>({ columns, data, rowKey }: Props<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-900px text-left">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 text-sm text-gray-600 ${
                      column.className || ""
                    }`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}