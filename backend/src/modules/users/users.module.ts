import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.model';
import { Department } from '../departments/entities/department.model';
import { Project } from '../projects/entities/project.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { Task } from '../tasks/entities/task.model';
import { TaskAssignment } from '../tasks/entities/task-assignment.model';
import { Shift } from '../shifts/entities/shift.model';


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
