import { UserRole } from '../enums/user-role.enum';

export type CurrentUser = {
  id: number;
  email: string;
  role: UserRole;
};