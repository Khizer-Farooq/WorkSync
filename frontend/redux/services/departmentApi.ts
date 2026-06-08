import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type { Department } from "@/types/auth";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<ApiResponse<Department[]>, void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),
  }),
});

export const { useGetDepartmentsQuery } = departmentApi;
