import {Table,Column,Model,DataType,HasMany,} from 'sequelize-typescript';
import { Task } from './task.model';

@Table({
  tableName: 'task_statuses',
  timestamps: true,
  underscored: true,
})
export class TaskStatus extends Model<TaskStatus> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @HasMany(() => Task)
  declare tasks: Task[];
}