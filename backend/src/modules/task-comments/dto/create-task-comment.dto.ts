import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskCommentDto {
  @IsString()
  @IsNotEmpty()
  declare comment: string;
}