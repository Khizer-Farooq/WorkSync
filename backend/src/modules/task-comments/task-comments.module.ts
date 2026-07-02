import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskCommentsService } from './task-comments.service';
import { TaskCommentsController } from './task-comments.controller';
import { TaskComment } from './entities/task-comment.model';
import { Task } from '../tasks/entities/task.model';
import { TaskAssignment } from '../tasks/entities/task-assignment.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { User } from '../users/entities/user.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      TaskComment,
      Task,
      TaskAssignment,
      ProjectMember,
      User,
    ]),
  ],
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService],
})
export class TaskCommentsModule {}