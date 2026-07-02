import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from './entities/user.model';
import { Department } from '../departments/entities/department.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { Project } from '../projects/entities/project.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { Task } from '../tasks/entities/task.model';
import { TaskAssignment } from '../tasks/entities/task-assignment.model';
import { Shift } from '../shifts/entities/shift.model';

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
  role: UserRole;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Department)
    private departmentModel: typeof Department,

    @InjectModel(Project)
    private projectModel: typeof Project,

    @InjectModel(ProjectMember)
    private projectMemberModel: typeof ProjectMember,

    @InjectModel(Task)
    private taskModel: typeof Task,

    @InjectModel(TaskAssignment)
    private taskAssignmentModel: typeof TaskAssignment,

    @InjectModel(Shift)
    private shiftModel: typeof Shift,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.createUserRecord(dto);

    return {
      message: 'User created successfully',
      data: user,
    };
  }

  async createEmployee(dto: CreateEmployeeDto) {
    const user = await this.createUserRecord({
      ...dto,
      role: UserRole.EMPLOYEE,
    });

    return {
      message: 'Employee created successfully',
      data: user,
    };
  }

  private async createUserRecord(dto: CreateUserPayload) {
    const existingUser = await this.userModel.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (dto.departmentId) {
      const department = await this.departmentModel.findByPk(dto.departmentId);

      if (!department) {
        throw new NotFoundException('Department not found');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      departmentId: dto.departmentId || null,
      role: dto.role,
      isActive: true,
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async findAllUsers(query: UserQueryDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'email',
      'role',
    ];
    const sortBy = allowedSortFields.includes(query.sortBy || '')
      ? query.sortBy
      : 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const whereCondition: any = {};

    if (query.role) {
      whereCondition.role = query.role;
    }

    if (query.departmentId) {
      const departmentId = Number(query.departmentId);

      if (!Number.isNaN(departmentId)) {
        whereCondition.departmentId = departmentId;
      }
    }

    if (query.search?.trim()) {
      whereCondition[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${query.search.trim()}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${query.search.trim()}%`,
          },
        },
      ];
    }

    const { rows, count } = await this.userModel.findAndCountAll({
      where: whereCondition,
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
      limit,
      offset,
      order: [[sortBy || 'createdAt', sortOrder]],
      distinct: true,
    });

    return {
      message: 'Users fetched successfully',
      data: {
        users: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
        stats: await this.getUserStats(),
      },
    };
  }

  async findAllEmployees() {
    return this.userModel.findAll({
      where: {
        role: UserRole.EMPLOYEE,
      },
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async findById(id: number) {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: Department,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: {
        ...user.toJSON(),
        stats: await this.getUserActivityStats(id),
      },
    };
  }

  private async getUserStats() {
    const [total, admins, employees, active, departments] = await Promise.all([
      this.userModel.count(),
      this.userModel.count({ where: { role: UserRole.ADMIN } }),
      this.userModel.count({ where: { role: UserRole.EMPLOYEE } }),
      this.userModel.count({ where: { isActive: true } }),
      this.departmentModel.count(),
    ]);

    return {
      total,
      admins,
      employees,
      active,
      inactive: total - active,
      departments,
    };
  }

  private async getUserActivityStats(userId: number) {
    const [
      createdProjects,
      projectMemberships,
      createdTasks,
      assignedTasks,
      shiftsLogged,
    ] = await Promise.all([
      this.projectModel.count({ where: { createdBy: userId } }),
      this.projectMemberModel.count({ where: { userId } }),
      this.taskModel.count({ where: { createdBy: userId } }),
      this.taskAssignmentModel.count({ where: { userId } }),
      this.shiftModel.count({ where: { userId } }),
    ]);

    return {
      createdProjects,
      projectMemberships,
      createdTasks,
      assignedTasks,
      shiftsLogged,
    };
  }
}
