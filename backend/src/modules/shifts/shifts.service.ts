import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Shift } from './entities/shift.model';
import { User } from 'src/modules/users/entities/user.model';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ActivityService } from '../dashboard/activity.service';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift)
    private shiftModel: typeof Shift,

    @InjectModel(User)
    private userModel: typeof User,

    private readonly activityService: ActivityService,
  ) {}

  async create(dto: CreateShiftDto, currentUser: CurrentUser) {
    const user = await this.userModel.findByPk(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.EMPLOYEE) {
      throw new BadRequestException(
        'Shift can only be created for an employee',
      );
    }

    const clockIn = new Date(dto.clockIn);
    const clockOut = new Date(dto.clockOut);

    if (clockOut <= clockIn) {
      throw new BadRequestException('Clock out must be after clock in');
    }

    const shift = await this.shiftModel.create({
      userId: dto.userId,
      clockIn,
      clockOut,
      shiftType: dto.shiftType?.trim() || 'REGULAR',
    });

    const shiftId = Number(shift.id);

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'SHIFT_CREATED',
      entityType: 'SHIFT',
      entityId: shiftId,
      metadata: {
        targetUserId: dto.userId,
        clockIn: shift.clockIn,
        clockOut: shift.clockOut,
        shiftType: shift.shiftType,
        totalHours: this.calculateWorkedHours(clockIn, clockOut),
      },
    });

    const createdShift = await this.shiftModel.findByPk(shiftId, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });

    return {
      message: 'Shift created successfully',
      data: createdShift ?? shift,
    };
  }

  async clockIn(currentUser: CurrentUser) {
    const activeShift = await this.shiftModel.findOne({
      where: {
        userId: currentUser.id,
        clockOut: null,
      },
    });

    if (activeShift) {
      throw new BadRequestException('You already have an active shift');
    }

    const shift = await this.shiftModel.create({
      userId: currentUser.id,
      clockIn: new Date(),
      clockOut: null,
      shiftType: 'REGULAR',
    });
    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'SHIFT_CLOCK_IN',
      entityType: 'SHIFT',
      entityId: shift.id,
      metadata: {
        clockIn: shift.clockIn,
        shiftType: shift.shiftType,
      },
    });

    return {
      message: 'Clocked in successfully',
      data: shift,
    };
  }

  async clockOut(currentUser: CurrentUser) {
    // if (currentUser.role !== UserRole.EMPLOYEE) {
    //   throw new ForbiddenException('Only employees can clock out');
    // }

    const activeShift = await this.shiftModel.findOne({
      where: {
        userId: currentUser.id,
        clockOut: null,
      },
    });

    if (!activeShift) {
      throw new BadRequestException('No active shift found');
    }

    await activeShift.update({
      clockOut: new Date(),
    });

    const totalHours = this.calculateWorkedHours(
      activeShift.clockIn,
      activeShift.clockOut as Date,
    );
    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'SHIFT_CLOCK_OUT',
      entityType: 'SHIFT',
      entityId: activeShift.id,
      metadata: {
        clockIn: activeShift.clockIn,
        clockOut: activeShift.clockOut,
        totalHours,
      },
    });

    return {
      message: 'Clocked out successfully',
      data: {
        shift: activeShift,
        totalHours,
      },
    };
  }

  async getMyActiveShift(currentUser: CurrentUser) {
    const activeShift = await this.shiftModel.findOne({
      where: {
        userId: currentUser.id,
        clockOut: null,
      },
    });

    return {
      message: 'Active shift fetched successfully',
      data: activeShift,
    };
  }
  async remove(id: number, currentUser: CurrentUser) {
    const shift = await this.shiftModel.findByPk(id);

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    await shift.destroy();

    await this.activityService.createActivity({
      userId: currentUser.id,
      action: 'SHIFT_DELETED',
      entityType: 'SHIFT',
      entityId: shift.id,
      metadata: {
        clockIn: shift.clockIn,
        clockOut: shift.clockOut,
        shiftType: shift.shiftType,
      },
    });

    return {
      message: 'Shift deleted successfully',
      data: null,
    };
  }

  async findAll(query: ShiftQueryDto, currentUser: CurrentUser) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'updatedAt', 'clockIn', 'clockOut'];
    const requestedSortBy = query.sortBy || '';
    const sortBy = allowedSortFields.includes(requestedSortBy)
      ? requestedSortBy
      : 'clockIn';

    const sortOrder: 'ASC' | 'DESC' =
      query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const whereCondition: any = {};

    if (currentUser.role === UserRole.EMPLOYEE) {
      whereCondition.userId = currentUser.id;
    }

    if (currentUser.role === UserRole.ADMIN && query.userId) {
      whereCondition.userId = Number(query.userId);
    }

    if (query.status === 'ACTIVE') {
      whereCondition.clockOut = null;
    }

    if (query.status === 'COMPLETED') {
      whereCondition.clockOut = {
        [Op.ne]: null,
      };
    }

    if (query.fromDate || query.toDate) {
      whereCondition.clockIn = {};

      if (query.fromDate) {
        whereCondition.clockIn[Op.gte] = new Date(query.fromDate);
      }

      if (query.toDate) {
        const toDate = new Date(query.toDate);
        toDate.setHours(23, 59, 59, 999);

        whereCondition.clockIn[Op.lte] = toDate;
      }
    }

    const userInclude: any = {
      model: User,
      attributes: ['id', 'name', 'email', 'role'],
    };
    if (query.status === 'ACTIVE') {
      whereCondition.clockOut = null;
    }

    if (query.status === 'COMPLETED') {
      whereCondition.clockOut = {
        [Op.ne]: null,
      };
    }
    if (query.search && currentUser.role === UserRole.ADMIN) {
      userInclude.where = {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
        ],
      };
    }

    const { rows, count } = await this.shiftModel.findAndCountAll({
      where: whereCondition,
      include: [userInclude],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      distinct: true,
    });

    const shifts = rows.map((shift) => {
      const plainShift = shift.toJSON() as any;

      plainShift.status = shift.clockOut ? 'COMPLETED' : 'ACTIVE';

      plainShift.totalHours = shift.clockOut
        ? this.calculateWorkedHours(shift.clockIn, shift.clockOut as Date)
        : null;

      return plainShift;
    });

    return {
      message: 'Shifts fetched successfully',
      data: {
        shifts,
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
    const shift = await this.shiftModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (
      currentUser.role === UserRole.EMPLOYEE &&
      shift.userId !== currentUser.id
    ) {
      throw new ForbiddenException('You cannot view this shift');
    }

    const plainShift = shift.toJSON() as any;

    plainShift.totalHours = shift.clockOut
      ? this.calculateWorkedHours(shift.clockIn, shift.clockOut)
      : null;

    return {
      message: 'Shift fetched successfully',
      data: plainShift,
    };
  }

  async getWeeklyWorkedHours(currentUser: CurrentUser) {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const whereCondition: any = {
      clockOut: {
        [Op.ne]: null,
      },
      clockIn: {
        [Op.between]: [startOfWeek, endOfToday],
      },
    };

    if (currentUser.role === UserRole.EMPLOYEE) {
      whereCondition.userId = currentUser.id;
    }

    const shifts = await this.shiftModel.findAll({
      where: whereCondition,
    });

    const weeklySeconds = shifts.reduce((total, shift) => {
      return (
        total +
        this.calculateWorkedSeconds(shift.clockIn, shift.clockOut as Date)
      );
    }, 0);

    const weeklyHours = Number((weeklySeconds / (60 * 60)).toFixed(2));

    return {
      message: 'Weekly worked hours fetched successfully',
      data: {
        weeklyHours,
        weeklySeconds,
      },
    };
  }

  private calculateWorkedSeconds(clockIn: Date, clockOut: Date) {
    const start = new Date(clockIn).getTime();
    const end = new Date(clockOut).getTime();

    return Math.max(0, Math.floor((end - start) / 1000));
  }

  private calculateWorkedHours(clockIn: Date, clockOut: Date) {
    const diffInHours =
      this.calculateWorkedSeconds(clockIn, clockOut) / (60 * 60);

    return Number(diffInHours.toFixed(2));
  }
}
