import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TaskComment } from './entities/task-comment.model';
import { Task } from 'src/modules/tasks/entities/task.model';
import { TaskAssignment } from 'src/modules/tasks/entities/task-assignment.model';
import { User } from 'src/modules/users/entities/user.model';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import type { CurrentUser } from '../../common/types/current-user.type';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectModel(TaskComment)
    private taskCommentModel: typeof TaskComment,

    @InjectModel(Task)
    private taskModel: typeof Task,

    @InjectModel(TaskAssignment)
    private taskAssignmentModel: typeof TaskAssignment,
  ) {}

  async create(taskId: number, dto: CreateTaskCommentDto, currentUser: CurrentUser) {
    const task = await this.taskModel.findByPk(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (currentUser.role === UserRole.EMPLOYEE) {
      const assignment = await this.taskAssignmentModel.findOne({
        where: {
          taskId,
          userId: currentUser.id,
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You are not assigned to this task');
      }
    }

    const comment = await this.taskCommentModel.create({
      taskId,
      userId: currentUser.id,
      comment: dto.comment,
    });

    return {
      message: 'Comment added successfully',
      data: comment,
    };
  }

  async findByTask(taskId: number, currentUser: CurrentUser) {
    const task = await this.taskModel.findByPk(taskId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (currentUser.role === UserRole.EMPLOYEE) {
      const assignment = await this.taskAssignmentModel.findOne({
        where: {
          taskId,
          userId: currentUser.id,
        },
      });

      if (!assignment) {
        throw new ForbiddenException('You are not assigned to this task');
      }
    }

    const comments = await this.taskCommentModel.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return {
      message: 'Comments fetched successfully',
      data: comments,
    };
  }
}