"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";

import SearchInput from "@/components/shared/SearchInput";
import { useGetEmployeesQuery } from "@/redux/services/userApi";
import { useDebounce } from "@/hooks/useDebounce";
import type { User } from "@/types/auth";

type Props = {
  selectedUsers: User[];
  onChange: (users: User[]) => void;
  excludedUserIds?: number[];
  title?: string;
};

export default function UserSearchSelect({
  selectedUsers,
  onChange,
  excludedUserIds = [],
  title = "Add Users",
}: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError } = useGetEmployeesQuery();

  const employees = data?.data || [];

  const filteredUsers = useMemo(() => {
    const text = debouncedSearch.trim().toLowerCase();

    return employees.filter((employee) => {
      const alreadySelected = selectedUsers.some(
        (user) => user.id === employee.id
      );

      const excluded = excludedUserIds.includes(employee.id);

      if (alreadySelected || excluded) return false;

      if (!text) return true;

      return (
        employee.name.toLowerCase().includes(text) ||
        employee.email.toLowerCase().includes(text)
      );
    });
  }, [employees, debouncedSearch, selectedUsers, excludedUserIds]);

  function addUser(user: User) {
    onChange([...selectedUsers, user]);
    setSearch("");
  }

  function removeUser(userId: number) {
    onChange(selectedUsers.filter((user) => user.id !== userId));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{title}</label>

        <span className="text-xs text-gray-500">
          {selectedUsers.length} selected
        </span>
      </div>

      <div className="mt-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search employee by name or email..."
        />
      </div>

      <div className="mt-3 rounded-xl border bg-gray-50 p-3">
        {isLoading && (
          <p className="text-sm text-gray-500">Loading employees...</p>
        )}

        {isError && (
          <p className="text-sm text-red-600">Failed to load employees.</p>
        )}

        {!isLoading && !isError && filteredUsers.length === 0 && (
          <p className="text-sm text-gray-500">No employee found.</p>
        )}

        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {filteredUsers.map((employee) => (
              <button
                key={employee.id}
                type="button"
                onClick={() => addUser(employee)}
                className="flex w-full items-center justify-between rounded-lg border bg-white p-3 text-left hover:bg-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-500">{employee.email}</p>
                </div>

                <Check size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700">Selected Users</h3>

        {selectedUsers.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No users selected.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-xl border bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeUser(user.id)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}