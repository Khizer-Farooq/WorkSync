import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskCommentsService } from './task-comments.service';
import { TaskCommentsController } from './task-comments.controller';
import { TaskComment } from './entities/task-comment.model';
import { Task } from 'src/modules/tasks/entities/task.model';
import { TaskAssignment } from 'src/modules/tasks/entities/task-assignment.model';
import { ProjectMember } from 'src/modules/projects/entities/project-member.model';
import { User } from 'src/modules/users/entities/user.model';
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