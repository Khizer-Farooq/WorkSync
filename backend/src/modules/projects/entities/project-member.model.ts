import {Table,Column,Model,DataType,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { Project } from './project.model';
import { User } from '../../users/entities/user.model';

interface ProjectMemberCreationAttrs {
  projectId: number;
  userId: number;
}

@Table({
  tableName: 'project_members',
  timestamps: true,
  underscored: true,
})
export class ProjectMember extends Model<
  ProjectMember,
  ProjectMemberCreationAttrs
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare projectId: number;

  @BelongsTo(() => Project)
  declare project: Project;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}
