import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type { User } from "@/types/auth";

export type CreateEmployeeRequest = {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<ApiResponse<User>, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/users/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    getEmployees: builder.query<ApiResponse<User[]>, void>({
      query: () => "/users/employees",
      providesTags: ["Users"],
    }),
  }),
});

export const { useCreateEmployeeMutation, useGetEmployeesQuery } = userApi;