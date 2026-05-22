import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Task } from './task.model';
import { User } from 'src/modules/users/entities/user.model';

interface TaskAssignmentCreationAttrs {
  taskId: number;
  userId: number;
  assignedBy: number;
}

@Table({
  tableName: 'task_assignments',
  timestamps: true,
  underscored: true,
})
export class TaskAssignment extends Model<
  TaskAssignment,
  TaskAssignmentCreationAttrs
> {
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare taskId: number;

  @BelongsTo(() => Task)
  declare task: Task;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare assignedBy: number;

  @BelongsTo(() => User, 'assignedBy')
  declare assigner: User;
}
