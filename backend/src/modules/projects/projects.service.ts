import {BadRequestException,ForbiddenException,Injectable,NotFoundException,} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignMembersDto } from './dto/assign-members.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ProjectStatus } from '../../common/enums/project-status.enum';
import { Project } from './entities/project.model';
import { ProjectMember } from './entities/project-member.model';
import { User } from 'src/modules/users/entities/user.model';
import { ActivityService } from '../dashboard/activity.service';




@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private projectMemberModel: typeof ProjectMember,

    @InjectModel(User)
    private userModel: typeof User,

    private readonly activityService: ActivityService,
  ) {}

  async create(dto: CreateProjectDto, currentUser: CurrentUser) {
    const project = await this.projectModel.create({
      title: dto.title,
      description: dto.description || null,
      deadline: dto.deadline || null,
      createdBy: currentUser.id,
      status: dto.status ? dto.status : ProjectStatus.ACTIVE,
    });



    if (dto.memberIds && dto.memberIds.length > 0) {
      await this.assignMembersToProject(project.id, dto.memberIds);
    }

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: project.id,
      metadata: this.getProjectActivityMetadata(project),
    });

    return {
      message: 'Project created successfully',
      data: project,
    };
  }

  async remove(id: number, currentUser: CurrentUser) {
  const project = await this.projectModel.findByPk(id);

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  await project.destroy();

  await this.activityService.createActivity({
    userId: currentUser.id,
    action: 'PROJECT_DELETED',
    entityType: 'PROJECT',
    entityId: id,
    metadata: this.getProjectActivityMetadata(project),
  });

  return {
    message: 'Project deleted successfully',
    data: null,
  };
}
  async removeMember(projectId: number, userId: number, currentUser: CurrentUser) {
  const project = await this.projectModel.findByPk(projectId);

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  const member = await this.projectMemberModel.findOne({
    where: {
      projectId,
      userId,
    },
  });

  if (!member) {
    throw new NotFoundException('Project member not found');
  }

  const removedUser = await this.userModel.findByPk(userId);

  await member.destroy();

  await this.activityService.createActivity({
    userId: currentUser.id,
    action: 'PROJECT_MEMBER_REMOVED',
    entityType: 'PROJECT',
    entityId: projectId,
    metadata: {
      ...this.getProjectActivityMetadata(project),
      removedUserName: removedUser?.name,
    },
  });

  return {
    message: 'Project member removed successfully',
    data: null,
  };
}

  async findAll(query: ProjectQueryDto, currentUser: CurrentUser) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const whereCondition: any = {};

    
    if (query.status) {
      whereCondition.status = query.status;
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

    if (currentUser.role === UserRole.ADMIN) {
      const { rows, count } = await this.projectModel.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'name', 'email', 'role'],
            through: { attributes: [] },
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email'],
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        distinct: true,
      });

      return {
        message: 'Projects fetched successfully',
        data: {
          projects: rows,
          pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
          },
        },
      };
    }
    

    const { rows, count } = await this.projectModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'members',
          where: {
            id: currentUser.id,
          },
          required: true,
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    return {
      message: 'Projects fetched successfully',
      data: {
        projects: rows,
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
    const project = await this.projectModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (currentUser.role === UserRole.EMPLOYEE) {
      const isMember = project.members.some(
        (member) => member.id === currentUser.id,
      );

      if (!isMember) {
        throw new ForbiddenException('You are not a member of this project');
      }
    }

    return {
      message: 'Project fetched successfully',
      data: project,
    };
  }

  async update(id: number, dto: UpdateProjectDto, currentUser: CurrentUser) {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await project.update(dto);

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: project.id,
      metadata: this.getProjectActivityMetadata(project),
    });

    return {
      message: 'Project updated successfully',
      data: project,
    };
  }

  async archive(id: number, currentUser: CurrentUser) {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await project.update({
      status: ProjectStatus.ARCHIVED,
    });

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'PROJECT_ARCHIVED',
      entityType: 'PROJECT',
      entityId: project.id,
      metadata: this.getProjectActivityMetadata(project),
    });

    return {
      message: 'Project archived successfully',
      data: project,
    };
  }

  async assignMembers(id: number, dto: AssignMembersDto) {
    const project = await this.projectModel.findByPk(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.assignMembersToProject(id, dto.memberIds);

    return {
      message: 'Members assigned successfully',
      data: null,
    };
  }

  private async assignMembersToProject(projectId: number, memberIds: number[]) {
    const employees = await this.userModel.findAll({
      where: {
        id: {
          [Op.in]: memberIds,
        },
        role: UserRole.EMPLOYEE,
      },
    });

    if (employees.length !== memberIds.length) {
      throw new BadRequestException('One or more employees are invalid');
    }

    const records = memberIds.map((userId) => ({
      projectId,
      userId,
    }));

    await this.projectMemberModel.bulkCreate(records, {
      ignoreDuplicates: true,
    });
  }

  private getProjectActivityMetadata(project: Project) {
    return {
      title: project.title,
      projectStatus: project.status,
    };
  }

  
}

