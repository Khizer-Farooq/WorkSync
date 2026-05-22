import {IsArray,IsDateString,IsNotEmpty,IsOptional,IsString,MaxLength,} from 'class-validator';

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

  @IsArray()
  @IsOptional()
  memberIds?: number[];
}