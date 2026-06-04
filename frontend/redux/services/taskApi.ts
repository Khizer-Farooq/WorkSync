import { baseApi } from "./baseApi";
import type { ApiResponse } from "@/types/common";
import type {AssignTaskUsersRequest,CreateTaskCommentRequest,CreateTaskRequest,Task,TaskComment,
TaskListResponse,TaskStatus,UpdateTaskRequest,} from "@/types/task";

type GetTasksQuery = {
  page?: number;
  limit?: number;
  projectId?: number;
  statusId?: number;
  assignedUserId?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<ApiResponse<TaskListResponse>, GetTasksQuery>({
      query: (params) => ({
        url: "/tasks",
        method: "GET",
        params,
      }),
      providesTags: ["Tasks"],
    }),

    getTaskById: builder.query<ApiResponse<Task>, number>({
      query: (id) => `/tasks/${id}`,
      providesTags: ["Tasks"],
    }),

    getTaskStatuses: builder.query<ApiResponse<TaskStatus[]>, void>({
      query: () => "/tasks/statuses",
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation<ApiResponse<Task>, CreateTaskRequest>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),

    updateTask: builder.mutation<ApiResponse<Task>, UpdateTaskRequest>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),

    assignTaskUsers: builder.mutation<
      ApiResponse<null>,
      AssignTaskUsersRequest
    >({
      query: ({ taskId, userIds }) => ({
        url: `/tasks/${taskId}/assign`,
        method: "POST",
        body: { userIds },
      }),
      invalidatesTags: ["Tasks", "Dashboard"],
    }),
    getTaskComments: builder.query<ApiResponse<TaskComment[]>, number>({
  query: (taskId) => `/tasks/${taskId}/comments`,
  providesTags: ["Tasks"],
}),

createTaskComment: builder.mutation<
  ApiResponse<TaskComment>,
  CreateTaskCommentRequest
>({
  query: ({ taskId, comment }) => ({
    url: `/tasks/${taskId}/comments`,
    method: "POST",
    body: { comment },
  }),
  invalidatesTags: ["Tasks"],
}),


    
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTaskStatusesQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useAssignTaskUsersMutation,
    useGetTaskCommentsQuery,
    useCreateTaskCommentMutation,
    
} = taskApi;