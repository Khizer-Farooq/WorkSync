"use client";

import SelectFilter, { SelectOption } from "./SelectFilter";

type Props = {
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  sortOptions: SelectOption[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "ASC" | "DESC") => void;
};

export default function SortControls({
  sortBy,
  sortOrder,
  sortOptions,
  onSortByChange,
  onSortOrderChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <SelectFilter
        value={sortBy}
        onChange={onSortByChange}
        options={sortOptions}
      />

      <SelectFilter
        value={sortOrder}
        onChange={(value) => onSortOrderChange(value as "ASC" | "DESC")}
        options={[
          {
            label: "Descending",
            value: "DESC",
          },
          {
            label: "Ascending",
            value: "ASC",
          },
        ]}
      />
    </div>
  );
}