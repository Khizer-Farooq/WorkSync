import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class AssignMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  declare memberIds: number[];
}