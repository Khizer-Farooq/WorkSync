import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { Project } from '../../projects/entities/project.model';
import { User } from '../../users/entities/user.model';
import { TaskStatus } from './task-status.model';
import { TaskAssignment } from './task-assignment.model';
import { TaskComment } from '../../task-comments/entities/task-comment.model';

interface TaskCreationAttrs {
  projectId: number;
  statusId: number;
  createdBy: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
}

@Table({
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
})
export class Task extends Model<Task, TaskCreationAttrs> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => TaskStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare statusId: number;

  @BelongsTo(() => TaskStatus)
  declare status: TaskStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare createdBy: number;

  @BelongsTo(() => User, 'createdBy')
  declare creator: User;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dueDate: string | null;

  @BelongsToMany(() => User, () => TaskAssignment)
  declare assignedUsers: User[];

  @HasMany(() => TaskComment)
  declare comments: TaskComment[];
}
