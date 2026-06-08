import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type {
  CreateUserRequest,
  User,
  UserListResponse,
  UserRole,
} from "@/types/auth";

export type CreateEmployeeRequest = {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
};

type GetUsersQuery = {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  departmentId?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<ApiResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users", "Dashboard"],
    }),

    createEmployee: builder.mutation<ApiResponse<User>, CreateEmployeeRequest>({
      query: (body) => ({
        url: "/users/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    getUsers: builder.query<ApiResponse<UserListResponse>, GetUsersQuery>({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
      }),
      providesTags: ["Users"],
    }),

    getUserById: builder.query<ApiResponse<User>, number>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    getEmployees: builder.query<ApiResponse<User[]>, void>({
      query: () => "/users/employees",
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useCreateEmployeeMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetEmployeesQuery,
} = userApi;
