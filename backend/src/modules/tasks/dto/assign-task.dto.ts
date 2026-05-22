import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class AssignTaskDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  declare userIds: number[];
}