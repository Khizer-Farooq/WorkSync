import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  declare projectId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  declare title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  assignedUserIds?: number[];
}
