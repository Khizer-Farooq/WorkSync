import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Task } from '../tasks/entities/task.model';
import { TaskStatus } from '../tasks/entities/task-status.model';
import { TaskAssignment } from '../tasks/entities/task-assignment.model';
import { Project } from '../projects/entities/project.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { Shift } from '../shifts/entities/shift.model';
import { Activity } from './entities/activity.model';
import { User } from '../users/entities/user.model';
import { ActivityService } from './activity.service';
@Module({
  imports: [
    SequelizeModule.forFeature([
      Task,
      TaskStatus,
      TaskAssignment,
      Project,
      ProjectMember,
      Shift,
      Activity,
      User,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService,ActivityService],
  exports: [DashboardService,ActivityService],
})
export class DashboardModule {}