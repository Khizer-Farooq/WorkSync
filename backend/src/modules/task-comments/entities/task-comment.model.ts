import {Table,Column,Model,DataType,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { Task } from '../../tasks/entities/task.model';
import { User } from 'src/modules/users/entities/user.model';

interface TaskCommentCreationAttrs {
  taskId: number;
  userId: number;
  comment: string;
}

@Table({
  tableName: 'task_comments',
  timestamps: true,
  underscored: true,
})
export class TaskComment extends Model<TaskComment, TaskCommentCreationAttrs> {
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

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare comment: string;
}
