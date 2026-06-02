import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type {
  AssignProjectMembersRequest,
  CreateProjectRequest,
  Project,
  ProjectListResponse,
  RemoveProjectMemberRequest,
  UpdateProjectRequest,
} from "@/types/project";

type GetProjectsQuery = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  userId?: number;
};

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getProjects: builder.query<ApiResponse<ProjectListResponse>, GetProjectsQuery>({
      query: ({ userId, ...params }) => ({
        url: "/projects",
        method: "GET",
        params,
      }),
      providesTags: ["Projects"],
    }),

    deleteProject: builder.mutation<ApiResponse<null>, number>({
  query: (id) => ({
    url: `/projects/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Projects", "Dashboard"],
}),

    getProjectById: builder.query<ApiResponse<Project>, number>({
      query: (id) => `/projects/${id}`,
      providesTags: ["Projects"],
    }),

    createProject: builder.mutation<ApiResponse<Project>, CreateProjectRequest>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),

    updateProject: builder.mutation<ApiResponse<Project>, UpdateProjectRequest>({
      query: ({ id, body }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),

    archiveProject: builder.mutation<ApiResponse<Project>, number>({
      query: (id) => ({
        url: `/projects/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Projects", "Dashboard"],
    }),

    assignProjectMembers: builder.mutation<
      ApiResponse<null>,
      AssignProjectMembersRequest
    >({
      query: ({ projectId, memberIds }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: { memberIds },
      }),
      invalidatesTags: ["Projects"],
    }),

    removeProjectMember: builder.mutation<
      ApiResponse<null>,
      RemoveProjectMemberRequest
    >({
      query: ({ projectId, userId }) => ({
        url: `/projects/${projectId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useArchiveProjectMutation,
  useAssignProjectMembersMutation,
  useRemoveProjectMemberMutation,
  useDeleteProjectMutation,
} = projectApi;