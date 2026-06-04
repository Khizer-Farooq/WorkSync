import type { User } from "./auth";
import type { Project } from "./project";

export type TaskStatus = {
  id: number;
  name: "TODO" | "IN_PROGRESS" | "COMPLETED" | "REVIEW" | string;
};

export type Task = {
  id: number;
  projectId: number;
  statusId: number;
  createdBy: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  status?: TaskStatus;
  creator?: User;
  assignedUsers?: User[];
};

export type TaskPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TaskListResponse = {
  tasks: Task[];
  pagination: TaskPagination;
};

export type CreateTaskRequest = {
  projectId: number;
  title: string;
  description?: string;
  dueDate?: string;
  assignedUserIds?: number[];
};

export type UpdateTaskRequest = {
  id: number;
  body: {
    title?: string;
    description?: string;
    statusId?: number;
    dueDate?: string;
  };
};

export type AssignTaskUsersRequest = {
  taskId: number;
  userIds: number[];
};

export type TaskComment = {
  id: number;
  taskId: number;
  userId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "EMPLOYEE";
  };
};

export type CreateTaskCommentRequest = {
  taskId: number;
  comment: string;
};