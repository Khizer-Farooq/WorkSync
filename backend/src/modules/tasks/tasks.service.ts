import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from './entities/task.model';
import { TaskStatus } from './entities/task-status.model';
import { TaskAssignment } from './entities/task-assignment.model';
import { Project } from 'src/modules/projects/entities/project.model';
import { ProjectMember } from 'src/modules/projects/entities/project-member.model';
import { User } from 'src/modules/users/entities/user.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignTaskDto } from './dto/assign-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ActivityService } from '../dashboard/activity.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,

    @InjectModel(TaskStatus)
    private taskStatusModel: typeof TaskStatus,

    @InjectModel(TaskAssignment)
    private taskAssignmentModel: typeof TaskAssignment,

    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private projectMemberModel: typeof ProjectMember,

    @InjectModel(User)
    private userModel: typeof User,

    private readonly activityService: ActivityService,
  ) {}

  async create(dto: CreateTaskDto, currentUser: CurrentUser) {
    const project = await this.projectModel.findByPk(dto.projectId);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const todoStatus = await this.taskStatusModel.findOne({
      where: { name: 'TODO' },
    });

    if (!todoStatus) {
      throw new BadRequestException('Default TODO status not found');
    }

    let assignedUsers: User[] = [];

    if (dto.assignedUserIds && dto.assignedUserIds.length > 0) {
      assignedUsers = await this.validateAssignableUsers(
        dto.projectId,
        dto.assignedUserIds,
      );
    }

    const task = await this.taskModel.create({
      projectId: dto.projectId,
      statusId: todoStatus.id,
      createdBy: currentUser.id,
      title: dto.title,
      description: dto.description || null,
      dueDate: dto.dueDate || null,
    });

    if (dto.assignedUserIds && dto.assignedUserIds.length > 0) {
      await this.createTaskAssignments(
        task.id,
        dto.assignedUserIds,
        currentUser.id,
      );
    }

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'TASK_CREATED',
      entityType: 'TASK',
      entityId: task.id,
      metadata: {
        title: task.title,
        projectTitle: project.title,
        taskStatus: todoStatus.name,
        dueDate: task.dueDate,
        ...(assignedUsers.length > 0
          ? { assignedUserNames: assignedUsers.map((user) => user.name) }
          : {}),
      },
    });

    return {
      message: 'Task created successfully',
      data: task,
    };
  }

  async findAll(query: TaskQueryDto, currentUser: CurrentUser) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'dueDate',
      'title',
    ] as const;
    type SortField = (typeof allowedSortFields)[number];
    const sortBy: SortField = allowedSortFields.includes(
      query.sortBy as SortField,
    )
      ? (query.sortBy as SortField)
      : 'createdAt';

    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const whereCondition: any = {};

    if (query.projectId) {
      whereCondition.projectId = Number(query.projectId);
    }

    if (query.search) {
      whereCondition[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    if (query.statusId) {
      whereCondition.statusId = Number(query.statusId);
    }

    if (query.fromDate && query.toDate) {
      whereCondition.dueDate = {
        [Op.between]: [query.fromDate, query.toDate],
      };
    }

    const includeCondition: any[] = [
      {
        model: Project,
        attributes: ['id', 'title', 'status'],
      },
      {
        model: TaskStatus,
        attributes: ['id', 'name'],
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email'],
      },
      {
        model: User,
        as: 'assignedUsers',
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] },
      },
    ];

    if (currentUser.role === UserRole.EMPLOYEE) {
      includeCondition[3].where = {
        id: currentUser.id,
      };
    }

    if (query.assignedUserId && currentUser.role === UserRole.ADMIN) {
      includeCondition[3].where = {
        id: Number(query.assignedUserId),
      };
    }

    const { rows, count } = await this.taskModel.findAndCountAll({
      where: whereCondition,
      include: includeCondition,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    return {
      message: 'Tasks fetched successfully',
      data: {
        tasks: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      },
    };
  }

  async findOne(id: number, currentUser: CurrentUser) {
    const task = await this.taskModel.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'title', 'status'],
        },
        {
          model: TaskStatus,
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] },
        },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (currentUser.role === UserRole.EMPLOYEE) {
      const isAssigned = task.assignedUsers.some(
        (user) => user.id === currentUser.id,
      );

      if (!isAssigned) {
        throw new ForbiddenException('You are not assigned to this task');
      }
    }

    return {
      message: 'Task fetched successfully',
      data: task,
    };
  }

  async update(id: number, dto: UpdateTaskDto, currentUser: CurrentUser) {
    const task = await this.taskModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignedUsers',
          through: { attributes: [] },
        },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (currentUser.role === UserRole.EMPLOYEE) {
      const isAssigned = task.assignedUsers.some(
        (user) => user.id === currentUser.id,
      );

      if (!isAssigned) {
        throw new ForbiddenException('You are not assigned to this task');
      }
    }

    let taskStatus: TaskStatus | null = null;

    if (dto.statusId) {
      const status = await this.taskStatusModel.findByPk(dto.statusId);

      if (!status) {
        throw new BadRequestException('Invalid task status');
      }

      taskStatus = status;
    }

    await task.update(dto);

    if (!taskStatus) {
      taskStatus = await this.taskStatusModel.findByPk(task.statusId);
    }

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'TASK_UPDATED',
      entityType: 'TASK',
      entityId: task.id,
      metadata: {
        title: task.title,
        ...(taskStatus ? { taskStatus: taskStatus.name } : {}),
        dueDate: task.dueDate,
      },
    });

    return {
      message: 'Task updated successfully',
      data: task,
    };
  }

  async assignUsers(id: number, dto: AssignTaskDto, currentUser: CurrentUser) {
    const task = await this.taskModel.findByPk(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const assignedUsers = await this.validateAssignableUsers(
      task.projectId,
      dto.userIds,
    );
    const project = await this.projectModel.findByPk(task.projectId);
    const taskStatus = await this.taskStatusModel.findByPk(task.statusId);

    await this.createTaskAssignments(id, dto.userIds, currentUser.id);
    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'TASK_ASSIGNED',
      entityType: 'TASK',
      entityId: task.id,
      metadata: {
        title: task.title,
        ...(project ? { projectTitle: project.title } : {}),
        ...(taskStatus ? { taskStatus: taskStatus.name } : {}),
        assignedUserNames: assignedUsers.map((user) => user.name),
      },
    });
    return {
      message: 'Users assigned to task successfully',
      data: null,
    };
  }

  async findStatuses() {
    const statuses = await this.taskStatusModel.findAll({
      order: [['id', 'ASC']],
    });

    return {
      message: 'Task statuses fetched successfully',
      data: statuses,
    };
  }

  private async validateAssignableUsers(projectId: number, userIds: number[]) {
    const users = await this.userModel.findAll({
      where: {
        id: {
          [Op.in]: userIds,
        },
        role: UserRole.EMPLOYEE,
      },
    });

    if (users.length !== userIds.length) {
      throw new BadRequestException('One or more assigned users are invalid');
    }

    if (
      (await this.projectMemberModel.count({
        where: {
          projectId,
          userId: {
            [Op.in]: userIds,
          },
        },
      })) !== userIds.length
    ) {
      throw new BadRequestException(
        'One or more assigned users are not members of this project',
      );
    }

    return users;
  }

  private async createTaskAssignments(
    taskId: number,
    userIds: number[],
    assignedBy: number,
  ) {
    const records = userIds.map((userId) => ({
      taskId,
      userId,
      assignedBy,
    }));

    await this.taskAssignmentModel.bulkCreate(records, {
      ignoreDuplicates: true,
    });
  }
}
