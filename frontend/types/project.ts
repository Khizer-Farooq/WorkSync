import type { User } from "./auth";

export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED" | "CANCELED";

export type Project = {
  id: number;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  deadline?: string | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  creator?: User;
  members?: User[];
};

export type ProjectPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProjectListResponse = {
  projects: Project[];
  pagination: ProjectPagination;
};

export type CreateProjectRequest = {
  title: string;
  description?: string;
  deadline?: string;
  memberIds?: number[];
};

export type UpdateProjectRequest = {
  id: number;
  body: {
    title?: string;
    description?: string;
    status?: ProjectStatus;
    deadline?: string;
  };
};

export type AssignProjectMembersRequest = {
  projectId: number;
  memberIds: number[];
};

export type RemoveProjectMemberRequest = {
  projectId: number;
  userId: number;
};