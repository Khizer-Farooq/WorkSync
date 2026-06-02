import {Body,Controller,Get,Param,Post,UseGuards,} from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/types/current-user.type';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskCommentDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.taskCommentsService.create(Number(taskId), dto, currentUser);
  }

  @Get()
  findByTask(
    @Param('taskId') taskId: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.taskCommentsService.findByTask(Number(taskId), currentUser);
  }
}