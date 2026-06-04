import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Shift } from './entities/shift.model';
import { User } from 'src/modules/users/entities/user.model';
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
  ) { }

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

  async findAll(query: ShiftQueryDto, currentUser: CurrentUser) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const allowedSortFields = ['createdAt', 'updatedAt', 'clockIn', 'clockOut'];

const sortBy = allowedSortFields.includes(query.sortBy || '')
  ? (query.sortBy as string)
  : 'createdAt';

const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

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

  if (query.fromDate && query.toDate) {
    const from = new Date(query.fromDate);
    from.setHours(0, 0, 0, 0);

    const to = new Date(query.toDate);
    to.setHours(23, 59, 59, 999);

    whereCondition.clockIn = {
      [Op.between]: [from, to],
    };
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

    const weeklyHours = shifts.reduce((total, shift) => {
      return total + this.calculateWorkedHours(shift.clockIn, shift.clockOut as Date);
    }, 0);

    return {
      message: 'Weekly worked hours fetched successfully',
      data: {
        weeklyHours,
      },
    };
  }

  private calculateWorkedHours(clockIn: Date, clockOut: Date) {
    const start = new Date(clockIn).getTime();
    const end = new Date(clockOut).getTime();

    const diffInMs = end - start;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    return Number(diffInHours.toFixed(2));
  }
}