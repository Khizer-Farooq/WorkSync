import {IsArray,IsDateString,IsEnum,IsNotEmpty,IsOptional,IsString,MaxLength,} from 'class-validator';
import { ProjectStatus } from 'src/common/enums/project-status.enum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  declare title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status!: ProjectStatus;

  @IsArray()
  @IsOptional()
  memberIds?: number[];
}