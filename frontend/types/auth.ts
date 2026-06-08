export type UserRole = "ADMIN" | "EMPLOYEE";

export type Department = {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserStats = {
  total: number;
  admins: number;
  employees: number;
  active: number;
  inactive: number;
  departments: number;
};

export type UserActivityStats = {
  createdProjects: number;
  projectMemberships: number;
  createdTasks: number;
  assignedTasks: number;
  shiftsLogged: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  department?: Department | null;
  stats?: UserActivityStats;
};

export type UserPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserListResponse = {
  users: User[];
  pagination: UserPagination;
  stats: UserStats;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
  role: UserRole;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};
