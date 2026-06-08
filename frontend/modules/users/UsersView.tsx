"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldCheck, UserCheck, Users, Building2 } from "lucide-react";
import { useSelector } from "react-redux";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DataToolbar from "@/components/shared/DataToolbar";
import DataPagination from "@/components/shared/DataPagination";
import DataTable, { DataColumn } from "@/components/shared/DataTable";
import ActionMenu from "@/components/shared/ActionMenu";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import AppModal from "@/components/shared/modal/AppModal";
import StatCard from "@/modules/dashboard/StatCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetUsersQuery } from "@/redux/services/userApi";
import type { RootState } from "@/redux/store";
import type { User, UserRole } from "@/types/auth";

import UserCreateForm from "./UserCreateForm";

function formatDate(value?: string) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === "ADMIN";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        isAdmin
          ? "bg-blue-50 text-blue-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {role}
    </span>
  );
}

export default function UsersView() {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = currentUser?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [createOpen, setCreateOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, refetch } = useGetUsersQuery(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      role: role ? (role as UserRole) : undefined,
      sortBy,
      sortOrder,
    },
    {
      skip: !isAdmin,
    }
  );

  const users = data?.data.users || [];
  const pagination = data?.data.pagination;
  const stats = data?.data.stats;

  function resetPage() {
    setPage(1);
  }

  const columns: DataColumn<User>[] = [
    {
      header: "User",
      render: (user) => (
        <button
          type="button"
          onClick={() => router.push(`/users/${user.id}`)}
          className="text-left"
        >
          <p className="font-medium text-gray-900 hover:underline">
            {user.name}
          </p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </button>
      ),
    },
    {
      header: "Role",
      render: (user) => <RoleBadge role={user.role} />,
    },
    {
      header: "Department",
      render: (user) => user.department?.name || "No department",
    },
    {
      header: "Status",
      render: (user) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {user.isActive === false ? "INACTIVE" : "ACTIVE"}
        </span>
      ),
    },
    {
      header: "Joined",
      render: (user) => formatDate(user.createdAt),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <ActionMenu
          items={[
            {
              label: "Open Details",
              onClick: () => router.push(`/users/${user.id}`),
            },
          ]}
        />
      ),
    },
  ];

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <EmptyState message="Admin access required." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage admins and employees across departments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            <Plus size={16} />
            Create User
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Users" value={stats?.total || 0} icon={Users} />
          <StatCard title="Admins" value={stats?.admins || 0} icon={ShieldCheck} />
          <StatCard title="Employees" value={stats?.employees || 0} icon={UserCheck} />
          <StatCard
            title="Departments"
            value={stats?.departments || 0}
            icon={Building2}
          />
        </div>

        <DataToolbar
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          searchPlaceholder="Search users by name or email..."
          filterValue={role}
          onFilterChange={(value) => {
            setRole(value);
            resetPage();
          }}
          filterOptions={[
            { label: "All Roles", value: "" },
            { label: "ADMIN", value: "ADMIN" },
            { label: "EMPLOYEE", value: "EMPLOYEE" },
          ]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          sortOptions={[
            { label: "Created Date", value: "createdAt" },
            { label: "Updated Date", value: "updatedAt" },
            { label: "Name", value: "name" },
            { label: "Email", value: "email" },
            { label: "Role", value: "role" },
          ]}
          onSortByChange={(value) => {
            setSortBy(value);
            resetPage();
          }}
          onSortOrderChange={(value) => {
            setSortOrder(value);
            resetPage();
          }}
        />

        {isLoading && <LoadingState message="Loading users..." />}

        {isError && (
          <ErrorState message="Failed to load users." onRetry={() => refetch()} />
        )}

        {!isLoading && !isError && users.length === 0 && (
          <EmptyState message="No users found." />
        )}

        {!isLoading && !isError && users.length > 0 && (
          <DataTable columns={columns} data={users} rowKey={(user) => user.id} />
        )}

        <DataPagination
          pagination={pagination}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>

      <AppModal
        open={createOpen}
        title="Create User"
        description="Add an admin or employee account."
        onClose={() => setCreateOpen(false)}
      >
        <UserCreateForm onSuccess={() => setCreateOpen(false)} />
      </AppModal>
    </DashboardLayout>
  );
}
