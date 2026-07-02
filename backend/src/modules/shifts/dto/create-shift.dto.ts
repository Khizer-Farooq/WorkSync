import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateShiftDto {
  @IsInt()
  userId!: number;

  @IsDateString()
  clockIn!: string;

  @IsDateString()
  clockOut!: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  shiftType?: string;
}
