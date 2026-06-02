"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
};

export default function RowsPerPageSelect({
  value,
  onChange,
  options = [5, 10, 20],
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Rows:</span>

      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-gray-900"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}