import {Body,Controller,Get,Param,Patch,Post,Query,UseGuards,Delete} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateProjectDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.projectsService.create(dto, currentUser);
  }
  
  @Delete(':projectId/members/:userId')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
removeMember(
  @Param('projectId') projectId: string,
  @Param('userId') userId: string,
  @GetCurrentUser() currentUser: CurrentUser,
) {
  return this.projectsService.removeMember(
    Number(projectId),
    Number(userId),
    currentUser,
  );
}
  @Get()
  findAll(
    @Query() query: ProjectQueryDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.projectsService.findAll(query, currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.projectsService.findOne(Number(id), currentUser);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)

  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.projectsService.update(Number(id), dto, currentUser);
  }

  @Patch(':id/archive')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  archive(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.projectsService.archive(Number(id), currentUser);
  }

  @Post(':id/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  assignMembers(@Param('id') id: string, @Body() dto: AssignMembersDto) {
    return this.projectsService.assignMembers(Number(id), dto);
  }

  @Delete(':id')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
remove(
  @Param('id') id: string,
  @GetCurrentUser() currentUser: CurrentUser,
) {
  return this.projectsService.remove(Number(id), currentUser);
}
}
