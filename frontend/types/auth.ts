export type UserRole = "ADMIN" | "EMPLOYEE";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: {
    id: number;
    name: string;
  } | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: User;
};