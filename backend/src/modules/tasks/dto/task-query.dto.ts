import { IsOptional, IsString } from 'class-validator';

export class TaskQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  projectId?: string;

  @IsOptional()
  statusId?: string;

  @IsOptional()
    search?: string;

  @IsOptional()
  assignedUserId?: string;

  @IsOptional()
  fromDate?: string;

  @IsOptional()
  toDate?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}