import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './entities/department.model';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department)
    private departmentModel: typeof Department,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const existingDepartment = await this.departmentModel.findOne({
      where: { name: dto.name },
    });

    if (existingDepartment) {
      throw new ConflictException('Department already exists');
    }

    return this.departmentModel.create({
      name: dto.name,
    });
  }

  async findAll() {
    return this.departmentModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number) {
    const department = await this.departmentModel.findByPk(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }
}