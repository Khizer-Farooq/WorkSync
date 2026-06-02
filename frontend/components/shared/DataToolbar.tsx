"use client";

import SearchInput from "./SearchInput";
import SelectFilter, { SelectOption } from "./SelectFilter";
import SortControls from "./SortControls";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: SelectOption[];

  sortBy: string;
  sortOrder: "ASC" | "DESC";
  sortOptions: SelectOption[];
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "ASC" | "DESC") => void;

  actionButton?: React.ReactNode;
};

export default function DataToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",

  filterValue,
  onFilterChange,
  filterOptions,

  sortBy,
  sortOrder,
  sortOptions,
  onSortByChange,
  onSortOrderChange,

  actionButton,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {filterOptions && onFilterChange && (
          <SelectFilter
            value={filterValue || ""}
            onChange={onFilterChange}
            options={filterOptions}
          />
        )}

        <div className={filterOptions ? "lg:col-span-2" : "lg:col-span-3"}>
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            sortOptions={sortOptions}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </div>

      {actionButton && (
        <div className="mt-4 flex justify-end">{actionButton}</div>
      )}
    </div>
  );
}