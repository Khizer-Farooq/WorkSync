import { UserRole } from '../enums/user-role.enum';

export type CurrentUser = {
  id: number;
  email: string;
  name: string;
  role: UserRole;
};