import type { User } from "./auth";

export type Shift = {
  id: number;
  userId: number;
  clockIn: string;
  clockOut: string | null;
  shiftType: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  totalHours?: number | null;
};

export type ShiftPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ShiftListResponse = {
  shifts: Shift[];
  pagination: ShiftPagination;
};

export type WeeklyHoursResponse = {
  weeklyHours: number;
  weeklySeconds?: number;
};

export type ClockOutResponse = {
  shift: Shift;
  totalHours: number;
};

export type CreateShiftRequest = {
  userId: number;
  clockIn: string;
  clockOut: string;
  shiftType?: string;
};

export type GetShiftsQuery = {
  page?: number;
  limit?: number;
  userId?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};
