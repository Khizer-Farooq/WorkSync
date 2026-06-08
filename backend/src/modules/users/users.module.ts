import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.model';
import { Department } from 'src/modules/departments/entities/department.model';
import { Project } from 'src/modules/projects/entities/project.model';
import { ProjectMember } from 'src/modules/projects/entities/project-member.model';
import { Task } from 'src/modules/tasks/entities/task.model';
import { TaskAssignment } from 'src/modules/tasks/entities/task-assignment.model';
import { Shift } from 'src/modules/shifts/entities/shift.model';


@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Department,
      Project,
      ProjectMember,
      Task,
      TaskAssignment,
      Shift,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
