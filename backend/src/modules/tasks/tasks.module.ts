import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.model';
import { TaskStatus } from './entities/task-status.model';
import { TaskAssignment } from './entities/task-assignment.model';
import { Project } from '../projects/entities/project.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { User } from '../users/entities/user.model';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Task,
      TaskStatus,
      TaskAssignment,
      Project,
      ProjectMember,
      User,
    ]),
    DashboardModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
