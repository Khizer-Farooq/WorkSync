import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
