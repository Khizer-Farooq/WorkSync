"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative">
      <Search
        size={17}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-gray-900"
      />
    </div>
  );
}