import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetCurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('statuses')
  findStatuses() {
    return this.tasksService.findStatuses();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateTaskDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.tasksService.create(dto, currentUser);
  }

  @Get()
  findAll(
    @Query() query: TaskQueryDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.tasksService.findAll(query, currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.tasksService.findOne(Number(id), currentUser);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.tasksService.update(Number(id), dto, currentUser);
  }

  @Post(':id/assign')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  assignUsers(
    @Param('id') id: string,
    @Body() dto: AssignTaskDto,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.tasksService.assignUsers(Number(id), dto, currentUser);
  }
}