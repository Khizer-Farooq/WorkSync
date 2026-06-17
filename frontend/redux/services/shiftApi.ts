import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type {
  ClockOutResponse,
  GetShiftsQuery,
  Shift,
  ShiftListResponse,
  WeeklyHoursResponse,
} from "@/types/shift";

export const shiftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query<ApiResponse<ShiftListResponse>, GetShiftsQuery>({
      query: (params) => ({
        url: "/shifts",
        method: "GET",
        params,
      }),
      providesTags: ["Shifts"],
    }),

    getActiveShift: builder.query<ApiResponse<Shift | null>, void>({
      query: () => "/shifts/active",
      providesTags: ["Shifts"],
    }),

    getWeeklyHours: builder.query<ApiResponse<WeeklyHoursResponse>, void>({
      query: () => "/shifts/weekly-hours",
      providesTags: ["Shifts"],
    }),

    getShiftById: builder.query<ApiResponse<Shift>, number>({
      query: (id) => `/shifts/${id}`,
      providesTags: ["Shifts"],
    }),

    clockIn: builder.mutation<ApiResponse<Shift>, void>({
      query: () => ({
        url: "/shifts/clock-in",
        method: "POST",
      }),
      invalidatesTags: ["Shifts", "Dashboard"],
    }),

    clockOut: builder.mutation<ApiResponse<ClockOutResponse>, void>({
      query: () => ({
        url: "/shifts/clock-out",
        method: "POST",
      }),
      invalidatesTags: ["Shifts", "Dashboard"],
    }),

      deleteShift:builder.mutation<ApiResponse<null>,number>({
        query:(id)=>({
          url:`/shifts/${id}`,
          method:"DELETE",
        }),
        invalidatesTags:["Shifts","Dashboard"],
      })
  }),
});

export const {
  useGetShiftsQuery,
  useGetActiveShiftQuery,
  useGetWeeklyHoursQuery,
  useGetShiftByIdQuery,
  useClockInMutation,
  useClockOutMutation,
  useDeleteShiftMutation,
} = shiftApi;