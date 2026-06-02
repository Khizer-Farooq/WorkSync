import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../../../common/enums/project-status.enum';

export class ProjectQueryDto {
  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsString()
  @IsOptional()
  search?: string;
  
  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}