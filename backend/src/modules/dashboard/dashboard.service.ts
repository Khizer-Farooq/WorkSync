import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Task } from '../tasks/entities/task.model';
import { TaskStatus } from '../tasks/entities/task-status.model';
import { TaskAssignment } from '../tasks/entities/task-assignment.model';
import { Project } from '../projects/entities/project.model';
import { ProjectMember } from '../projects/entities/project-member.model';
import { Shift } from '../shifts/entities/shift.model';
import { Activity } from './entities/activity.model';
import { User } from '../users/entities/user.model';
import { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';
import { ProjectStatus } from '../../common/enums/project-status.enum';

@Injectable()
export class DashboardService {
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

    @InjectModel(Shift)
    private shiftModel: typeof Shift,

    @InjectModel(Activity)
    private activityModel: typeof Activity,
  ) {}

  async getDashboard(currentUser: CurrentUser) {
    const completedTasks = await this.getCompletedTasksCount(currentUser);
    const activeProjects = await this.getActiveProjectsCount(currentUser);
    const weeklyWorkedHours = await this.getWeeklyWorkedHours(currentUser);
    const recentActivity = await this.getRecentActivity(currentUser);

    return {
      message: 'Dashboard fetched successfully',
      data: {
        completedTasks,
        activeProjects,
        weeklyWorkedHours,
        recentActivity,
      },
    };
  }

  private async getCompletedTasksCount(currentUser: CurrentUser) {
    const completedStatus = await this.taskStatusModel.findOne({
      where: { name: 'COMPLETED' },
    });

    if (!completedStatus) {
      return 0;
    }

    if (currentUser.role === UserRole.ADMIN) {
      return this.taskModel.count({
        where: {
          statusId: completedStatus.id,
        },
      });
    }

    return this.taskModel.count({
      where: {
        statusId: completedStatus.id,
      },
      include: [
        {
          model: User,
          as: 'assignedUsers',
          where: {
            id: currentUser.id,
          },
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });
  }

  private async getActiveProjectsCount(currentUser: CurrentUser) {
    if (currentUser.role === UserRole.ADMIN) {
      return this.projectModel.count({
        where: {
          status: ProjectStatus.ACTIVE,
        },
      });
    }

    return this.projectModel.count({
      where: {
        status: ProjectStatus.ACTIVE,
      },
      include: [
        {
          model: User,
          as: 'members',
          where: {
            id: currentUser.id,
          },
          through: { attributes: [] },
        },
      ],
      distinct: true,
    });
  }

  private async getWeeklyWorkedHours(currentUser: CurrentUser) {
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);

    const whereCondition: any = {
      clockOut: {
        [Op.ne]: null,
      },
      clockIn: {
        [Op.between]: [startOfWeek, endOfWeek],
      },
    };

    if (currentUser.role === UserRole.EMPLOYEE) {
      whereCondition.userId = currentUser.id;
    }

    const shifts = await this.shiftModel.findAll({
      where: whereCondition,
    });

    const totalHours = shifts.reduce((total, shift) => {
      const start = new Date(shift.clockIn).getTime();
      const end = new Date(shift.clockOut as Date).getTime();

      const hours = (end - start) / (1000 * 60 * 60);

      return total + hours;
    }, 0);

    return Number(totalHours.toFixed(2));
  }

  private async getRecentActivity(currentUser: CurrentUser) {
    const whereCondition: any = {};

    if (currentUser.role === UserRole.EMPLOYEE) {
      whereCondition.userId = currentUser.id;
    }

    return this.activityModel.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
  }
}