import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type { DashboardData } from "@/types/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<ApiResponse<DashboardData>, void>({
      query: () => "/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;