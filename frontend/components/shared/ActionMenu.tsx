"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  items: ActionMenuItem[];
};

export default function ActionMenu({ items }: Props) {
  const [open, setOpen] = useState(false);

  function handleClick(item: ActionMenuItem) {
    setOpen(false);
    item.onClick();
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 hover:bg-gray-100"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border bg-white p-2 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleClick(item)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                item.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}