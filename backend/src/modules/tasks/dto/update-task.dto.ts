import {IsDateString,IsInt,IsOptional,IsString,MaxLength,} from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  statusId?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}