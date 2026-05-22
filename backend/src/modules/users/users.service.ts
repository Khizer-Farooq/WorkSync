import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.model';
import { Department } from 'src/modules/departments/entities/department.model';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    @InjectModel(Department)
    private departmentModel: typeof Department,
  ) {}

  async createEmployee(dto: CreateEmployeeDto) {
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
      role: UserRole.EMPLOYEE,
      isActive: true,
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;

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
      include: [Department],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}