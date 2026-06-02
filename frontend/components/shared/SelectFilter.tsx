"use client";

export type SelectOption = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
};

export default function SelectFilter({ value, onChange, options }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
    >
      {options.map((option) => (
        <option key={option.label + option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}