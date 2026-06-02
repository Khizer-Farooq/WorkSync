import { UserRole } from '../../../common/enums/user-role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  name: string;
  role: UserRole;
};