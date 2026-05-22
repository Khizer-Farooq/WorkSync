import {IsDateString,IsEnum,IsOptional,IsString,MaxLength,} from 'class-validator';
import { ProjectStatus } from '../../../common/enums/project-status.enum';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}