import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.model';
import { ProjectMember } from './entities/project-member.model';
import { User } from 'src/modules/users/entities/user.model';
import { DashboardModule } from '../dashboard/dashboard.module';
@Module({
  imports: [
  SequelizeModule.forFeature([Project, ProjectMember, User]),
  DashboardModule,
],
  
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}