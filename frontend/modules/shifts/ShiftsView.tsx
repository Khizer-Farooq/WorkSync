"use client";
import { StatusBadge } from "@/lib/statusColors";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import ActionMenu from "@/components/shared/ActionMenu";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DataPagination from "@/components/shared/DataPagination";
import DataTable, { DataColumn } from "@/components/shared/DataTable";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import SelectFilter from "@/components/shared/SelectFilter";
import SearchInput from "@/components/shared/SearchInput";
import AppModal from "@/components/shared/modal/AppModal";
import type { RootState } from "@/redux/store";
import type { Shift } from "@/types/shift";

import {
  useClockInMutation,
  useClockOutMutation,
  useDeleteShiftMutation,
  useGetActiveShiftQuery,
  useGetShiftsQuery,
  useGetWeeklyHoursQuery,
} from "@/redux/services/shiftApi";

import ActiveShiftCard from "./ActiveShiftCard";
import ShiftCreateForm from "./ShiftCreateForm";
import WeeklyHoursCard from "./WeeklyHoursCard";
import {
  formatDateTime,
  formatShiftDuration,
  getShiftStatus,
} from "./shift.utils";

export default function ShiftsView() {
  const user = useSelector((state: RootState) => state.auth.user);

  const isAdmin = user?.role === "ADMIN";
  const isEmployee = user?.role === "EMPLOYEE";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("clockIn");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteShift]= useDeleteShiftMutation();
  const {
    data: activeShiftResponse,
    isLoading: activeLoading,
    isError: activeError,
    refetch: refetchActiveShift,
  } = useGetActiveShiftQuery(undefined, {
    skip: !isEmployee,
  });

  const {
    data: weeklyHoursResponse,
    isLoading: weeklyLoading,
    isError: weeklyError,
    refetch: refetchWeeklyHours,
  } = useGetWeeklyHoursQuery();

  const {
    data: shiftsResponse,
    isLoading: shiftsLoading,
    isError: shiftsError,
    refetch: refetchShifts,
  } = useGetShiftsQuery({
    page,
    limit,
    search: isAdmin ? search.trim() || undefined : undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    sortBy,
    sortOrder,
  });

  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();

  const activeShift = activeShiftResponse?.data || null;
  const weeklySeconds =
    weeklyHoursResponse?.data.weeklySeconds ??
    Math.round((weeklyHoursResponse?.data.weeklyHours || 0) * 3600);

  const shifts = shiftsResponse?.data.shifts || [];
  const pagination = shiftsResponse?.data.pagination;

  function resetPage() {
    setPage(1);
  }

  async function handleClockIn() {
    try {
      await clockIn().unwrap();
      refetchActiveShift();
      refetchShifts();
      refetchWeeklyHours();
    } catch {
      alert("Clock in failed");
    }
  }

  async function handleClockOut() {
    try {
      await clockOut().unwrap();
      refetchActiveShift();
      refetchShifts();
      refetchWeeklyHours();
    } catch {
      alert("Clock out failed");
    }
  }

  function handleCreateShiftSuccess() {
    setCreateOpen(false);
    refetchShifts();
    refetchWeeklyHours();
  }

    async function handleDeleteShift(shift: Shift) {
  const confirmed = window.confirm("Delete this shift?");
  if (!confirmed) return;

  try {
    await deleteShift(shift.id).unwrap();
    refetchShifts();
    refetchWeeklyHours();
    refetchActiveShift();
  } catch {
    alert("Delete shift failed");
  }
}

  const columns: DataColumn<Shift>[] = [
    {
      header: "Employee",
      render: (shift) => shift.user?.name || `User #${shift.userId}`,
    },
    {
      header: "Clock In",
      render: (shift) => formatDateTime(shift.clockIn),
    },
    {
      header: "Clock Out",
      render: (shift) => formatDateTime(shift.clockOut),
    },
    {
      header: "Total Hours",
      render: (shift) => formatShiftDuration(shift.clockIn, shift.clockOut),
    },
    {
      header: "Shift Type",
      render: (shift) => shift.shiftType,
    },
    {
      header: "Status",
      render: (shift) => (
        <StatusBadge status={getShiftStatus(shift.clockOut)} />
      ),
    },
    ...(isAdmin
  ? [
      {
        header: "Actions",
        className: "text-right",
        render: (shift: Shift) => (
          <ActionMenu
            items={[
              {
                label: "Delete",
                danger: true,
                onClick: () => handleDeleteShift(shift),
              },
            ]}
          />
        ),
      },
    ]
  : []),
  ];

  return (
    
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shifts</h1>

            <p className="mt-1 text-sm text-gray-500">
              {isAdmin
                ? "View employee shift history and weekly worked hours."
                : "Clock in, clock out, and view your shift history."}
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
            >
              <Plus size={16} />
              Create Shift
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {weeklyLoading ? (
            <LoadingState message="Loading weekly hours..." />
          ) : weeklyError ? (
            <ErrorState
              message="Failed to load weekly hours."
              onRetry={() => refetchWeeklyHours()}
            />
          ) : (
            <WeeklyHoursCard weeklySeconds={weeklySeconds} isAdmin={isAdmin} />
          )}

          {activeLoading ? (
            <LoadingState message="Loading active shift..." />
          ) : activeError ? (
            <ErrorState
              message="Failed to load active shift."
              onRetry={() => refetchActiveShift()}
            />
          ) : (
            <ActiveShiftCard
              activeShift={activeShift}
              isEmployee={isEmployee}
              isClockingIn={isClockingIn}
              isClockingOut={isClockingOut}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          )}
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div
            className={`grid grid-cols-1 gap-3 ${
              isAdmin ? "lg:grid-cols-6" : "lg:grid-cols-4"
            }`}
          >
            {isAdmin && (
              <div className="lg:col-span-2">
                <label className="text-xs font-medium text-gray-500">
                  Employee
                </label>

                <div className="mt-1">
                  <SearchInput
                    value={search}
                    onChange={(value) => {
                      setSearch(value);
                      resetPage();
                    }}
                    placeholder="Search name or email"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-500">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  resetPage();
                }}
                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  resetPage();
                }}
                className="mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Sort By
              </label>

              <div className="mt-1">
                <SelectFilter
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    resetPage();
                  }}
                  options={[
                    { label: "Clock In", value: "clockIn" },
                    { label: "Clock Out", value: "clockOut" },
                    { label: "Created Date", value: "createdAt" },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">
                Sort Order
              </label>

              <div className="mt-1">
                <SelectFilter
                  value={sortOrder}
                  onChange={(value) => {
                    setSortOrder(value as "ASC" | "DESC");
                    resetPage();
                  }}
                  options={[
                    { label: "Descending", value: "DESC" },
                    { label: "Ascending", value: "ASC" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {shiftsLoading && <LoadingState message="Loading shifts..." />}

        {shiftsError && (
          <ErrorState
            message="Failed to load shifts."
            onRetry={() => refetchShifts()}
          />
        )}

        {!shiftsLoading && !shiftsError && shifts.length === 0 && (
          <EmptyState message="No shifts found." />
        )}

        {!shiftsLoading && !shiftsError && shifts.length > 0 && (
          <DataTable
            columns={columns}
            data={shifts}
            rowKey={(shift) => shift.id}
          />
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
        title="Create Shift"
        description="Create a completed shift for an employee."
        onClose={() => setCreateOpen(false)}
      >
        <ShiftCreateForm
          onCancel={() => setCreateOpen(false)}
          onSuccess={handleCreateShiftSuccess}
        />
      </AppModal>
    </DashboardLayout>
  );
}
